const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    amount: Number,
    status: { type: String, enum: ["success", "failed"], default: "success" },
    mpesaReceipt: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
