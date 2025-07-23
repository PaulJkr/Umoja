import { useAuthStore } from "../../context/authStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useAdminProducts = (filters: {
  type: string;
  farmer: string;
  search: string;
}) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["admin-products", filters],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams(filters as any).toString();
      const res = await axios.get(`/api/admin/products?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
    enabled: !!user, 
  });
};
