import {
  Leaf,
  Home,
  Package,
  ShoppingCart,
  TrendingUp,
  Calendar,
  Users,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Newspaper,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useAuthStore } from "../../context/authStore";

const navItems = [
  { label: "Overview", icon: Home, path: "overview" },
  { label: "Products", icon: Package, path: "products" },
  { label: "Orders", icon: ShoppingCart, path: "orders" },
  { label: "Analytics", icon: TrendingUp, path: "analytics" },
  { label: "Calendar", icon: Calendar, path: "calendar" },
  { label: "Customers", icon: Users, path: "customers" },
  { label: "News", icon: Newspaper, path: "news" },
  { label: "Profile", icon: User, path: "profile" },
];

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  return (
    <motion.aside
      animate={{
        width: collapsed ? 72 : 280,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white border-r border-gray-200 h-screen flex flex-col shadow-sm relative"
    >
      {/* Header with logo */}
      <div className="flex items-center justify-center px-4 py-6 border-b border-gray-100">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-3"
            >
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-gray-900 tracking-tight">
                  FarmHub
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Management
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm"
            >
              <Leaf className="w-5 h-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle button - always visible */}
      <div className="px-3 py-2 border-b border-gray-100">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCollapsed(!collapsed)}
          className="w-full p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="h-4 w-4 text-gray-600 group-hover:text-gray-900" />
          </motion.div>
        </motion.button>
      </div>

      {/* Navigation links */}
      <nav className="flex flex-col flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, icon: Icon, path }, index) => {
          const isActive = location.pathname.includes(path);
          return (
            <motion.div
              key={path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative group"
            >
              <Link
                to={`/dashboard/farmer/${path}`}
                className={clsx(
                  "flex items-center rounded-xl transition-all duration-200 relative overflow-hidden group",
                  collapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                  isActive
                    ? "bg-emerald-50 text-emerald-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={clsx(
                    "rounded-lg transition-colors flex items-center justify-center",
                    collapsed ? "p-0" : "p-1.5",
                    isActive ? "bg-emerald-100" : "group-hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </motion.div>

                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="font-medium text-sm whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 10 }}
                  whileHover={{ opacity: 1, scale: 1, x: 0 }}
                  className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 pointer-events-none"
                >
                  {label}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </nav>

      {/* Logout section */}
      <motion.div
        className="p-3 border-t border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className={clsx(
            "flex items-center w-full rounded-xl transition-all duration-200 group relative",
            collapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
            "text-red-600 hover:text-red-700 hover:bg-red-50"
          )}
        >
          <motion.div
            whileHover={{ rotate: 5 }}
            className={clsx(
              "rounded-lg group-hover:bg-red-100 transition-colors flex items-center justify-center",
              collapsed ? "p-0" : "p-1.5"
            )}
          >
            <LogOut className="h-4 w-4" />
          </motion.div>

          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="font-medium text-sm whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>

          {/* Logout tooltip for collapsed state */}
          {collapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 10 }}
              whileHover={{ opacity: 1, scale: 1, x: 0 }}
              className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 pointer-events-none"
            >
              Logout
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
            </motion.div>
          )}
        </motion.button>
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;
