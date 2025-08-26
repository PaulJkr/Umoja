const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  deleteProduct,
  toggleUserBlock,
  updateUserRole,
  deleteUser,
  getUserDetails,
  getRawUserDetails,
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
  exportUsers,
  getOverviewStats,
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

// Stats and Dashboard
router.get("/dashboard-stats", getDashboardStats);
router.get("/overview-stats", getOverviewStats);
router.get("/recent-orders", getRecentOrders);
router.get("/stats", verifyToken, isAdmin, getDashboardStats);

// Settings
router.get("/settings", verifyToken, isAdmin, getSettings);
router.put("/settings", verifyToken, isAdmin, updateSettings);

// Users - IMPORTANT: Specific routes MUST come before parameterized routes
router.get("/users", verifyToken, isAdmin, getAllUsers);
router.get("/users/role-counts", getUserRoleCounts);
router.get("/users/export", verifyToken, isAdmin, exportUsers); // ✅ MOVED BEFORE /:id
router.get("/users/:id", verifyToken, isAdmin, getUserDetails); // ✅ Now comes after /export
router.get("/users/:id/raw", verifyToken, isAdmin, getRawUserDetails);
router.put("/users/:id/block", verifyToken, isAdmin, toggleUserBlock);
router.put("/users/:id/role", verifyToken, isAdmin, updateUserRole);
router.delete("/users/:id", verifyToken, isAdmin, deleteUser);

// Products
router.get("/products", verifyToken, isAdmin, getProducts);
router.put(
  "/products/:id/approve",
  verifyToken,
  isAdmin,
  toggleProductApproval
);
router.patch("/products/:id/stock", verifyToken, isAdmin, toggleStockStatus);
router.delete("/products/:id", verifyToken, isAdmin, deleteProduct);

// Approvals
router.get("/pending-approvals", verifyToken, isAdmin, getPendingApprovals);
router.patch("/approve-user/:id", verifyToken, isAdmin, approveUser);
router.patch("/approve-product/:id", verifyToken, isAdmin, approveProduct);

module.exports = router;
