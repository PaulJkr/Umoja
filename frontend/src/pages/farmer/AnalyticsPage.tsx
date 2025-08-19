import React from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../context/authStore";
import { useFarmerAnalytics } from "../../services/analytics";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import StatCard from "../../components/analytics/StatCard";
import LineChartCard from "../../components/analytics/LineChartCard";
import PieChartCard from "../../components/analytics/PieChartCard";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Calendar,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";

const AnalyticsPage = () => {
  const { user } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = React.useState("30 days");
  const { data, isLoading, refetch } = useFarmerAnalytics(
    user?._id,
    selectedPeriod
  );

  const handleExportPdf = () => {
    try {
      if (!data) {
        toast.error("No analytics data available to export.");
        return;
      }
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Farmer Analytics Report", 14, 22);

      doc.setFontSize(12);
      doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Time Period: ${selectedPeriod}`, 14, 38);

      let yPos = 50;

      // Summary Statistics
      doc.setFontSize(14);
      doc.text("Summary Statistics:", 14, yPos);
      yPos += 10;
      doc.setFontSize(12);
      doc.text(`Total Revenue: KSh ${data.totalRevenue.toFixed(2)}`, 14, yPos);
      yPos += 7;
      doc.text(`Total Orders: ${data.totalOrders}`, 14, yPos);
      yPos += 7;
      doc.text(
        `Average Order Value: KSh ${(data.totalOrders > 0
          ? data.totalRevenue / data.totalOrders
          : 0
        ).toFixed(2)}`,
        14,
        yPos
      );
      yPos += 7;
      doc.text(`Growth Rate: 23.5%`, 14, yPos); // Assuming this is static for now

      doc.save("farmer_analytics_report.pdf");
      toast.success("Analytics report exported successfully!");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to export analytics report.");
    }
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600 font-medium">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

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
                Analytics Dashboard
              </h1>
              <p className="text-gray-600">
                Track your farm's performance and sales insights
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex gap-3"
            >
              <motion.button
                onClick={() => toast("Filter functionality coming soon!")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filter
              </motion.button>
              <motion.button
                onClick={handleExportPdf}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>
              <motion.button
                onClick={() => refetch()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Time Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-700">Time Period:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["7 days", "30 days", "3 months", "6 months", "1 year"].map(
                  (period) => (
                    <motion.button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedPeriod === period
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {period}
                    </motion.button>
                  )
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
        >
          {/* Enhanced StatCard Wrappers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -2 }}
            className="group"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 relative overflow-hidden">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <StatCard
                  title="Total Revenue"
                  value={`KSh ${data.totalRevenue.toFixed(2)}`}
                  icon={DollarSign}
                  color="emerald"
                  delay={0.4}
                  trend="up"
                  trendValue={23.5}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -2 }}
            className="group"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 relative overflow-hidden">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <StatCard
                  title="Total Orders"
                  value={data.totalOrders}
                  icon={ShoppingCart}
                  color="blue"
                  delay={0.5}
                  trend="up"
                  trendValue={12.5}
                />
              </div>
            </div>
          </motion.div>

          {/* Additional Metric Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ y: -2 }}
            className="group"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Avg Order Value
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    KSh{" "}
                    {data.totalOrders > 0
                      ? (data.totalRevenue / data.totalOrders).toFixed(2)
                      : "0.00"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ y: -2 }}
            className="group"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Growth Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900">23.5%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Trend Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sales Trend
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Revenue over time
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              {/* <LineChartCard data={data.salesTrend} /> */}
            </div>
          </motion.div>

          {/* Sales by Product Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sales by Product
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Product performance breakdown
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Products</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              {/* <PieChartCard data={data.salesByProduct} /> */}
            </div>
          </motion.div>
        </div>

        {/* Additional Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <p className="text-2xl font-bold text-emerald-600">📈</p>
              <p className="text-sm font-medium text-gray-900 mt-2">
                Best Performing
              </p>
              <p className="text-xs text-gray-600">Product sales trending up</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-2xl font-bold text-blue-600">🎯</p>
              <p className="text-sm font-medium text-gray-900 mt-2">
                Target Progress
              </p>
              <p className="text-xs text-gray-600">75% of monthly goal</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <p className="text-2xl font-bold text-orange-600">⭐</p>
              <p className="text-sm font-medium text-gray-900 mt-2">
                Customer Rating
              </p>
              <p className="text-xs text-gray-600">4.8/5 average rating</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
