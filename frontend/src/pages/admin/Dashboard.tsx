import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileBarChart,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../context/authStore";
import { Button } from "../../components/ui/button";
import { LogoutConfirmation } from "../../components/LogoutConfirmation";

const navItems = [
  {
    name: "Overview",
    path: "/admin/dashboard/overview",
    icon: LayoutDashboard,
  },
  { name: "Users", path: "/admin/dashboard/users", icon: Users },
  {
    name: "Products",
    path: "/admin/dashboard/products",
    icon: LayoutDashboard,
  },
  { name: "Reports", path: "/admin/dashboard/reports", icon: FileBarChart },
  { name: "Approvals", path: "/admin/dashboard/approvals", icon: ShieldCheck },
  { name: "Settings", path: "/admin/dashboard/settings", icon: Settings },
];

const AdminDashboard = () => {
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const sidebarVariants = {
    open: {
      width: 280,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    closed: {
      width: 80,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const contentVariants = {
    open: {
      marginLeft: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    closed: {
      marginLeft: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      {/* @ts-ignore */}
      <motion.aside
        variants={sidebarVariants}
        animate={sidebarOpen ? "open" : "closed"}
        className="bg-white border-r border-slate-200 flex flex-col shadow-sm relative z-30"
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <motion.div
            initial={false}
            animate={{
              opacity: sidebarOpen ? 1 : 0,
              scale: sidebarOpen ? 1 : 0.8,
            }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            {sidebarOpen && (
              <span className="text-xl font-bold text-slate-800">
                Umoja Admin
              </span>
            )}
          </motion.div>

          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <motion.div
              animate={{ rotate: sidebarOpen ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.div>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map(({ name, path, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <motion.div
                key={name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  onClick={() => navigate(path)}
                  className={`w-full justify-start gap-3 h-11 px-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm"
                      : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                  }`}
                  variant="ghost"
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-indigo-600" : ""}
                  />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="font-medium"
                      >
                        {name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-2 w-2 h-2 bg-indigo-600 rounded-full"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Button>
              </motion.div>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="px-4 py-4 border-t border-slate-100">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              onClick={handleLogout}
              className="w-full justify-start gap-3 h-11 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
              variant="ghost"
            >
              <LogOut size={20} />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="font-medium"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Welcome back, {user?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* User Menu */}
              <div className="relative">
                <Button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  variant="ghost"
                  className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-slate-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-500">Administrator</p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900">
                          {user?.name}
                        </p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                      </div>
                      <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        Profile Settings
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        Preferences
                      </button>
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        {/* @ts-ignore */}
        <motion.main
          variants={contentVariants}
          initial="closed"
          animate="open"
          className="flex-1 overflow-y-auto bg-slate-50"
        >
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </motion.main>
      </div>

      {/* Logout Modal */}
      <LogoutConfirmation
        open={showLogoutModal}
        onConfirm={logout}
        onCancel={() => setShowLogoutModal(false)}
      />

      {/* Click outside handler for user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
