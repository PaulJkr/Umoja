import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingBag,
  ShoppingCart,
  DollarSign,
  Calendar,
  Download,
  Filter,
  Eye,
  FileText,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Package,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api/axios";
import { Skeleton } from "../../../components/ui/skeleton";
import { Button } from "../../../components/ui/button";

const AdminReports = () => {
  const [dateRange, setDateRange] = useState("30");

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const res = await api.get("/admin/dashboard-stats");
      return res.data;
    },
  });

  const { data: recentOrders, isLoading: loadingOrders } = useQuery({
    queryKey: ["admin-recent-orders"],
    queryFn: async () => {
      const res = await api.get("/admin/recent-orders");
      return res.data;
    },
  });

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Reports & Analytics
          </h1>
          <p className="text-slate-600 mt-1">
            Comprehensive insights into your platform performance
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-slate-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
          </div>
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {loadingStats ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 border border-slate-200"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            </div>
          ))
        ) : (
          <>
            <EnhancedStatCard
              label="Total Users"
              value={stats?.totalUsers || 0}
              icon={Users}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
              trend="up"
              trendValue={12}
              delay={0}
            />
            <EnhancedStatCard
              label="Total Products"
              value={stats?.totalProducts || 0}
              icon={ShoppingBag}
              color="bg-gradient-to-br from-emerald-500 to-emerald-600"
              trend="up"
              trendValue={8}
              delay={0.1}
            />
            <EnhancedStatCard
              label="Total Orders"
              value={stats?.totalOrders || 0}
              icon={ShoppingCart}
              color="bg-gradient-to-br from-amber-500 to-orange-500"
              trend="down"
              trendValue={3}
              delay={0.2}
            />
            <EnhancedStatCard
              label="Total Revenue"
              value={`Ksh ${stats?.totalRevenue?.toLocaleString() || 0}`}
              icon={DollarSign}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
              trend="up"
              trendValue={15}
              delay={0.3}
            />
          </>
        )}
      </motion.div>

      {/* Quick Reports */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <QuickReportCard
          title="User Growth"
          description="Monthly user registration trends"
          icon={BarChart3}
          color="from-blue-500 to-indigo-600"
        />
        <QuickReportCard
          title="Sales Analysis"
          description="Product performance metrics"
          icon={PieChart}
          color="from-emerald-500 to-green-600"
        />
        <QuickReportCard
          title="Revenue Trends"
          description="Financial performance overview"
          icon={TrendingUp}
          color="from-purple-500 to-pink-600"
        />
      </motion.div>

      {/* Recent Orders */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-slate-200 shadow-sm"
      >
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Recent Orders
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Latest transactions on the platform
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter size={14} />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Eye size={14} />
                View All
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loadingOrders ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : !recentOrders?.length ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">
                No recent orders
              </h3>
              <p className="text-slate-500 text-sm">
                Orders will appear here once customers start purchasing.
              </p>
            </motion.div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Farmer
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Products
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {recentOrders.map((order: any, index: number) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                              <User size={14} className="text-white" />
                            </div>
                            <span className="font-medium text-slate-900">
                              {order.buyerName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-slate-700">
                              {order.farmerName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="max-w-xs">
                            <p className="text-slate-900 truncate">
                              {order.products
                                .map((p: any) => p.name)
                                .join(", ")}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {order.products.length} item
                              {order.products.length > 1 ? "s" : ""}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} className="text-slate-400" />
                            <span className="font-semibold text-slate-900">
                              Ksh {order.total?.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 text-slate-600">
                            <Calendar size={12} />
                            <span className="text-sm">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                            Completed
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const EnhancedStatCard = ({
  label,
  value,
  icon: Icon,
  color,
  trend,
  trendValue,
  delay,
}: {
  label: string;
  value: number | string;
  icon: any;
  color: string;
  trend: "up" | "down";
  trendValue: number;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
    whileHover={{ y: -2, transition: { duration: 0.2 } }}
    className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
  >
    {/* Background Pattern */}
    <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
      <Icon className="w-full h-full" />
    </div>

    <div className="relative">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === "up"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {trend === "up" ? (
            <ArrowUpRight size={12} />
          ) : (
            <ArrowDownRight size={12} />
          )}
          {trendValue}%
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <p className="text-2xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  </motion.div>
);

const QuickReportCard = ({
  title,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  description: string;
  icon: any;
  color: string;
}) => (
  <motion.div
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
  >
    <div
      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
    >
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
      {title}
    </h3>
    <p className="text-slate-600 text-sm mb-4">{description}</p>
    <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium group-hover:gap-3 transition-all duration-200">
      <span>View Report</span>
      <ArrowUpRight
        size={14}
        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200"
      />
    </div>
  </motion.div>
);

export default AdminReports;
