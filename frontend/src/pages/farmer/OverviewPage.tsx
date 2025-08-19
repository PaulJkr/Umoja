import React from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../context/authStore";
import { useFarmerProducts } from "../../services/product";
import { useFarmerOrders } from "../../services/order";
import ProductCard from "../../components/ProductCard";
import {
  ShoppingBag,
  Users,
  BarChart,
  TrendingUp,
  ArrowUpRight,
  Package,
  Link,
} from "lucide-react";

// Enhanced StatCard component with modern design
type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down";
  color?: string;
  index?: number;
};

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  trend,
  trendDirection = "up",
  color = "emerald",
  index = 0,
}) => {
  const colorClasses = {
    emerald: "from-emerald-50 to-emerald-100 text-emerald-600 bg-emerald-100",
    blue: "from-blue-50 to-blue-100 text-blue-600 bg-blue-100",
    purple: "from-purple-50 to-purple-100 text-purple-600 bg-purple-100",
    orange: "from-orange-50 to-orange-100 text-orange-600 bg-orange-100",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group cursor-pointer"
    >
      {/* Background gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          colorClasses[color as keyof typeof colorClasses].split(" ")[0]
        } ${
          colorClasses[color as keyof typeof colorClasses].split(" ")[1]
        } opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`p-3 rounded-xl ${colorClasses[
              color as keyof typeof colorClasses
            ]
              .split(" ")
              .slice(2)
              .join(" ")}`}
          >
            {icon}
          </motion.div>
          {trend && (
            <div
              className={`flex items-center space-x-1 text-sm font-medium ${
                trendDirection === "up" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              <TrendingUp
                className={`w-4 h-4 ${
                  trendDirection === "down" ? "rotate-180" : ""
                }`}
              />
              <span>{trend}</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>

        {/* Hover indicator */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ArrowUpRight className="w-4 h-4 text-gray-400" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const OverviewPage = () => {
  const { user } = useAuthStore();
  const farmerId = user?._id;

  const { data: products = [] } = useFarmerProducts();
  const { data: orders = [] } = useFarmerOrders();

  type Order = {
    totalPrice: number;
    buyerId: string;
    // add other fields if needed
  };

  const totalSales = orders.reduce(
    (acc: number, order: Order) => acc + order.totalPrice,
    0
  );
  const totalOrders = new Set(orders.map((order: Order) => order.buyerId)).size;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your farm today
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
        >
          <StatCard
            icon={<Package className="w-5 h-5" />}
            title="Total Products"
            value={products.length.toString()}
            color="emerald"
            index={0}
          />
          <StatCard
            icon={<BarChart className="w-5 h-5" />}
            title="Total Sales"
            value={`KES ${totalSales.toLocaleString()}`}
            color="blue"
            index={1}
          />
          <StatCard
            icon={<Users className="w-5 h-5" />}
            title="Total Orders"
            value={totalOrders.toString()}
            color="purple"
            index={2}
          />
        </motion.div>

        {/* Recent Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Recent Products
              </h2>
              <p className="text-gray-600 text-sm">
                Your latest products and their performance
              </p>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/farmer/products"
                className="mt-4 md:mt-0 px-4 py-2 text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 group"
              >
                View All Products
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products yet
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by adding your first product
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {products.slice(0, 6).map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OverviewPage;
