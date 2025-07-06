const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const orderCtrl = require("../controllers/orderController");

router.post("/", verifyToken, orderCtrl.placeOrder);
router.get("/farmer/:id", verifyToken, orderCtrl.getFarmerOrders);
router.get("/farmer/:id/customers", verifyToken, orderCtrl.getFarmerCustomers);
router.get("/farmer/:id/stats", verifyToken, orderCtrl.getFarmerStats);

module.exports = router;
