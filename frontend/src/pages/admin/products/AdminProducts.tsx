import React, { useState } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Download,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAdminProducts } from "../../../hooks/useAdminProducts";
import AdminProductCard from "../../../components/AdminProductCard";
import { Skeleton } from "../../../components/ui/skeleton";
import { Button } from "../../../components/ui/button";

const AdminProducts = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState("newest");

  const { data, isLoading } = useAdminProducts({
    page,
    limit: 10,
    search: searchTerm,
    sort: sortBy,
  });

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;
  const totalProducts = data?.products.length || 0;

  const handleExport = () => {
    const doc = new jsPDF();
    doc.text("Product List", 20, 10);
    autoTable(doc, {
      head: [["Name", "Type", "Price", "In Stock", "Farmer"]],
      body: products.map((product) => [
        product.name,
        product.type,
        `Ksh ${product.price.toLocaleString()}`,
        product.inStock ? "Yes" : "No",
        product.ownerId?.name || "Unknown",
      ]),
    });
    doc.save("products.pdf");
  };

  const ProductSkeleton = () => (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-lg" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const pageNumbers = [];
  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, page + 2);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Product Management
          </h1>
          <p className="text-slate-600 mt-1">
            Manage and monitor all platform products ({totalProducts} total)
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download size={16} />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total Products
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {totalProducts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Active</p>
              <p className="text-2xl font-bold text-slate-900">--</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Pending</p>
              <p className="text-2xl font-bold text-slate-900">--</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Rejected</p>
              <p className="text-2xl font-bold text-slate-900">--</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters and Controls */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="price">Price Low-High</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="px-3 py-2"
              >
                <List size={16} />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="px-3 py-2"
              >
                <Grid3X3 size={16} />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Products List */}
      <motion.div variants={itemVariants}>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))}
          </div>
        ) : !products.length ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-12 text-center border border-slate-200"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No products found
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm
                ? "Try adjusting your search criteria."
                : "Get started by adding your first product."}
            </p>
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
              <Plus size={16} />
              Add Product
            </Button>
          </motion.div>
        ) : (
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }`}
          >
            <AnimatePresence>
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <AdminProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing page {page} of {totalPages}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="px-3"
              >
                <ChevronLeft size={16} />
                <ChevronLeft size={16} className="-ml-1" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3"
              >
                <ChevronLeft size={16} />
              </Button>

              <div className="flex gap-1">
                {pageNumbers.map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className="w-10 h-10"
                  >
                    {pageNum}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3"
              >
                <ChevronRight size={16} />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="px-3"
              >
                <ChevronRight size={16} />
                <ChevronRight size={16} className="-ml-1" />
              </Button>
            </div>

            <div className="text-sm text-slate-600">
              Total: {totalProducts} products
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminProducts;
