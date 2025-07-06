import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Leaf,
  Home,
  Package,
  ShoppingCart,
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  Star,
  Search,
  Bell,
  Settings,
  Plus,
  Trash2,
} from "lucide-react";
import {
  useFarmerProducts,
  useAddProduct,
  useDeleteProduct,
} from "../../services/product";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../context/authStore";

interface ProductFormInput {
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

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddForm, setShowAddForm] = useState(false);
  const { user, loadUserFromStorage } = useAuthStore();
  const { register, handleSubmit, reset } = useForm<ProductFormInput>();
  const { data, isLoading } = useFarmerProducts();
  const addProduct = useAddProduct();
  const deleteProduct = useDeleteProduct();

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const onAdd = (form: ProductFormInput) => {
    addProduct.mutate({ ...form, type: "produce" });
    reset();
    setShowAddForm(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 p-6 space-y-8">
        <div className="flex items-center space-x-3">
          <div className="bg-green-600 p-3 rounded-xl shadow-lg">
            <Leaf className="text-white w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Umoja Farms</h2>
            <p className="text-sm text-gray-500">Farmer Panel</p>
          </div>
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
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-gray-50">
        {/* Topbar */}
        <div className="bg-white border-b px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Good morning,{" "}
              <span className="text-green-600">{user?.name ?? "Farmer"}</span>{" "}
              🌱
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening on your farm today
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
            <Settings className="w-5 h-5 text-gray-600 cursor-pointer" />
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white flex items-center justify-center font-semibold">
                {user?.name?.charAt(0) ?? "F"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.name ?? "Farmer"}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="p-8 space-y-6">
          {/* Add Product Button */}
          {activeTab === "products" && (
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>
          )}

          {/* Product List */}
          {activeTab === "products" && (
            <>
              {isLoading ? (
                <p>Loading products...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {data?.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white p-4 rounded shadow flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <p className="text-sm text-gray-500">
                          {product.category}
                        </p>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <p className="text-green-600 font-semibold">
                          ${product.price}
                        </p>
                        <button
                          onClick={() => deleteProduct.mutate(product._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== "products" && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🚧</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {tabs.find((t) => t.id === activeTab)?.label} is coming soon!
              </h3>
              <p className="text-gray-600">
                We're working hard to get this ready.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Product</h2>
              <button onClick={() => setShowAddForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
              <input
                {...register("name")}
                placeholder="Product name"
                className="w-full border px-4 py-2 rounded"
              />
              <input
                type="number"
                {...register("price", { valueAsNumber: true })}
                placeholder="Price"
                className="w-full border px-4 py-2 rounded"
              />
              <input
                type="number"
                {...register("quantity", { valueAsNumber: true })}
                placeholder="Quantity"
                className="w-full border px-4 py-2 rounded"
              />
              <input
                {...register("category")}
                placeholder="Category"
                className="w-full border px-4 py-2 rounded"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                Add Product
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
