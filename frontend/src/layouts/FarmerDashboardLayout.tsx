import { Outlet, NavLink } from "react-router-dom";
import {
  Leaf,
  Home,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";

const tabs = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "customers", label: "Customers", icon: Users },
  { id: "calendar", label: "Calendar", icon: Calendar },
];

const FarmerDashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white p-6 border-r border-gray-200 space-y-10">
        <div className="flex items-center space-x-3">
          <div className="bg-green-600 p-2 rounded-lg text-white">
            <Leaf className="w-6 h-6" />
          </div>
          <h2 className="font-bold text-xl">Umoja Farms</h2>
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.id}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2 rounded-md ${
                  isActive
                    ? "bg-green-100 text-green-700 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`
              }
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default FarmerDashboardLayout;
