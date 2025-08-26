import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import {
  Package,
  CalendarDays,
  User,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
} from "lucide-react";
import { useAuthStore } from "../../context/authStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";

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
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedOrderForDetails, setSelectedOrderForDetails] =
    useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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
      return res.data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="h-8 bg-slate-200 rounded w-48 animate-pulse mb-2"></div>
          <div className="h-5 bg-slate-200 rounded w-64 animate-pulse"></div>
        </div>
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

  const sortedOrders = [...(orders || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const visibleOrders = sortedOrders.slice(0, visibleCount);
  const hasMoreOrders = sortedOrders.length > visibleCount;

  const handleViewDetails = (order: Order) => {
    setSelectedOrderForDetails(order);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
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

      <AnimatePresence mode="wait">
        {sortedOrders.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {visibleOrders.map((order, index) => {
                const product = order.products?.[0];

                // Skip rendering if no product data
                if (!product?.productId) {
                  return null;
                }

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
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-slate-700 transition-colors">
                            {product.productId.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              {product.productId.type || "Product"}
                            </span>
                            {order.products.length > 1 && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                +{order.products.length - 1} more
                              </span>
                            )}
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
                              {order.products
                                .reduce(
                                  (sum, item) =>
                                    sum + item.productId.price * item.quantity,
                                  0
                                )
                                .toLocaleString()}
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
                            <Phone className="w-4 h-4 flex-shrink-0" />
                            <span className="font-medium">Phone:</span>
                            <span>{order.sellerId.phone}</span>
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

                      <div className="pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            Order ID: {order._id.slice(-8)}
                          </span>
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {sortedOrders.length > 3 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() =>
                    setVisibleCount(hasMoreOrders ? sortedOrders.length : 3)
                  }
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {hasMoreOrders ? "Show More" : "Show Less"}
                </button>
              </div>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Order Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Comprehensive details of your order.
            </DialogDescription>
          </DialogHeader>
          {selectedOrderForDetails && (
            <div className="grid gap-4 py-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Order ID:</span>
                  <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">
                    {selectedOrderForDetails._id}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Status:</span>
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      selectedOrderForDetails.status
                    )}`}
                  >
                    {getStatusIcon(selectedOrderForDetails.status)}
                    <span className="capitalize">
                      {selectedOrderForDetails.status}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Seller:</span>
                  <div className="text-right">
                    <div className="font-medium">
                      {selectedOrderForDetails.sellerId.name}
                    </div>
                    <div className="text-sm text-slate-600">
                      {selectedOrderForDetails.sellerId.phone}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">
                    Order Date:
                  </span>
                  <span>
                    {new Date(
                      selectedOrderForDetails.createdAt
                    ).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-slate-600 font-medium mb-3">Products:</h4>
                <div className="space-y-3">
                  {selectedOrderForDetails.products.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{item.productId.name}</div>
                        <div className="text-sm text-slate-600">
                          {item.productId.type} • Quantity: {item.quantity}
                        </div>
                        <div className="text-sm text-slate-600">
                          KES {item.productId.price.toLocaleString()} per item
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-600">
                          KES{" "}
                          {(
                            item.productId.price * item.quantity
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <span className="text-lg font-semibold text-slate-900">
                  Total Amount:
                </span>
                <span className="text-xl font-bold text-emerald-600">
                  KES{" "}
                  {selectedOrderForDetails.products
                    .reduce(
                      (sum, item) => sum + item.productId.price * item.quantity,
                      0
                    )
                    .toLocaleString()}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
