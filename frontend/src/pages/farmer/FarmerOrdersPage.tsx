import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFarmerOrders, useUpdateOrderStatus } from "../../services/order";
import {
  Loader2,
  Package,
  User,
  Phone,
  Calendar,
  CreditCard,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "../../components/ui/button";

interface Order {
  _id: string;
  buyerId: {
    _id: string;
    name: string;
    phone: string;
  };
  sellerId: string;
  products: Array<{
    productId?: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
    _id: string;
  }>;
  status: string;
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "success":
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-800",
          icon: CheckCircle,
          label: "Completed",
        };
      case "pending":
        return {
          bg: "bg-amber-100",
          text: "text-amber-800",
          icon: Clock,
          label: "Pending",
        };
      case "accepted":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          icon: CheckCircle,
          label: "Accepted",
        };
      case "declined":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          icon: XCircle,
          label: "Declined",
        };
      case "fulfilled":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: CheckCircle,
          label: "Fulfilled",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          icon: Clock,
          label: status,
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

const OrderCard = ({
  order,
  isPending,
  handleUpdate,
}: {
  order: Order;
  isPending: boolean;
  handleUpdate: (
    id: string,
    status: "accepted" | "declined" | "fulfilled"
  ) => void;
}) => {
  const product = order.products?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <Package className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {product?.productId?.name || "Product Missing"}
              </h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  Qty: {product?.quantity}
                </span>
                <span className="font-medium text-emerald-600">
                  KES {product?.productId?.price?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Buyer Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-900">
              {order.buyerId?.name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-3 h-3" />
            <span>{order.buyerId?.phone}</span>
          </div>
        </div>

        {/* Status & Date */}
        <div className="flex-1 min-w-0">
          <StatusBadge status={order.status} />
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Transaction Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <CreditCard className="w-3 h-3" />
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
              {order.transactionId.slice(0, 12)}...
            </span>
          </div>
          <span className="text-xs text-gray-500 capitalize">
            {order.paymentMethod}
          </span>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 min-w-0">
          {order.status === "pending" && (
            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleUpdate(order._id, "accepted")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs"
                >
                  {isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    "Accept"
                  )}
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={isPending}
                  onClick={() => handleUpdate(order._id, "declined")}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs"
                >
                  {isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    "Decline"
                  )}
                </Button>
              </motion.div>
            </div>
          )}
          {order.status === "accepted" && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => handleUpdate(order._id, "fulfilled")}
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-4 py-2 text-xs"
              >
                {isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  "Mark Fulfilled"
                )}
              </Button>
            </motion.div>
          )}
          {order.status === "success" && (
            <span className="text-xs italic text-emerald-600 font-medium">
              ✓ Completed
            </span>
          )}
          {["declined", "fulfilled"].includes(order.status) && (
            <span className="text-xs italic text-gray-400">
              No actions available
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const FarmerOrdersPage = () => {
  const { data: orders, isLoading } = useFarmerOrders();
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();
  const [showAll, setShowAll] = useState(false);

  const handleUpdate = (
    id: string,
    status: "accepted" | "declined" | "fulfilled"
  ) => {
    updateStatus({ orderId: id, status });
  };

  // Show first 8 orders by default, all if showAll is true
  const displayedOrders = showAll ? orders : orders?.slice(0, 8);
  const hasMoreOrders = orders && orders.length > 8;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600 font-medium">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Incoming Orders
              </h1>
              <p className="text-gray-600">
                Manage and track your order requests
              </p>
            </div>

            {orders && orders.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="bg-white rounded-xl px-4 py-2 border border-gray-200">
                  <span className="text-sm text-gray-600">Total Orders: </span>
                  <span className="font-semibold text-gray-900">
                    {orders.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Orders List */}
        {!orders || orders?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Orders from customers will appear here. Start by adding products
                to attract buyers!
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {displayedOrders?.map((order: Order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  isPending={isPending}
                  handleUpdate={handleUpdate}
                />
              ))}
            </AnimatePresence>

            {/* Show More Toggle */}
            {hasMoreOrders && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center pt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAll(!showAll)}
                  className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 font-medium shadow-sm"
                >
                  {showAll ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Show Less
                      <span className="text-sm text-gray-500 ml-1">
                        (Hide {orders.length - 8} orders)
                      </span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show More
                      <span className="text-sm text-gray-500 ml-1">
                        ({orders.length - 8} more orders)
                      </span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}

            {/* Orders Summary */}
            {orders && orders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-600">
                      {
                        orders.filter((o: Order) => o.status === "pending")
                          .length
                      }
                    </p>
                    <p className="text-sm text-gray-600 font-medium">Pending</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {
                        orders.filter((o: Order) => o.status === "accepted")
                          .length
                      }
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      Accepted
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">
                      {
                        orders.filter((o: Order) => o.status === "success")
                          .length
                      }
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      Completed
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {
                        orders.filter((o: Order) => o.status === "declined")
                          .length
                      }
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      Declined
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerOrdersPage;
