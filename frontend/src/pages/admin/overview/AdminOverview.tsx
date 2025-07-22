import React from "react";
import { Users, BarChart3, CheckCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const adminStats = [
  {
    label: "Total Users",
    value: "1,204",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "Reports Reviewed",
    value: "318",
    icon: BarChart3,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    label: "Approvals",
    value: "87",
    icon: CheckCircle,
    color: "bg-green-100 text-green-600",
  },
  {
    label: "Verified Sellers",
    value: "42",
    icon: ShieldCheck,
    color: "bg-purple-100 text-purple-600",
  },
];

const AdminOverview = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Welcome Back, Admin
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {adminStats.map((stat, index) => (
          <motion.div
            key={index}
            className="p-4 rounded-lg shadow bg-white dark:bg-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
