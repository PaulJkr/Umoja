import React, { useState } from "react";
import {
  ShoppingBag,
  History,
  User,
  Bell,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../context/authStore";
import { useNavigate } from "react-router-dom";

const tabs = [
  { id: "explore", label: "Explore", icon: ShoppingBag },
  { id: "orders", label: "My Orders", icon: History },
  { id: "profile", label: "Profile", icon: User },
];

const BuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState("explore");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            className="w-64 bg-white p-6 border-r shadow-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold text-green-600">AgriBuyer</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-left transition ${
                    activeTab === tab.id
                      ? "bg-green-600 text-white shadow"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1">
        {/* Topbar */}
        <div className="bg-white px-6 py-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)}>
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-green-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setShowNotifications(!showNotifications)}>
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button onClick={() => setShowSettings(true)}>
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                {user?.name?.charAt(0) ?? "B"}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="text-gray-600 hover:text-red-500"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === "explore" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Explore Products</h2>
              {/* TODO: Product grid with filters */}
              <div className="text-gray-500">Coming soon...</div>
            </div>
          )}
          {activeTab === "orders" && (
            <div>
              <h2 className="text-xl font-bold mb-4">My Orders</h2>
              {/* TODO: Order history from backend */}
              <div className="text-gray-500">Coming soon...</div>
            </div>
          )}
          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-bold mb-4">My Profile</h2>
              {/* TODO: Editable profile form */}
              <div className="text-gray-500">Coming soon...</div>
            </div>
          )}
        </div>
      </main>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute top-20 right-8 bg-white border shadow-lg w-72 rounded-lg z-40 p-4">
          <h4 className="font-semibold text-sm mb-2">Notifications</h4>
          <p className="text-sm text-gray-600">No new notifications</p>
        </div>
      )}

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-6 rounded-lg w-full max-w-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Settings</h3>
                <button onClick={() => setShowSettings(false)}>✕</button>
              </div>
              <p className="text-sm text-gray-600">Settings coming soon.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-6 rounded-lg w-full max-w-sm"
            >
              <h3 className="text-lg font-bold mb-2">Confirm Logout</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to logout?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuyerDashboard;
