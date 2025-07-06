const express = require("express");
const router = express.Router();
const paymentCtrl = require("../controllers/paymentController");

router.post("/callback", paymentCtrl.simulateCallback);

module.exports = router;
