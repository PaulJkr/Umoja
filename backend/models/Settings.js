const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  platformName: {
    type: String,
    default: "Umoja Marketplace",
  },
  commissionRate: {
    type: Number,
    default: 5,
  },
  currency: {
    type: String,
    default: "KES",
  },
  registrationsOpen: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Settings", settingsSchema);
