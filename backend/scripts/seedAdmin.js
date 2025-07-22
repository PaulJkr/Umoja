// scripts/seedAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await User.findOne({ role: "admin" });
  if (exists) {
    console.log("Admin already exists.");
    return process.exit();
  }

  const passwordHash = await bcrypt.hash("AdminStrongPassword123", 10);
  await User.create({
    name: "Super Admin",
    phone: "0724544041",
    role: "admin",
    passwordHash,
    location: "HQ",
  });

  console.log("Admin created.");
  process.exit();
};

createAdmin();
