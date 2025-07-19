const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs"); // ✅ Add bcrypt import
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

// ✅ NEW: GET /api/users/password-status/:id - check if user has password set
router.get("/password-status/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    console.log(
      `Password status check for user ${id}: has password = ${!!user.password}`
    );

    res.json({
      hasPassword: !!user.password,
      userId: id,
    });
  } catch (error) {
    console.error("Error checking password status:", error);
    res.status(500).json({
      msg: "Server error",
      error: error.message,
    });
  }
});

// ✅ Enhanced password change route that handles both password change and initial password setting
router.put("/change-password/:id", async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    console.log(`Password change request for user: ${req.params.id}`);

    // ✅ Validate input
    if (!newPassword) {
      return res.status(400).json({
        msg: "New password is required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        msg: "New password must be at least 6 characters long",
      });
    }

    // ✅ Find user
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // ✅ Debug: Check what we have
    console.log("User found:", {
      id: user._id,
      hasPassword: !!user.password,
      passwordType: typeof user.password,
      hasCompareMethod: typeof user.comparePassword,
    });

    // ✅ Handle two cases: setting initial password OR changing existing password
    if (!user.password) {
      // Case 1: User has no password set - allow setting initial password
      console.log("Setting initial password for user");

      try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          { password: hashedPassword },
          { new: true }
        );

        if (!updatedUser) {
          return res.status(404).json({ msg: "Failed to set password" });
        }

        console.log(`Initial password set for user: ${req.params.id}`);
        return res.status(200).json({
          msg: "Password set successfully! You can now use this password to log in.",
          isInitialPassword: true,
        });
      } catch (hashError) {
        console.error("Error hashing initial password:", hashError);
        return res.status(500).json({
          msg: "Error setting password",
          error: hashError.message,
        });
      }
    } else {
      // Case 2: User has existing password - require current password to change
      if (!currentPassword) {
        return res.status(400).json({
          msg: "Current password is required to change your password",
        });
      }

      // ✅ Check current password
      let isMatch = false;

      try {
        if (
          user.comparePassword &&
          typeof user.comparePassword === "function"
        ) {
          isMatch = await user.comparePassword(currentPassword);
        } else {
          isMatch = await bcrypt.compare(currentPassword, user.password);
        }
      } catch (compareError) {
        console.error("Error comparing passwords:", compareError);
        return res.status(500).json({
          msg: "Error verifying current password",
          error: compareError.message,
        });
      }

      if (!isMatch) {
        return res.status(400).json({ msg: "Incorrect current password" });
      }

      // ✅ Hash and save new password
      try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          { password: hashedPassword },
          { new: true }
        );

        if (!updatedUser) {
          return res.status(404).json({ msg: "Failed to update password" });
        }

        console.log(`Password successfully changed for user: ${req.params.id}`);
        return res.status(200).json({
          msg: "Password updated successfully!",
          isInitialPassword: false,
        });
      } catch (hashError) {
        console.error("Error hashing new password:", hashError);
        return res.status(500).json({
          msg: "Error updating password",
          error: hashError.message,
        });
      }
    }
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;
