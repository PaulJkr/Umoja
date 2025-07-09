import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "../context/authStore";

export const useFarmerOrders = () => {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ["farmer-orders", user?._id],
    queryFn: () =>
      api.get(`/api/orders/farmer/${user?._id}`).then((r) => r.data),
    enabled: !!user?._id,
  });
};

export const useFarmerCustomers = () => {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ["farmer-customers", user?._id],
    queryFn: () =>
      api
        .get(`/api/orders/farmer/${user?._id}/customers`)
        .then((r) => r.data),
    enabled: !!user?._id,
  });
};
