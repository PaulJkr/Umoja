const express = require("express");
const router = express.Router();
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

// ✅ Multer setup for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ GET /api/users/sellers - fetch all farmers and suppliers
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

// ✅ PUT /api/users/profile/:id - update name, phone, location, avatar
router.put("/profile/:id", upload.single("avatar"), async (req, res) => {
  try {
    const { name, phone, location } = req.body;

    const updatedFields = {
      name,
      phone,
      location,
    };

    if (req.file) {
      updatedFields.avatar = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "Failed to update profile", error: error.message });
  }
});

module.exports = router;
