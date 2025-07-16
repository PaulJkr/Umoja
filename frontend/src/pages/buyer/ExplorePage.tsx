import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import {
  Loader,
  PhoneCall,
  User,
  Package,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Sprout,
  Wheat,
  Zap,
} from "lucide-react";
import { useAuthStore } from "../../context/authStore";
import { toast } from "react-toastify";

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  type: "produce" | "seed" | "fertilizer";
  seller?: {
    _id: string;
    name: string;
    role: string;
    phone: string;
  };
}

const OrdersPage = () => {
  const queryClient = useQueryClient();
  const { user, loadUserFromStorage } = useAuthStore();

  React.useEffect(() => {
    loadUserFromStorage();
  }, []);

  const { data, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (product: Product) => {
      if (!user?._id) throw new Error("Not logged in");
      if (!product.seller?._id) throw new Error("Seller info missing");

      const orderData = {
        cartItems: [
          {
            _id: product._id,
            quantity: 1,
            price: product.price,
            sellerId: product.seller._id,
          },
        ],
      };

      const response = await api.post("/orders", orderData);
      return response;
    },
    onSuccess: (data) => {
      toast.success("✅ Order placed successfully!");
      if (user?._id) {
        queryClient.invalidateQueries({ queryKey: ["myOrders", user._id] });
      }
    },
    onError: (err: any) => {
      if (err?.response?.status === 401) {
        toast.error("❌ Authentication failed. Please log in again.");
      } else if (err?.response?.status === 400) {
        toast.error(`❌ ${err?.response?.data?.msg || "Invalid order data"}`);
      } else if (err?.response?.status === 500) {
        toast.error(`❌ ${err?.response?.data?.msg || "Server error"}`);
      } else {
        toast.error(
          `❌ ${
            err?.response?.data?.msg || err?.message || "Failed to place order"
          }`
        );
      }
    },
  });

  const handleBuy = (product: Product) => {
    if (!user?._id) {
      toast.warning("⚠️ Please log in to place an order");
      return;
    }
    if (!product.seller?._id) {
      toast.error("Seller information missing");
      return;
    }
    mutation.mutate(product);
  };

  const getProductIcon = (type: string) => {
    switch (type) {
      case "produce":
        return <Package className="w-4 h-4" />;
      case "seed":
        return <Sprout className="w-4 h-4" />;
      case "fertilizer":
        return <Zap className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getProductTypeColor = (type: string) => {
    switch (type) {
      case "produce":
        return "bg-green-100 text-green-800";
      case "seed":
        return "bg-blue-100 text-blue-800";
      case "fertilizer":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
            <Loader className="w-6 h-6 text-white animate-spin" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full animate-ping opacity-20"></div>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-slate-700">
            Loading products...
          </p>
          <p className="text-sm text-slate-500">
            Please wait while we fetch available items
          </p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Unable to load products
          </h3>
          <p className="text-slate-600 mb-4">
            There was an error fetching the product data. Please try again
            later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Available Products
            </h1>
            <p className="text-slate-600">
              Discover fresh produce, quality seeds, and fertilizers from local
              farmers
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {data?.length || 0}
              </div>
              <div className="text-sm text-slate-500">Products</div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <Package className="w-12 h-12 text-slate-400" />
                  </div>
                )}

                {/* Product Type Badge */}
                <div className="absolute top-3 left-3">
                  <div
                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getProductTypeColor(
                      product.type
                    )}`}
                  >
                    {getProductIcon(product.type)}
                    <span className="capitalize">{product.type}</span>
                  </div>
                </div>

                {/* Quantity Badge */}
                <div className="absolute top-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-slate-700">
                    {product.quantity} left
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-emerald-600">
                      KES {product.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500">per unit</p>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                  <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <User className="w-4 h-4 mr-1.5" />
                    Farmer Details
                  </h4>
                  {product.seller ? (
                    <div className="space-y-1">
                      <p className="text-sm text-slate-700 font-medium">
                        {product.seller.name}
                      </p>
                      <p className="flex items-center text-sm text-slate-600">
                        <PhoneCall className="w-3 h-3 mr-1.5" />
                        {product.seller.phone}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">
                        {product.seller.role}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center text-sm text-red-500">
                      <AlertCircle className="w-3 h-3 mr-1.5" />
                      Seller info missing
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleBuy(product)}
                  disabled={mutation.isPending || product.quantity === 0}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-medium py-3 rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : product.quantity === 0 ? (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span>Out of Stock</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Request / Buy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Package className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            No products available
          </h3>
          <p className="text-slate-600 text-center max-w-md">
            There are currently no products available. Please check back later
            or contact support if you believe this is an error.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
