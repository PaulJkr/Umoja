import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../context/authStore";
import { useFarmerProducts, useDeleteProduct } from "../../services/product";
import ProductCard from "../../components/ProductCard";
import { Button } from "../../components/ui/button";
import { Plus, Package, Search, Filter, Grid3X3, List } from "lucide-react";
import { useState } from "react";
import AddProductModal from "../dashboard/components/AddProductModal";
import EditProductModal from "./EditProductModal";
import { Product } from "../../services/product";

const ProductsPage = () => {
  const { user } = useAuthStore();
  const farmerId = user?._id;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products = [], isLoading } = useFarmerProducts();
  const { mutate: deleteProduct } = useDeleteProduct();

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId);
    }
  };

  // Filter products based on search query (preserved logic)
  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading Skeleton Component
  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl p-6 animate-pulse">
      <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Products
              </h1>
              <p className="text-gray-600">
                Manage your product inventory and add new items
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Plus size={18} />
                Add Product
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Filters & Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">View:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-emerald-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-emerald-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700"
            >
              <Filter className="w-4 h-4" />
              Filter
            </motion.button>
          </div>

          {/* Results Count */}
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 pt-4 border-t border-gray-100"
            >
              <p className="text-sm text-gray-600">
                Found {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Products Content */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[...Array(6)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchQuery ? "No products found" : "No products yet"}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchQuery
                    ? `No products match your search for "${searchQuery}". Try adjusting your search terms.`
                    : "Start building your inventory by adding your first product."}
                </p>
                {!searchQuery && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => setIsAddModalOpen(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 mx-auto"
                    >
                      <Plus size={18} />
                      Add Your First Product
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <ProductCard
                    product={product}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Summary */}
        {!isLoading && filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {products.length}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  Total Products
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">
                  {filteredProducts.length}
                </p>
                <p className="text-sm text-gray-600 font-medium">Showing</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {products.filter((p) => p.status === "active").length ||
                    products.length}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  Active Products
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Add Product Modal */}
        <AddProductModal open={isAddModalOpen} setOpen={setIsAddModalOpen} />

        {/* Edit Product Modal */}
        {selectedProduct && (
          <EditProductModal
            open={isEditModalOpen}
            setOpen={setIsEditModalOpen}
            product={selectedProduct}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
