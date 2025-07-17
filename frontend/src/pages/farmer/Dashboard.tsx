import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Home,
  Package,
  ShoppingCart,
  TrendingUp,
  Calendar,
  Users,
  Search,
  Bell,
  Settings,
  Plus,
  Trash2,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import {
  useFarmerProducts,
  useAddProduct,
  useDeleteProduct,
} from "../../services/product";
import { useFarmerOrders, useFarmerCustomers } from "../../services/order";
import { useFarmerAnalytics } from "../../services/analytics";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../context/authStore";
import {
  ResponsiveContainer,
  LineChart,
  PieChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Pie,
  Cell,
  Legend,
} from "recharts";
import CalendarView from "../../components/CalendarView";

export interface ProductFormInput {
  name: string;
  price: number;
  quantity: number;
  category: string;
}

const tabs = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "customers", label: "Customers", icon: Users },
];

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center p-4 z-50">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      {children}
    </motion.div>
  </div>
);

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
    {icon}
  </div>
);

interface SectionHeaderProps {
  title: string;
  onAction: () => void;
  actionLabel: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  onAction,
  actionLabel,
}) => (
  <div className="flex justify-between items-center">
    <h2 className="text-xl font-bold">{title}</h2>
    <motion.button
      onClick={onAction}
      whileTap={{ scale: 0.97 }}
      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded shadow"
    >
      <Plus className="w-4 h-4" />
      <span>{actionLabel}</span>
    </motion.button>
  </div>
);

interface OrderCardProps {
  order: {
    _id: string;
    buyerId: {
      name: string;
      phone: string;
    };
    products: Array<{
      productId: {
        _id: string;
        name: string;
      };
      quantity: number;
    }>;
    status: string;
    transactionId: string;
  };
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <p className="font-semibold">
        Buyer: {order.buyerId?.name || "Unknown"} (
        {order.buyerId?.phone || "No phone"})
      </p>
      <ul className="ml-4 list-disc text-sm text-gray-600 mt-2">
        {order.products?.map((p) => (
          <li key={p.productId?._id || Math.random()}>
            {p.productId?.name || "Unknown Product"} × {p.quantity}
          </li>
        ))}
      </ul>
      <p className="text-sm text-green-600 mt-2">
        Status: {order.status} | Txn: {order.transactionId}
      </p>
    </div>
  );
};

interface CustomerCardProps {
  customer: {
    _id: string;
    name: string;
    phone: string;
  };
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
        {customer.name.charAt(0).toUpperCase()}
      </div>
      <div>
        <p className="font-semibold">{customer.name}</p>
        <p className="text-sm text-gray-500">{customer.phone}</p>
      </div>
    </div>
  </div>
);

interface LineChartCardProps {
  data: Record<string, number>;
}

const LineChartCard: React.FC<LineChartCardProps> = ({ data }) => {
  // Convert the data object to array format for Recharts
  const chartData = Object.entries(data || {})
    .map(([date, revenue]) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      revenue: Number(revenue),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <LineChartIcon className="w-5 h-5 mr-2 text-green-600" />
        Revenue Trend (Last 30 Days)
      </h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => [`Ksh.${value}`, "Revenue"]} />
            <Line
              dataKey="revenue"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: "#22c55e" }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          No sales data available
        </div>
      )}
    </div>
  );
};

interface PieChartCardProps {
  data: Record<string, number>;
}

const PieChartCard: React.FC<PieChartCardProps> = ({ data }) => {
  // Convert the data object to array format for Recharts
  const chartData = Object.entries(data || {})
    .map(([name, value]) => ({ name, value: Number(value) }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Show top 5 products

  const colors = ["#22c55e", "#10b981", "#059669", "#047857", "#065f46"];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <PieChartIcon className="w-5 h-5 mr-2 text-green-600" />
        Top Products by Revenue
      </h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
            >
              {chartData.map((_, idx) => (
                <Cell key={idx} fill={colors[idx % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`Ksh.${value}`, "Revenue"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          No product sales data available
        </div>
      )}
    </div>
  );
};

interface ProductFormProps {
  onSubmit: (data: ProductFormInput) => void;
  register: any;
  handleSubmit: any;
  cancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  register,
  handleSubmit,
  cancel,
}) => (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Product Name
      </label>
      <input
        {...register("name", { required: true })}
        className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Price</label>
      <input
        type="number"
        step="0.01"
        {...register("price", { valueAsNumber: true, required: true })}
        className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Quantity
      </label>
      <input
        {...register("quantity", { valueAsNumber: true, required: true })}
        className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Category
      </label>
      <input
        {...register("category", { required: true })}
        className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500"
      />
    </div>
    <div className="flex justify-end space-x-3 pt-4">
      <button
        type="button"
        onClick={cancel}
        className="px-4 py-2 bg-gray-200 rounded-lg"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        Add Product
      </button>
    </div>
  </form>
);

const FarmerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { user, loadUserFromStorage, logout } = useAuthStore();
  const { register, handleSubmit, reset } = useForm<ProductFormInput>();
  const productsQuery = useFarmerProducts();
  const addProduct = useAddProduct();
  const deleteProduct = useDeleteProduct();
  const ordersQuery = useFarmerOrders();
  console.log("Orders query result:", ordersQuery.data);
  const customersQuery = useFarmerCustomers();
  const analyticsQuery = useFarmerAnalytics(user?._id ?? "");

  useEffect(() => loadUserFromStorage(), [loadUserFromStorage]);

  const onAdd = (form: ProductFormInput) => {
    addProduct.mutate({ ...form, type: "produce" });
    reset();
    setShowAddForm(false);
  };

  const handleLogout = () => {
    logout();
    // redirect logic here, e.g. navigate('/login')
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-white border-r p-4 space-y-6 transition-all duration-300`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-3 rounded-xl shadow-lg">
              <Leaf className="text-white w-6 h-6" />
            </div>
            {sidebarOpen && (
              <div>
                <h2 className="text-lg font-bold">Umoja Farms</h2>
                <p className="text-xs text-gray-500">Farmer Panel</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded hover:bg-gray-100"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-left transition-all ${
                activeTab === tab.id
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

      {/* Main */}
      <main className="flex-1">
        {/* Topbar */}
        <div className="bg-white px-8 py-6 border-b flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Good morning,{" "}
              <span className="text-green-600">{user?.name ?? "Farmer"}</span>
            </h1>
            <p className="text-gray-600 mt-1">Here's your farm snapshot</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-green-500"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications((v) => !v)}
                className="relative"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-20"
                  >
                    <p className="text-sm font-semibold mb-2">Notifications</p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>✅ New order received</li>
                      <li>🌾 Tomatoes low on stock</li>
                      <li>📅 Event tomorrow</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setShowSettings(true)}>
              <Settings className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="text-red-600 hover:text-red-800"
            >
              <LogOut className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                {user?.name?.charAt(0) ?? "F"}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-8 space-y-6">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  label="Products"
                  value={productsQuery.data?.length ?? 0}
                  icon={<Package className="w-8 h-8 text-green-600" />}
                />
                <StatCard
                  label="Orders"
                  value={ordersQuery.data?.length ?? 0}
                  icon={<ShoppingCart className="w-8 h-8 text-blue-600" />}
                />
                <StatCard
                  label="Customers"
                  value={customersQuery.data?.length ?? 0}
                  icon={<Users className="w-8 h-8 text-purple-600" />}
                />
              </div>
            </div>
          )}

          {/* Products */}
          {activeTab === "products" && (
            <>
              <SectionHeader
                title="My Produce"
                onAction={() => setShowAddForm(true)}
                actionLabel="Add Product"
              />
              {productsQuery.isLoading ? (
                <p>Loading...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {productsQuery.data?.map((p) => (
                    <div
                      key={p._id}
                      className="bg-white border p-4 rounded-xl flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-semibold">{p.name}</h3>
                        <p className="text-sm text-gray-500">{p.category}</p>
                        <p className="text-sm text-green-600 font-medium">
                          Ksh.{p.price} • Qty: {p.quantity}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteProduct.mutate(p._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Orders */}
          {activeTab === "orders" && (
            <>
              <h2 className="text-xl font-bold mb-4">Orders Received</h2>
              {ordersQuery.isLoading ? (
                <p>Loading...</p>
              ) : (
                <div className="space-y-4">
                  {ordersQuery.data?.map((o: OrderCardProps["order"]) => (
                    <OrderCard key={o._id} order={o} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Customers */}
          {activeTab === "customers" && (
            <>
              <h2 className="text-xl font-bold mb-4">Your Customers</h2>
              {customersQuery.isLoading ? (
                <p>Loading...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {customersQuery.data?.map(
                    (c: CustomerCardProps["customer"]) => (
                      <CustomerCard key={c._id} customer={c} />
                    )
                  )}
                </div>
              )}
            </>
          )}

          {/* Analytics */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Analytics</h2>

              {analyticsQuery.isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading analytics...</p>
                  </div>
                </div>
              ) : analyticsQuery.error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">Error loading analytics data</p>
                  <p className="text-sm text-red-600 mt-2">
                    {analyticsQuery.error instanceof Error
                      ? analyticsQuery.error.message
                      : "Unknown error"}
                  </p>
                </div>
              ) : (
                <>
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm text-gray-500">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-600">
                        Ksh.
                        {analyticsQuery.data?.totalRevenue?.toFixed(2) ||
                          "0.00"}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm text-gray-500">Total Orders</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {analyticsQuery.data?.totalOrders || 0}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm text-gray-500">
                        Average Order Value
                      </p>
                      <p className="text-2xl font-bold text-purple-600">
                        Ksh.
                        {(analyticsQuery.data?.totalOrders ?? 0) > 0
                          ? (
                              (analyticsQuery.data?.totalRevenue || 0) /
                              (analyticsQuery.data?.totalOrders ?? 1)
                            ).toFixed(2)
                          : "0.00"}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm text-gray-500">Products Sold</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {
                          Object.keys(analyticsQuery.data?.salesByProduct || {})
                            .length
                        }
                      </p>
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <LineChartCard
                      data={analyticsQuery.data?.salesTrend || {}}
                    />
                    <PieChartCard
                      data={analyticsQuery.data?.salesByProduct || {}}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Calendar */}
          {activeTab === "calendar" && (
            <>
              <h2 className="text-xl font-bold">Farm Calendar</h2>
              <div className="bg-white p-4 rounded-xl shadow">
                <CalendarView />
              </div>
            </>
          )}
        </div>
      </main>

      {/* Add Product Modal */}
      {showAddForm && (
        <Modal title="Add New Product" onClose={() => setShowAddForm(false)}>
          <ProductForm
            onSubmit={onAdd}
            register={register}
            handleSubmit={handleSubmit}
            cancel={() => setShowAddForm(false)}
          />
        </Modal>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <Modal title="Settings" onClose={() => setShowSettings(false)}>
          <p className="text-gray-700">⚙️ Add your settings here</p>
        </Modal>
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <Modal
          title="Confirm Logout"
          onClose={() => setShowLogoutConfirm(false)}
        >
          <p>Are you sure you want to log out?</p>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Logout
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FarmerDashboard;
