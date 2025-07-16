import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import {
  Loader2,
  Package,
  CalendarDays,
  User,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "../../context/authStore";

interface Order {
  _id: string;
  products: {
    productId: {
      name: string;
      price: number;
      type?: string;
      quantity?: number;
    };
    quantity: number;
  }[];
  sellerId: {
    name: string;
    phone: string;
  };
  createdAt: string;
  status: string;
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
    case "delivered":
      return <CheckCircle className="w-4 h-4" />;
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "cancelled":
      return <XCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
    case "delivered":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const OrderSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="h-5 bg-slate-200 rounded w-48 animate-pulse"></div>
        <div className="h-4 bg-slate-200 rounded w-32 animate-pulse"></div>
      </div>
      <div className="h-6 bg-slate-200 rounded-full w-20 animate-pulse"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-slate-200 rounded w-40 animate-pulse"></div>
      <div className="h-4 bg-slate-200 rounded w-36 animate-pulse"></div>
    </div>
    <div className="flex justify-between items-center">
      <div className="h-4 bg-slate-200 rounded w-28 animate-pulse"></div>
      <div className="h-7 bg-slate-200 rounded-full w-20 animate-pulse"></div>
    </div>
  </div>
);

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center py-16"
  >
    <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
      <ShoppingBag className="w-12 h-12 text-slate-400" />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">No orders yet</h3>
    <p className="text-slate-600 max-w-md mx-auto">
      When you place your first order, it will appear here. Start exploring our
      marketplace!
    </p>
  </motion.div>
);

const OrdersPage = () => {
  const { user, loadUserFromStorage } = useAuthStore();

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const userId = user?._id;

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery<Order[]>({
    queryKey: ["buyerOrders", userId],
    queryFn: async () => {
      const res = await api.get(`/orders/buyer/${userId}`);
      console.log("Fetched orders:", res.data);
      return res.data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-slate-200 rounded w-48 animate-pulse mb-2"></div>
          <div className="h-5 bg-slate-200 rounded w-64 animate-pulse"></div>
        </div>

        {/* Order Skeletons */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
        >
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Failed to load orders
          </h3>
          <p className="text-red-700">
            We couldn't fetch your orders right now. Please try again later.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Order History</h1>
        </div>
        <p className="text-slate-600">
          Track and manage all your orders in one place
        </p>
      </motion.div>

      {/* Orders List */}
      <AnimatePresence mode="wait">
        {orders?.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {orders?.map((order, index) => {
              const product = order.products[0]; // simplified: one product per order
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-slate-700 transition-colors">
                          {product.productId.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {product.productId.type || "Product"}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">
                            Quantity
                          </span>
                          <span className="text-sm font-medium text-slate-900">
                            {product.quantity} items
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">
                            Unit Price
                          </span>
                          <span className="text-sm font-medium text-slate-900">
                            KES {product.productId.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-sm font-medium text-slate-900">
                            Total
                          </span>
                          <span className="text-lg font-bold text-emerald-600">
                            KES{" "}
                            {(
                              product.productId.price * product.quantity
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span className="font-medium">Seller:</span>
                          <span>{order.sellerId.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays className="w-4 h-4 flex-shrink-0" />
                          <span className="font-medium">Ordered:</span>
                          <span>
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          Order ID: {order._id.slice(-8)}
                        </span>
                        <button className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;
