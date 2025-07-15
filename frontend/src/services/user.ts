// src/services/user.ts
import api from "../api/axios";
import { useQuery } from "@tanstack/react-query";

export interface Seller {
  _id: string;
  name: string;
  phone: string;
}

export const useSellers = () =>
  useQuery<Seller[]>({
    queryKey: ["sellers"],
    queryFn: async () => {
      const res = await api.get("/users/sellers");
      return res.data;
    },
  });
