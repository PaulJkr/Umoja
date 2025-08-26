import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export interface Order {
  _id: string;
  buyerName: string;
  farmerName: string;
  products: {
    name: string;
  }[];
  total: number;
  createdAt: string;
}

interface AllOrdersResponse {
  orders: Order[];
  totalPages: number;
}

export const useAllOrders = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return useQuery<AllOrdersResponse>({
    queryKey: ["all-orders", page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const res = await api.get(`/admin/orders?${params.toString()}`);

      return res.data;
    },
  });
};