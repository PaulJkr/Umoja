import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { Loader, PhoneCall, User } from "lucide-react";
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
      const res = await api.get("/products"); // Ensure products have populated seller info
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (product: Product) => {
      console.log("=== MUTATION STARTED ===");
      console.log("User:", user);
      console.log("Product:", product);

      if (!user?._id) throw new Error("Not logged in");
      if (!product.seller?._id) throw new Error("Seller info missing");

      // ✅ FIXED: Remove buyerId from request body - backend gets it from token
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

      console.log("Sending order data:", orderData);

      try {
        const response = await api.post("/orders", orderData);
        console.log("✅ API Response:", response.data);
        return response;
      } catch (error: any) {
        console.log("❌ API Error:", error);
        console.log("Error response:", error?.response);
        console.log("Error status:", error?.response?.status);
        console.log("Error data:", error?.response?.data);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("✅ Order success:", data);
      toast.success("✅ Order placed successfully!");
      if (user?._id) {
        queryClient.invalidateQueries({ queryKey: ["myOrders", user._id] });
      }
    },
    onError: (err: any) => {
      console.log("❌ Order error:", err);

      // Handle specific error cases
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
    console.log("handleBuy triggered");
    if (!user?._id) {
      console.log("User not logged in: ", user);
      toast.warning("⚠️ Please log in to place an order");
      return;
    }
    console.log("User is logged in:", user);
    console.log("Placing order for product:", product);
    if (!product.seller?._id) {
      console.log("Seller information missing");
      toast.error("Seller information missing");
      return;
    }
    console.log("Seller information present:", product.seller);
    mutation.mutate(product);
  };

  if (isLoading)
    return (
      <div className="p-6 text-gray-600">
        Loading <Loader className="inline animate-spin" />
      </div>
    );

  if (isError)
    return (
      <div className="p-6 text-red-500">
        Failed to fetch products. Please try again later.
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Available Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(data ?? []).map((product) => (
          <div
            key={product._id}
            className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{product.type}</p>
            <p className="mt-1 font-bold text-green-700">
              KES {product.price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Qty: {product.quantity}</p>
            <div className="mt-4 p-3 bg-gray-50 rounded border">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Farmer Info
              </h4>
              {product.seller ? (
                <>
                  <p className="flex items-center text-sm text-gray-700 mb-1">
                    <User className="w-4 h-4 mr-1" /> {product.seller.name}
                  </p>
                  <p className="flex items-center text-sm text-gray-700">
                    <PhoneCall className="w-4 h-4 mr-1" />{" "}
                    {product.seller.phone}
                  </p>
                  <span className="text-xs text-gray-500 capitalize">
                    ({product.seller.role})
                  </span>
                </>
              ) : (
                <p className="text-sm text-red-500">Seller info missing</p>
              )}
            </div>
            <button
              onClick={() => handleBuy(product)}
              disabled={mutation.isPending}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {mutation.isPending ? "Processing..." : "Request / Buy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
