import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import { Loader, Package, CalendarDays, User } from "lucide-react";
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

  if (isLoading)
    return (
      <div className="p-6 text-gray-600">
        Loading <Loader className="inline animate-spin" />
      </div>
    );

  if (isError)
    return (
      <div className="p-6 text-red-500">
        Failed to fetch your orders. Please try again later.
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Order History</h2>
      {orders?.length === 0 ? (
        <p className="text-gray-600">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders?.map((order) => {
            const product = order.products[0]; // simplified: one product per order
            return (
              <div
                key={order._id}
                className="border rounded p-4 bg-white shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">
                    <Package className="w-4 h-4 inline mr-1" />
                    {product.productId.name}
                  </h3>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-700 capitalize">
                    {product.productId.type}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  Quantity: {product.quantity} × KES{" "}
                  {product.productId.price.toLocaleString()}
                </p>
                <p className="text-sm text-green-700 font-medium">
                  Total: KES{" "}
                  {(
                    product.productId.price * product.quantity
                  ).toLocaleString()}
                </p>

                <div className="mt-3 text-sm text-gray-600">
                  <p className="flex items-center mb-1">
                    <User className="w-4 h-4 mr-1" /> Seller:{" "}
                    {order.sellerId.name}
                  </p>
                  <p className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-1" />
                    Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-2">
                  <span className="text-xs text-white bg-blue-500 px-2 py-1 rounded capitalize">
                    {order.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
