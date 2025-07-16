import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { useAuthStore } from "../../context/authStore";
import { useWishlistStore } from "../../context/wishlistStore";

const BuyerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const { wishlist } = useWishlistStore();
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
        } bg-white/95 backdrop-blur-sm border-r border-slate-200/60 transition-all duration-300 ease-in-out hidden md:flex flex-col shadow-xl shadow-slate-200/20`}
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
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">UF</span>
              </div>
              {sidebarOpen && (
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent overflow-hidden">
                  Umoja Farms
                </h1>
              )}
            </div>
            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200 text-slate-600 hover:text-slate-800 flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Expand button for collapsed state */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-full mt-3 p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200 text-slate-600 hover:text-slate-800 flex justify-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
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
                  className={`flex items-center w-full transition-all duration-200 ${
                    sidebarOpen
                      ? "justify-between px-4 py-3.5 rounded-xl"
                      : "justify-center px-3 py-3.5 rounded-xl"
                  } ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                      : "hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                  }`}
                >
                  <div
                    className={`flex items-center ${
                      sidebarOpen ? "space-x-3" : "justify-center"
                    }`}
                  >
                    <tab.icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        isActive ? "text-white" : "text-slate-500"
                      }`}
                    />
                    {sidebarOpen && (
                      <span className="font-medium text-sm overflow-hidden">
                        {tab.label}
                      </span>
                    )}
                  </div>

                  {/* Badge for expanded sidebar */}
                  {sidebarOpen &&
                    tab.badge !== undefined &&
                    tab.badge !== null && (
                      <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center flex-shrink-0">
                        {tab.badge}
                      </span>
                    )}

                  {/* Badge indicator for collapsed sidebar */}
                  {!sidebarOpen &&
                    tab.badge !== undefined &&
                    tab.badge !== null && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {typeof tab.badge === "string" &&
                        tab.badge.includes("+")
                          ? "•"
                          : tab.badge}
                      </span>
                    )}
                </button>

                {/* Tooltip for collapsed sidebar */}
                {!sidebarOpen && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    {tab.label}
                    {tab.badge !== undefined && tab.badge !== null && (
                      <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {tab.badge}
                      </span>
                    )}
                    {/* Tooltip arrow */}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-slate-800"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div
          className={`${
            sidebarOpen ? "p-4" : "p-2"
          } border-t border-slate-100 transition-all duration-300`}
        >
          <div className="relative group">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full transition-all duration-200 ${
                sidebarOpen
                  ? "space-x-3 px-4 py-3 rounded-xl"
                  : "justify-center px-3 py-3 rounded-xl"
              } text-red-600 hover:text-red-700 hover:bg-red-50`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="font-medium text-sm">Logout</span>
              )}
            </button>

            {/* Logout tooltip for collapsed sidebar */}
            {!sidebarOpen && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                Logout
                {/* Tooltip arrow */}
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-slate-800"></div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-40">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200 text-slate-600 hover:text-slate-800 md:hidden"
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

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200 text-slate-600 hover:text-slate-800 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200 text-slate-600 hover:text-slate-800">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0) ?? "B"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed left-0 top-0 bottom-0 w-72 bg-white z-50 md:hidden transition-transform duration-300 ease-in-out shadow-2xl`}
      >
        {/* Mobile Sidebar Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">UF</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                Umoja Farms
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200 text-slate-600 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {tabs.map((tab) => {
            const isActive = location.pathname.includes(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => handleNavigate(tab.id)}
                className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                    : "hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <tab.icon
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-slate-500"
                    }`}
                  />
                  <span className="font-medium text-sm">{tab.label}</span>
                </div>
                {tab.badge !== undefined && tab.badge !== null && (
                  <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Logout Button */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default BuyerDashboard;
