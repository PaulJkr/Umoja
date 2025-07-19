import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Home,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Calendar,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../context/authStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";

const tabs = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "customers", label: "Customers", icon: Users },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "profile", label: "Profile", icon: User },
];

const FarmerDashboardLayout = () => {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        animate={{
          width: collapsed ? 80 : 280,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white border-r border-gray-200 flex flex-col shadow-sm relative"
      >
        {/* Gradient overlay for subtle depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Header with brand and collapse button */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <AnimatePresence mode="wait">
                {!collapsed ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-xl shadow-sm">
                      <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <h2 className="font-bold text-xl text-gray-900 tracking-tight">
                        Umoja Farms
                      </h2>
                      <span className="text-xs text-gray-500 font-medium">
                        Dashboard
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-xl shadow-sm mx-auto"
                  >
                    <Leaf className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>

              {!collapsed && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCollapsed(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600 group-hover:text-gray-900" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Expand button when collapsed */}
          {collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-3 py-2 border-b border-gray-100"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCollapsed(false)}
                className="w-full p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group flex items-center justify-center"
              >
                <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-gray-900" />
              </motion.button>
            </motion.div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            {tabs.map((tab, index) => (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <NavLink
                  to={tab.id}
                  className={({ isActive }) =>
                    `flex items-center rounded-xl transition-all duration-200 relative overflow-hidden group ${
                      collapsed ? "justify-center p-3" : "gap-3 px-4 py-3"
                    } ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-full"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}

                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`rounded-lg transition-colors flex items-center justify-center ${
                          collapsed ? "p-0" : "p-1.5"
                        } ${
                          isActive
                            ? "bg-emerald-100"
                            : "group-hover:bg-gray-100"
                        }`}
                      >
                        <tab.icon className="h-4 w-4" />
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
                            {tab.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </NavLink>

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 10 }}
                    whileHover={{ opacity: 1, scale: 1, x: 0 }}
                    className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 pointer-events-none"
                  >
                    {tab.label}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </nav>

          {/* Logout Section */}
          <motion.div
            className="p-3 border-t border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setLogoutOpen(true)}
              className={`flex items-center w-full rounded-xl transition-all duration-200 group relative ${
                collapsed ? "justify-center p-3" : "gap-3 px-4 py-3"
              } text-red-600 hover:text-red-700 hover:bg-red-50`}
            >
              <motion.div
                whileHover={{ rotate: 5 }}
                className={`rounded-lg group-hover:bg-red-100 transition-colors flex items-center justify-center ${
                  collapsed ? "p-0" : "p-1.5"
                }`}
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
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Logout Confirmation Modal */}
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="max-w-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Confirm Logout
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setLogoutOpen(false)}
                className="flex-1 border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Logout
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FarmerDashboardLayout;
