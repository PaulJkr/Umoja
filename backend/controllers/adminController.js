const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Settings = require("../models/Settings");
const sendSMS = require("../utils/smsSimulator");
const PDFDocument = require("pdfkit");

// CSV escape function - DECLARED ONLY ONCE
const escapeCsv = (value) => {
  if (value === null || value === undefined) {
    return "";
  }
  let stringValue = String(value);
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

// Dashboard Stats - SINGLE VERSION
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, orders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find({}, "totalAmount"),
    ]);

    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ msg: "Server error while fetching stats" });
  }
};

// User Management
exports.getAllUsers = async (req, res) => {
  try {
    const { search = "", role } = req.query;

    const query = {};

    // Optional text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // Optional role filter
    if (role && role !== "all") {
      query.role = role;
    }

    const users = await User.find(query, "-password"); // exclude password field
    res.json(users);
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ msg: "Server error while fetching users" });
  }
};

exports.toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.blocked = !user.blocked;
    await user.save();

    res.json({
      msg: `User has been ${user.blocked ? "blocked" : "unblocked"}`,
    });
  } catch (err) {
    console.error("Toggle block error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!["user", "admin", "farmer", "buyer", "supplier"].includes(role)) {
    return res.status(400).json({ msg: "Invalid role" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error("Update user role error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Get user details error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getRawUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Get raw user details error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getUserRoleCounts = async (req, res) => {
  try {
    const counts = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    const result = {};
    counts.forEach((item) => {
      result[item._id] = item.count;
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to get role counts" });
  }
};

// Export Users as PDF
exports.exportUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="users.pdf"');

    doc.pipe(res);

    doc
      .fontSize(16)
      .text("Umoja Marketplace - User Report", { align: "center" });
    doc.moveDown();

    // Table Headers
    doc.fontSize(10).text("ID", 50, doc.y, { width: 100, continued: true });
    doc.text("Name", 150, doc.y, { width: 100, continued: true });
    doc.text("Phone", 250, doc.y, { width: 100, continued: true });
    doc.text("Role", 350, doc.y, { width: 80, continued: true });
    doc.text("Approved", 430, doc.y, { width: 80 });
    doc.moveDown();
    doc.lineWidth(0.5);
    doc.lineCap("butt").moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Table Rows
    users.forEach((user) => {
      doc
        .fontSize(8)
        .text(user._id.toString(), 50, doc.y, { width: 100, continued: true });
      doc.text(user.name || "N/A", 150, doc.y, { width: 100, continued: true });
      doc.text(user.phone || "N/A", 250, doc.y, {
        width: 100,
        continued: true,
      });
      doc.text(user.role || "N/A", 350, doc.y, { width: 80, continued: true });
      doc.text(user.approved ? "Yes" : "No", 430, doc.y, { width: 80 });
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    console.error("Export users error:", err);
    res.status(500).json({ msg: "Server error while exporting users" });
  }
};

// Product Management
exports.toggleProductApproval = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    product.verified = !product.verified;
    await product.save();

    res.json({
      msg: `Product has been ${product.verified ? "approved" : "unapproved"}`,
    });
  } catch (err) {
    console.error("Product approval toggle error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getProducts = async (req, res) => {
  const { page = 1, limit = 10, search, type, farmer } = req.query;

  const query = {};
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  if (type) {
    query.type = type;
  }
  if (farmer) {
    query.ownerId = farmer;
  }

  try {
    const products = await Product.find(query)
      .populate("ownerId", "name")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("Get admin products error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.toggleStockStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    product.inStock = req.body.inStock;
    await product.save();

    res.json(product);
  } catch (err) {
    console.error("Toggle stock status error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.json({ msg: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Orders
exports.getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("buyerId", "name")
      .populate("sellerId", "name")
      .populate("products.productId", "name");

    const recentOrders = orders.map((order) => ({
      _id: order._id,
      buyerName: order.buyerId ? order.buyerId.name : "N/A",
      farmerName: order.sellerId ? order.sellerId.name : "N/A",
      total: order.totalAmount,
      createdAt: order.createdAt,
      products: order.products
        ? order.products.map((p) => ({
            name: p.productId && p.productId.name ? p.productId.name : "N/A",
          }))
        : [],
    }));

    res.json(recentOrders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recent orders" });
  }
};

// Approvals - SINGLE VERSION
exports.getPendingApprovals = async (req, res) => {
  try {
    const { type } = req.query;
    let pendingItems;

    if (type === "users") {
      pendingItems = await User.find({
        approved: false,
        role: { $in: ["farmer", "supplier"] },
      });
    } else if (type === "products") {
      pendingItems = await Product.find({ approved: false });
    } else {
      return res.status(400).json({ msg: "Invalid approval type specified." });
    }

    res.json(pendingItems);
  } catch (err) {
    console.error("Get pending approvals error:", err);
    res
      .status(500)
      .json({ msg: "Server error while fetching pending approvals" });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (user) {
      sendSMS(
        user.phone,
        `Karibu Umoja! Your account has been approved. You can now log in.`
      );
    }
    res.json({ message: "User approved" });
  } catch (err) {
    console.error("Approve user error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.approveProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { approved: true });
    res.json({ message: "Product approved" });
  } catch (err) {
    console.error("Approve product error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Settings - SINGLE VERSION
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings);
  } catch (err) {
    console.error("Get settings error:", err);
    res.status(500).json({ msg: "Server error while fetching settings" });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    await Settings.updateOne({}, req.body, { upsert: true });
    res.json({ message: "Settings updated" });
  } catch (err) {
    console.error("Update settings error:", err);
    res.status(500).json({ msg: "Server error while updating settings" });
  }
};
