import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Search,
  Trash2,
  HeartCrack,
  Store,
  Phone,
  ShoppingCart,
  ExternalLink,
  Package,
  Sprout,
  Droplet,
  Cherry,
  Filter,
  Grid3X3,
  List,
  Star,
  Plus,
} from "lucide-react";
import { Product } from "../../services/product";
import { toast } from "react-toastify";
import { useWishlistStore } from "../../context/wishlistStore";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useWishlistStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  console.log("🧠 Wishlist items:", wishlist);

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case "produce":
        return <Cherry className="w-4 h-4" />;
      case "seed":
        return <Sprout className="w-4 h-4" />;
      case "fertilizer":
        return <Droplet className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case "produce":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "seed":
        return "bg-green-100 text-green-700 border-green-200";
      case "fertilizer":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const filteredWishlist = wishlist.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.type === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleRemove = (product: Product) => {
    toggleWishlist(product);
    toast.success("Removed from wishlist", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const handleViewProduct = () => {
    navigate("/buyer/dashboard/marketplace");
    toast.info("Redirecting to marketplace...", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16"
    >
      <div className="mx-auto w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-6">
        <HeartCrack className="w-12 h-12 text-pink-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {searchTerm || categoryFilter !== "all"
          ? "No matching items"
          : "Your wishlist is empty"}
      </h3>
      <p className="text-slate-600 max-w-md mx-auto mb-6">
        {searchTerm || categoryFilter !== "all"
          ? "Try adjusting your search or filter to find saved items."
          : "Save items you love for later by clicking the heart icon on any product."}
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/buyer/dashboard/marketplace")}
        className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Browse Marketplace
      </motion.button>
    </motion.div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Your Wishlist</h1>
        </div>
        <p className="text-slate-600">
          {wishlist.length === 0
            ? "Save your favorite products for later"
            : `${wishlist.length} item${
                wishlist.length !== 1 ? "s" : ""
              } saved for later`}
        </p>
      </motion.div>

      {/* Search and Filters */}
      {wishlist.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search your saved items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-600" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="produce">🍎 Produce</option>
                <option value="seed">🌱 Seeds</option>
                <option value="fertilizer">💧 Fertilizers</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-pink-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-pink-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Results Count */}
            <div className="text-sm text-slate-600">
              {filteredWishlist.length} item
              {filteredWishlist.length !== 1 ? "s" : ""} found
            </div>
          </div>
        </motion.div>
      )}

      {/* Wishlist Items */}
      <AnimatePresence mode="wait">
        {filteredWishlist.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredWishlist.map((product: Product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className={`group relative bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200 overflow-hidden ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                {/* Remove Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRemove(product)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 bg-red-100 hover:bg-red-200 border border-red-200 rounded-full flex items-center justify-center transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </motion.button>

                {/* Product Image */}
                <div
                  className={`relative ${
                    viewMode === "list" ? "w-48 flex-shrink-0" : "w-full"
                  }`}
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className={`object-cover ${
                        viewMode === "list" ? "w-full h-full" : "w-full h-48"
                      }`}
                    />
                  ) : (
                    <div
                      className={`bg-slate-100 flex items-center justify-center ${
                        viewMode === "list" ? "w-full h-full" : "w-full h-48"
                      }`}
                    >
                      {getCategoryIcon(product.type)}
                    </div>
                  )}

                  {/* Stock Badge */}
                  {product.quantity < 10 && (
                    <div className="absolute bottom-2 left-2 bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full border border-red-200">
                      Low Stock
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-slate-700 transition-colors mb-1">
                        {product.name}
                      </h3>
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(
                          product.type
                        )}`}
                      >
                        {getCategoryIcon(product.type)}
                        <span className="capitalize">{product.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-emerald-600">
                        KES {product.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-slate-600">
                        {product.quantity} available
                      </span>
                    </div>

                    {/* Seller Info */}
                    {product.seller && (
                      <div className="pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                            <Store className="w-3 h-3 text-slate-600" />
                          </div>
                          <span className="text-sm font-medium text-slate-900">
                            {product.seller.name || "Unknown"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-3 h-3" />
                          <span>{product.seller.phone || "N/A"}</span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleViewProduct}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View in Store
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WishlistPage;
