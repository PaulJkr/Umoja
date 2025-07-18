import { Bell, Settings } from "lucide-react";
import { useAuthStore } from "../../context/authStore";

const Topbar = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
      <h1 className="text-lg font-semibold text-green-900">
        Welcome back, {user?.name || "Farmer"}!
      </h1>
      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-green-700 transition">
          <Bell className="h-5 w-5" />
        </button>
        <button className="text-gray-600 hover:text-green-700 transition">
          <Settings className="h-5 w-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-semibold uppercase">
          {user?.name?.charAt(0) || "F"}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
