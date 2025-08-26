import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { useAuthStore } from "../context/authStore";
import { AdminProduct } from "../services/product";

interface AdminProductResponse {
  products: AdminProduct[];
  totalPages: number;
}

export const useAdminProducts = ({
  category,
  type,
  farmer,
  search,
  page,
  limit,
  sort,
}: {
  category?: string;
  type?: string;
  farmer?: string;
  search?: string;
  page: number;
  limit: number;
  sort?: string;
}) => {
  return useQuery<AdminProductResponse>({
    queryKey: ["admin-products", category, type, farmer, search, page, limit, sort],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (type) params.append("type", type);
      if (farmer) params.append("farmer", farmer);
      if (search) params.append("search", search);
      if (sort) params.append("sort", sort);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const res = await api.get(
        `/admin/products?${params.toString()}`
      );

      return res.data;
    },
  });
};
