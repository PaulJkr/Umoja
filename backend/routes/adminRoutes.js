const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  deleteProduct,
  toggleUserBlock,
  updateUserRole,
  toggleProductApproval,
  getProducts,
  toggleStockStatus,
  getUserRoleCounts,
  getRecentOrders,
  getPendingApprovals,
  getSettings,
  updateSettings,
  approveUser,
  approveProduct,
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
router.get("/dashboard-stats", getDashboardStats);
router.get("/users/role-counts", getUserRoleCounts);
router.get("/recent-orders", getRecentOrders);
router.get("/stats", verifyToken, isAdmin, getDashboardStats);
router.get("/settings", verifyToken, isAdmin, getSettings);
router.get("/users", verifyToken, isAdmin, getAllUsers);
router.get("/users/role-counts", getUserRoleCounts);
router.put("/users/:id/block", verifyToken, isAdmin, toggleUserBlock);
router.put("/users/:id/role", verifyToken, isAdmin, updateUserRole);
router.put(
  "/products/:id/approve",
  verifyToken,
  isAdmin,
  toggleProductApproval
);
router.delete("/products/:id", verifyToken, isAdmin, deleteProduct);

router.patch("/products/:id/stock", verifyToken, isAdmin, toggleStockStatus);

// ✅ Products with filtering using Mongoose
router.get("/products", verifyToken, isAdmin, getProducts);

router.get("/pending-approvals", verifyToken, isAdmin, getPendingApprovals);

router.get("/settings", verifyToken, isAdmin, getSettings);
router.put("/settings", verifyToken, isAdmin, updateSettings);

router.patch("/approve-user/:id", verifyToken, isAdmin, approveUser);

module.exports = router;
