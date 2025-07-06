const express = require("express");
const verifyToken = require("../middleware/auth");
const allowRoles = require("../middleware/rbac");
const router = express.Router();

router.get(
  "/protected",
  verifyToken,
  allowRoles("admin", "supplier"),
  (req, res) => {
    res.json({
      msg: `Hello ${req.user.role}, you accessed a protected route!`,
    });
  }
);

module.exports = router;
