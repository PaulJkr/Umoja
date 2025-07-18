import React from "react";
import { useFarmerOrders, useUpdateOrderStatus } from "../../services/order";
import { Loader2 } from "lucide-react";
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

const FarmerOrdersPage = () => {
  const { data: orders, isLoading } = useFarmerOrders();
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const handleUpdate = (
    id: string,
    status: "accepted" | "declined" | "fulfilled"
  ) => {
    updateStatus({ orderId: id, status });
  };

  if (isLoading)
    return <div className="text-center p-6">Loading Orders...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Incoming Orders</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Buyer</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Transaction ID</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order: Order) => {
              // Get the first product (most orders seem to have one product)
              const product = order.products?.[0];

              return (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    {product?.productId?.name || "Product Missing"}
                  </td>
                  <td className="p-3">
                    <div>{order.buyerId?.name}</div>
                    <div className="text-xs text-gray-500">
                      {order.buyerId?.phone}
                    </div>
                  </td>
                  <td className="p-3">{product?.quantity}</td>
                  <td className="p-3">
                    KES {product?.productId?.price?.toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "success"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "accepted"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "declined"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-gray-600">
                    {order.transactionId}
                  </td>
                  <td className="p-3 text-xs text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {order.status === "pending" && (
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          disabled={isPending}
                          onClick={() => handleUpdate(order._id, "accepted")}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isPending}
                          onClick={() => handleUpdate(order._id, "declined")}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                    {order.status === "accepted" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => handleUpdate(order._id, "fulfilled")}
                      >
                        Mark Fulfilled
                      </Button>
                    )}
                    {order.status === "success" && (
                      <span className="text-xs italic text-green-600">
                        Completed
                      </span>
                    )}
                    {["declined", "fulfilled"].includes(order.status) && (
                      <span className="text-xs italic text-gray-400">
                        No actions
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!orders || orders?.length === 0) && (
          <div className="text-center p-6 text-gray-500">No orders yet.</div>
        )}
      </div>
    </div>
  );
};

export default FarmerOrdersPage;
