const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    type: {
      type: String,
      enum: ["produce", "seed", "fertilizer"],
      required: true,
    },
    category: { type: String },
    harvestDate: { type: Date }, // optional, only for produce
    imageUrl: { type: String },
    certification: { type: String }, // for seed/fertilizer
    verified: { type: Boolean, default: false }, // admin approval for suppliers
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
