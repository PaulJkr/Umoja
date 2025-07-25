// src/pages/admin/AdminOverview.tsx

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Users,
  ShoppingBag,
  PackageSearch,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  ArrowUpRight,
  FileBarChart,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../../api/axios";

const fetchDashboardStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data;
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
  trend,
  trendValue,
}: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    }}
    whileHover={{ y: -2, transition: { duration: 0.2 } }}
    className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-300 relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
      <Icon className="w-full h-full" />
    </div>

    <div className="relative">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend === "up"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp size={12} />
            ) : (
              <TrendingDown size={12} />
            )}
            {trendValue}%
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <p className="text-2xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
          {value}
        </p>
      </div>
    </div>
  </motion.div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 bg-slate-200 rounded-xl animate-pulse" />
      <div className="w-16 h-6 bg-slate-200 rounded-full animate-pulse" />
    </div>
    <div className="space-y-2">
      <div className="w-20 h-4 bg-slate-200 rounded animate-pulse" />
      <div className="w-16 h-8 bg-slate-200 rounded animate-pulse" />
    </div>
  </div>
);

const QuickAction = ({ icon: Icon, label, onClick }: any) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-200 text-left w-full group"
  >
    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
      <Icon size={18} className="text-slate-600" />
    </div>
    <span className="font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
      {label}
    </span>
    <ArrowUpRight
      size={16}
      className="text-slate-400 ml-auto group-hover:text-slate-600 transition-colors"
    />
  </motion.button>
);

export default function AdminOverview() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchDashboardStats,
  });

  const stats = [
    {
      label: "Total Users",
      value: data?.totalUsers?.toLocaleString() || 0,
      icon: Users,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      label: "Total Products",
      value: data?.totalProducts?.toLocaleString() || 0,
      icon: ShoppingBag,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    },
    {
      label: "Total Orders",
      value: data?.totalOrders?.toLocaleString() || 0,
      icon: PackageSearch,
      color: "bg-gradient-to-br from-amber-500 to-orange-500",
    },
    {
      label: "Total Revenue",
      value: `KSh ${data?.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
  ];

  const quickActions = [
    {
      label: "View Users",
      icon: Users,
      onClick: () => navigate("/admin/dashboard/users"),
    },
    {
      label: "Manage Products",
      icon: ShoppingBag,
      onClick: () => navigate("/admin/dashboard/products"),
    },
    {
      label: "View Reports",
      icon: FileBarChart,
      onClick: () => navigate("/admin/dashboard/reports"),
    },
    {
      label: "View Approvals",
      icon: PackageSearch,
      onClick: () => navigate("/admin/dashboard/approvals"),
    },
  ];

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
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-slate-600 flex items-center gap-2">
            <Calendar size={16} />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 font-medium cursor-pointer hover:bg-indigo-100 transition-colors"
        >
          Last 30 days
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants}>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Failed to load dashboard data
            </h3>
            <p className="text-red-600 text-sm">
              Please try refreshing the page or contact support if the issue
              persists.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <StatCard {...stat} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
            >
              <QuickAction {...action} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Recent Activity
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
          >
            View All
          </motion.button>
        </div>

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">
                  Activity item {i + 1}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
