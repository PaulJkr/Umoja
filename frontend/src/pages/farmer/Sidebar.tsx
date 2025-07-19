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
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { useAuthStore } from "../../context/authStore";

const navItems = [
  { label: "Overview", icon: Home, path: "overview" },
  { label: "Products", icon: Package, path: "products" },
  { label: "Orders", icon: ShoppingCart, path: "orders" },
  { label: "Analytics", icon: TrendingUp, path: "analytics" },
  { label: "Calendar", icon: Calendar, path: "calendar" },
  { label: "Customers", icon: Users, path: "customers" },
  { label: "Profile", icon: User, path: "profile" },
];

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside
      className={clsx(
        "bg-green-900 text-white h-screen transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-green-800">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Leaf className="w-6 h-6 text-lime-400" />
            <span className="font-bold text-lg">Farmer</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="flex flex-col mt-4 space-y-1">
        {navItems.map(({ label, icon: Icon, path }) => (
          <Link
            key={path}
            to={`/dashboard/farmer/${path}`}
            className={clsx(
              "flex items-center gap-3 px-4 py-2 hover:bg-green-800 transition-colors",
              location.pathname.includes(path) && "bg-green-800"
            )}
          >
            <Icon className="h-5 w-5" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      <div className="mt-auto px-4 py-4">
        <button
          onClick={logout}
          className="flex items-center gap-2 text-red-300 hover:text-white transition"
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
