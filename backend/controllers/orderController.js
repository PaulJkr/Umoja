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
