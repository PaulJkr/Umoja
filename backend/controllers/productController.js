const Product = require("../models/Product");

// Create product
exports.createProduct = async (req, res) => {
  const {
    name,
    price,
    quantity,
    type,
    category,
    description,
    harvestDate,
    certification,
  } = req.body;
  const { id: ownerId, role } = req.user;

  // Get image URL from uploaded file
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;

  if (role === "supplier" && !certification) {
    return res
      .status(400)
      .json({ msg: "Suppliers must provide certification" });
  }

  try {
    const product = await Product.create({
      ownerId,
      name,
      price,
      quantity,
      type,
      category,
      description,
      harvestDate,
      imageUrl,
      certification,
      verified: role === "farmer", // auto-verified for farmers
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ msg: "Error creating product" });
  }
};

// Get all products (public)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ verified: true }).populate(
      "ownerId",
      "name role phone"
    );

    // Transform `ownerId` into `seller`
    const renamed = products.map((product) => {
      const productObj = product.toObject();
      productObj.seller = productObj.ownerId;
      delete productObj.ownerId;
      return productObj;
    });

    res.json(renamed);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching products" });
  }
};

// Get products by owner
exports.getMyProducts = async (req, res) => {
  try {
    const myProducts = await Product.find({ ownerId: req.user.id });
    res.json(myProducts);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching your products" });
  }
};

// Update
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { id: userId, role } = req.user;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    if (product.ownerId.toString() !== userId)
      return res.status(403).json({ msg: "Not authorized" });

    Object.assign(product, req.body);
    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Error updating product" });
  }
};

// Delete
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    if (product.ownerId.toString() !== userId)
      return res.status(403).json({ msg: "Not authorized" });

    await product.remove();
    res.json({ msg: "Product deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting product" });
  }
};

exports.getProductsForAdmin = async (req, res) => {
  try {
    const products = await Product.find({}).populate("ownerId", "name");
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching products for admin" });
  }
};
exports.verifyProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    product.verified = true;
    await product.save();
    res.json({ msg: "Product verified", product });
  } catch (err) {
    res.status(500).json({ msg: "Error verifying product" });
  }
};
