// src/pages/admin/AdminOverview.tsx

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  Users,
  ShoppingBag,
  PackageSearch,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";

import api from "../../../api/axios";

const fetchDashboardStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data;
};

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`flex items-center gap-4 p-5 bg-white rounded-lg shadow border-l-4 ${color}`}
  >
    <div className="p-2 rounded-full bg-gray-100">
      <Icon className="w-6 h-6 text-gray-700" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </motion.div>
);

export default function AdminOverview() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchDashboardStats,
  });

  const stats = [
    {
      label: "Total Users",
      value: data?.totalUsers || 0,
      icon: Users,
      color: "border-blue-500",
    },
    {
      label: "Total Products",
      value: data?.totalProducts || 0,
      icon: ShoppingBag,
      color: "border-green-500",
    },
    {
      label: "Total Orders",
      value: data?.totalOrders || 0,
      icon: PackageSearch,
      color: "border-yellow-500",
    },
    {
      label: "Total Revenue",
      value: `KSh ${data?.totalRevenue || 0}`,
      icon: DollarSign,
      color: "border-emerald-500",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-500">Failed to load dashboard data.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      )}
    </div>
  );
}
