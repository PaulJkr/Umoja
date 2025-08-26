import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Search,
  Heart,
  HeartCrack,
  ShoppingCart,
  Store,
  Phone,
  Filter,
  SortAsc,
  Package,
  Sprout,
  Droplet,
  Cherry,
  Grid3X3,
  List,
  Star,
  MapPin,
} from "lucide-react";
import api from "../../api/axios";
import { useAuthStore } from "../../context/authStore";
import { useWishlistStore } from "../../context/wishlistStore";
import { toast } from "react-toastify";
import { useCartStore } from "../../context/cartStore";

import { Product } from "../../services/product";

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

const ProductSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
    <div className="h-48 bg-slate-200 animate-pulse"></div>
    <div className="p-4 space-y-3">
      <div className="h-5 bg-slate-200 rounded w-3/4 animate-pulse"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
      <div className="h-6 bg-slate-200 rounded w-2/3 animate-pulse"></div>
      <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse"></div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
      </div>
    </div>
  </div>
);

const EmptyState = ({
  searchTerm,
  category,
}: {
  searchTerm: string;
  category: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center py-16 col-span-full"
  >
    <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
      <Store className="w-12 h-12 text-slate-400" />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">
      {searchTerm || category !== "all"
        ? "No products found"
        : "No products available"}
    </h3>
    <p className="text-slate-600 max-w-md mx-auto">
      {searchTerm || category !== "all"
        ? "Try adjusting your search or filter criteria to find what you're looking for."
        : "Products will appear here once sellers start listing items in the marketplace."}
    </p>
  </motion.div>
);

const MarketplacePage = () => {
  const { user, loadUserFromStorage } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const {
    data: allProducts,
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["marketplaceProducts"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data;
    },
  });

  const filteredProducts = (allProducts ?? [])
    .filter((product) => {
      return (
        (category === "all" || product.type === category) &&
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === "priceLow") return a.price - b.price;
      if (sortBy === "priceHigh") return b.price - a.price;
      if (sortBy === "nameAZ") return a.name.localeCompare(b.name);
      if (sortBy === "nameZA") return b.name.localeCompare(a.name);
      return 0;
    });

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-slate-200 rounded w-48 animate-pulse mb-2"></div>
          <div className="h-5 bg-slate-200 rounded w-64 animate-pulse"></div>
        </div>

        {/* Filters Skeleton */}
        <div className="mb-8 space-y-4">
          <div className="h-12 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="flex gap-4">
            <div className="h-10 bg-slate-200 rounded-lg w-32 animate-pulse"></div>
            <div className="h-10 bg-slate-200 rounded-lg w-32 animate-pulse"></div>
            <div className="h-10 bg-slate-200 rounded-lg w-32 animate-pulse"></div>
          </div>
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
        >
          <Store className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Failed to load marketplace
          </h3>
          <p className="text-red-700">
            We couldn't load the products right now. Please try again later.
          </p>
        </motion.div>
      </div>
    );
  }

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
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Marketplace</h1>
        </div>
        <p className="text-slate-600">
          Discover fresh produce, quality seeds, and premium fertilizers from
          local farmers
        </p>
      </motion.div>

      {/* Search and Filters */}
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
            placeholder="Search for products, seeds, fertilizers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-600" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="produce">🍎 Produce</option>
              <option value="seed">🌱 Seeds</option>
              <option value="fertilizer">💧 Fertilizers</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-slate-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            >
              <option value="default">Sort by: Default</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="nameAZ">Name: A → Z</option>
              <option value="nameZA">Name: Z → A</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Results Count */}
          <div className="text-sm text-slate-600">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""} found
          </div>
        </div>
      </motion.div>

      {/* Product Grid */}
      <AnimatePresence mode="wait">
        {filteredProducts.length === 0 ? (
          <EmptyState searchTerm={searchTerm} category={category} />
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
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className={`group relative bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200 overflow-hidden ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                {/* Wishlist Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  title="Toggle Wishlist"
                >
                  <AnimatePresence mode="wait">
                    {isInWishlist(product._id) ? (
                      <motion.div
                        key="filled"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <HeartCrack className="w-4 h-4 text-red-500" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Heart className="w-4 h-4 text-slate-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                    {/* Price */}
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
                            {product.seller.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-3 h-3" />
                          <span>{product.seller.phone}</span>
                        </div>
                      </div>
                    )}

                    <motion.button
                      onClick={() => {
                        if (product.quantity === 0) {
                          toast.error("This product is out of stock.");
                          return;
                        }
                        addToCart({
                          id: product._id,
                          name: product.name,
                          price: product.price,
                          image: product.imageUrl || "",
                          quantity: 1,
                          sellerId: product.seller?._id ?? "",
                        });
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </motion.button>
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

export default MarketplacePage;
