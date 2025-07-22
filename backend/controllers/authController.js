const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.register = async (req, res) => {
  const { name, phone, password, role, location } = req.body;
  try {
    // Block public admin registrations
    if (role === "admin") {
      return res.status(403).json({ msg: "Unauthorized to register as admin" });
    }

    const exists = await User.findOne({ phone });
    if (exists) return res.status(400).json({ msg: "Phone already in use" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      phone,
      passwordHash: hash,
      role,
      location,
    });

    const token = generateToken(user);
    res.status(201).json({ token, user: { name, role, phone } });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user);
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
