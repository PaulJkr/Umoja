const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ GET /api/users/sellers - fetch all farmers and suppliers (name + phone)
router.get("/sellers", async (req, res) => {
  try {
    const sellers = await User.find(
      { role: { $in: ["farmer", "supplier"] } },
      "_id name phone role location"
    );
    res.status(200).json(sellers);
  } catch (err) {
    console.error("Error fetching sellers:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
