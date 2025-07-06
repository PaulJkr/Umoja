const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const orderCtrl = require("../controllers/orderController");

router.post("/", verifyToken, orderCtrl.placeOrder);

module.exports = router;
