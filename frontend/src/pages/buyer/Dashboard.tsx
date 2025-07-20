import React, { useEffect, useState } from "react";
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
  Heart,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import { useAuthStore } from "../../context/authStore";
import { useWishlistStore } from "../../context/wishlistStore";
import { useCartStore } from "../../context/cartStore";

const BuyerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const { wishlist } = useWishlistStore();
  const cartStore = useCartStore();
  const cartItems = cartStore.cartItems || [];
  const navigate = useNavigate();
  const location = useLocation();

  const [newSellersCount, setNewSellersCount] = useState<number>(0);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);

  useEffect(() => {
    setNewSellersCount(3); // mock
    setUnreadMessages(2); // mock
  }, []);

  const tabs = [
    { id: "explore", label: "Explore", icon: ShoppingBag },
    { id: "orders", label: "My Orders", icon: History },
    { id: "marketplace", label: "Marketplace", icon: Store },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: Heart,
      badge: wishlist.length > 0 ? wishlist.length : null,
    },
    {
      id: "cart",
      label: "Cart",
      icon: ShoppingCart,
      badge: cartItems.length > 0 ? cartItems.length : null,
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: CalendarDays,
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      badge: newSellersCount > 0 ? `${newSellersCount}+` : null,
    },
  ];

  const handleNavigate = (tabId: string) => {
    navigate(`/buyer/dashboard/${tabId}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-white/95 backdrop-blur-sm border-r border-slate-200/60 transition-all duration-300 ease-in-out hidden md:flex flex-col shadow-xl`}
      >
        {/* Sidebar Header */}
        <div
          className={`${
            sidebarOpen ? "p-6" : "p-4"
          } border-b border-slate-100 transition-all duration-300`}
        >
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center ${
                sidebarOpen ? "space-x-3" : "justify-center w-full"
              }`}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">UF</span>
              </div>
              {sidebarOpen && (
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                  Umoja Farms
                </h1>
              )}
            </div>
            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-full mt-3 p-2 hover:bg-slate-100 rounded-lg text-slate-600 flex justify-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sidebar Nav */}
        <nav
          className={`flex-1 ${
            sidebarOpen ? "px-4" : "px-2"
          } py-6 space-y-2 transition-all duration-300`}
        >
          {tabs.map((tab) => {
            const isActive = location.pathname.includes(tab.id);
            return (
              <div key={tab.id} className="relative group">
                <button
                  onClick={() => handleNavigate(tab.id)}
                  className={`flex items-center w-full ${
                    sidebarOpen
                      ? "justify-between px-4 py-3.5"
                      : "justify-center px-3 py-3.5"
                  } rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow"
                      : "hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                  }`}
                >
                  <div
                    className={`flex items-center ${
                      sidebarOpen ? "space-x-3" : "justify-center"
                    }`}
                  >
                    <tab.icon
                      className={`w-5 h-5 ${
                        isActive ? "text-white" : "text-slate-500"
                      }`}
                    />
                    {sidebarOpen && (
                      <span className="text-sm font-medium">{tab.label}</span>
                    )}
                  </div>
                  {sidebarOpen && tab.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                  {!sidebarOpen && tab.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {typeof tab.badge === "string" && tab.badge.includes("+")
                        ? "•"
                        : tab.badge}
                    </span>
                  )}
                </button>

                {/* Tooltip when collapsed */}
                {!sidebarOpen && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-slate-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
                    {tab.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className={`${sidebarOpen ? "p-4" : "p-2"} border-t`}>
          <button
            onClick={handleLogout}
            className={`flex items-center w-full text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl ${
              sidebarOpen ? "space-x-3 px-4 py-3" : "justify-center px-3 py-3"
            }`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 md:hidden"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Welcome back, {user?.name ?? "Buyer"}
              </h2>
              <p className="text-sm text-slate-500">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 relative">
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0) ?? "B"}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default BuyerDashboard;
