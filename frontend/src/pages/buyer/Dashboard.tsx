import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingBag,
  History,
  Store,
  MessageSquare,
  CalendarDays,
  User,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../../context/authStore";

const tabs = [
  { id: "explore", label: "Explore", icon: ShoppingBag },
  { id: "orders", label: "My Orders", icon: History },
  { id: "marketplace", label: "Marketplace", icon: Store },
  { id: "wishlist", label: "Wishlist", icon: ShoppingBag },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "profile", label: "Profile", icon: User },
];

const BuyerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (tabId: string) => {
    navigate(`/buyer/dashboard/${tabId}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-64 bg-white p-6 border-r shadow-sm hidden md:block">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-green-600">AgriBuyer</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleNavigate(tab.id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-left transition ${
                  location.pathname.includes(tab.id)
                    ? "bg-green-600 text-white shadow"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
          <button
            onClick={handleLogout}
            className="mt-10 flex items-center space-x-3 text-red-600 hover:text-red-800"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="bg-white px-6 py-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen((prev) => !prev)}>
              {sidebarOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
            <h2 className="text-lg font-semibold text-gray-700">
              Welcome, {user?.name ?? "Buyer"}
            </h2>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default BuyerDashboard;
