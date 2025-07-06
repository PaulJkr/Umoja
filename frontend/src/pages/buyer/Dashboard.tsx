// src/pages/buyer/BuyerDashboard.tsx
import React, { useState, useEffect } from "react";
import {
  Home,
  ShoppingBag,
  Store,
  MessageSquare,
  Calendar,
  User,
  Search,
  Bell,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "../../context/authStore";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "marketplace", label: "Marketplace", icon: Store },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "profile", label: "Profile", icon: User },
];

const BuyerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, loadUserFromStorage } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const handleTabClick = (id: string) => {
    navigate(`/buyer/${id}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } transition-all duration-300 bg-white border-r p-4 flex flex-col space-y-6`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between">
          <h2
            className={`font-bold text-lg text-green-600 ${
              !sidebarOpen && "hidden"
            }`}
          >
            AgriBuyer
          </h2>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-all ${
                location.pathname.includes(tab.id)
                  ? "bg-green-600 text-white shadow"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="bg-white px-6 py-4 border-b flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-green-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
            <Settings className="w-5 h-5 text-gray-600 cursor-pointer" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                {user?.name?.charAt(0).toUpperCase() ?? "B"}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.name ?? "Buyer"}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
