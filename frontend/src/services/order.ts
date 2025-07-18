import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "../context/authStore";
import api from "../api/axios";

export const useFarmerOrders = () => {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ["farmer-orders", user?._id],
    queryFn: () => api.get(`/orders/farmer/${user?._id}`).then((r) => r.data),
    enabled: !!user?._id,
  });
};

export const useFarmerCustomers = () => {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ["farmer-customers", user?._id],
    queryFn: () =>
      api.get(`/orders/farmer/${user?._id}/customers`).then((r) => r.data),
    enabled: !!user?._id,
  });
};

// ✅ Fixed: Update order status with correct query invalidation
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: "accepted" | "declined" | "fulfilled";
    }) => {
      const res = await api.patch(`/orders/${orderId}`, { status });
      return res.data;
    },
    onSuccess: () => {
      // ✅ Fix: Use the correct query key that matches useFarmerOrders
      queryClient.invalidateQueries({
        queryKey: ["farmer-orders", user?._id],
      });
      // ✅ Also invalidate customers in case the update affects that data
      queryClient.invalidateQueries({
        queryKey: ["farmer-customers", user?._id],
      });
    },
  });
};
