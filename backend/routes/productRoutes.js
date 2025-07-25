const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const allowRoles = require("../middleware/rbac");
const productCtrl = require("../controllers/productController");

// Public
router.get("/", productCtrl.getProducts);

// Authenticated
const upload = require("../middleware/upload");

router.post(
  "/",
  verifyToken,
  allowRoles("farmer", "supplier"),
  upload,
  productCtrl.createProduct
);
router.get("/mine", verifyToken, productCtrl.getMyProducts);
router.put("/:id", verifyToken, productCtrl.updateProduct);
router.delete("/:id", verifyToken, productCtrl.deleteProduct);

router.get("/admin", productCtrl.getProductsForAdmin);

// Admin only
router.put(
  "/verify/:id",
  verifyToken,
  allowRoles("admin"),
  productCtrl.verifyProduct
);

module.exports = router;
