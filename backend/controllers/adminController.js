const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

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

// Block or unblock a user
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

// Update user role
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
