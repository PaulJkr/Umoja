const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
} = require("../controllers/adminController");
const verifyToken = require("../middleware/auth");

// Import Mongoose models
const Product = require("../models/Product");
const User = require("../models/User");

// Admin-only middleware
const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }
  next();
};

// Stats and Users
router.get("/stats", verifyToken, isAdmin, getDashboardStats);
router.get("/users", verifyToken, isAdmin, getAllUsers);

// ✅ Products with filtering using Mongoose
router.get("/products", verifyToken, isAdmin, async (req, res) => {
  const { category, type, farmer, search } = req.query;

  try {
    const filter = {};

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    if (type) {
      filter.type = { $regex: type, $options: "i" };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }, // If you don't use description, remove this
      ];
    }

    const products = await Product.find(filter)
      .select("name category type price imageUrl ownerId")
      .populate({ path: "ownerId", select: "name" }) // ✅ corrected
      .exec();

    // Optional: filter by farmer name after population
    let filteredProducts = products;
    if (farmer) {
      filteredProducts = products.filter((p) =>
        p.ownerId?.name?.toLowerCase().includes(farmer.toLowerCase())
      );
    }

    res.json(filteredProducts);
  } catch (error) {
    console.error("Admin get filtered products error:", error.message);
    res.status(500).json({ msg: "Server error while fetching products" });
  }
});

module.exports = router;
