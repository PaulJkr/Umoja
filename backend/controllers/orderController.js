const Order = require("../models/Order");
const Transaction = require("../models/Transaction");
const User = require("../models/User"); // ✅ Needed to get seller's phone
const sendSMS = require("../utils/smsSimulator");

exports.placeOrder = async (req, res) => {
  const { cartItems } = req.body;
  const buyerId = req.user.id;

  if (!cartItems || cartItems.length === 0)
    return res.status(400).json({ msg: "Empty cart" });

  try {
    const sellerId = cartItems[0].sellerId; // assume single-seller cart

    const order = await Order.create({
      buyerId,
      sellerId,
      products: cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      })),
    });

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const fakeTransactionId = "MP" + Date.now();

    await Transaction.create({
      orderId: order._id,
      amount: total,
      status: "success",
      mpesaReceipt: fakeTransactionId,
    });

    order.status = "success";
    order.transactionId = fakeTransactionId;
    await order.save();

    // ✅ Send SMS to buyer
    sendSMS(
      req.user.phone || "0712345678",
      `🧾 Order #${order._id} placed. Amount: KES ${total}. Txn: ${fakeTransactionId}`
    );

    // ✅ Optionally send SMS to seller
    const seller = await User.findById(sellerId);
    if (seller?.phone) {
      sendSMS(
        seller.phone,
        `📦 You have a new order #${order._id}. Buyer phone: ${req.user.phone}`
      );
    }

    res.status(201).json({ msg: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ msg: "Order failed", error: err.message });
  }
};
exports.getFarmerOrders = async (req, res) => {
  const farmerId = req.params.id;

  try {
    const orders = await Order.find({ sellerId: farmerId })
      .populate("buyerId", "name phone")
      .populate("products.productId", "name price");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching orders", error: err.message });
  }
};
exports.getFarmerCustomers = async (req, res) => {
  const farmerId = req.params.id;

  try {
    const orders = await Order.find({ sellerId: farmerId }).populate(
      "buyerId",
      "name phone"
    );

    const uniqueCustomers = Object.values(
      orders.reduce((acc, order) => {
        const buyer = order.buyerId;
        acc[buyer._id] = buyer;
        return acc;
      }, {})
    );

    res.json(uniqueCustomers);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Error fetching customers", error: err.message });
  }
};
exports.getFarmerStats = async (req, res) => {
  const farmerId = req.params.id;
  try {
    const orders = await Order.find({ sellerId: farmerId });

    // Revenue trend per day for last 30 days
    const revenuePerDay = {};
    orders.forEach((o) => {
      const day = o.createdAt.toISOString().split("T")[0];
      const total = o.products.reduce(
        (sum, p) => sum + p.quantity * (p.productPrice || 0),
        0
      );
      revenuePerDay[day] = (revenuePerDay[day] || 0) + total;
    });

    // Top 5 selling products by quantity
    const productCounts = {};
    orders.forEach((o) => {
      o.products.forEach((p) => {
        const key = p.productId.toString();
        productCounts[key] = (productCounts[key] || 0) + p.quantity;
      });
    });
    const topProducts = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([prodId, qty]) => ({ productId: prodId, quantity: qty }));

    res.json({ revenuePerDay, topProducts });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching stats", error: err.message });
  }
};
exports.getBuyerOrders = async (req, res) => {
  const buyerId = req.params.id;

  try {
    const orders = await Order.find({ buyerId })
      .populate("products.productId", "name price type")
      .populate("sellerId", "name phone");

    const formatted = orders.map((order) => ({
      _id: order._id,
      products: order.products.map((p) => ({
        productId: {
          name: p.productId?.name || "Product",
          price: p.productId?.price || 0,
          type: p.productId?.type || "general",
        },
        quantity: p.quantity,
      })),
      sellerId: order.sellerId,
      status: order.status,
      createdAt: order.createdAt,
      transactionId: order.transactionId,
    }));

    res.json(formatted);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Error fetching buyer orders", error: err.message });
  }
};
