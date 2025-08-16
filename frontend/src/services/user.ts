// src/services/user.ts
import api from "../api/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface User {
  _id: string;
  name: string;
  phone: string;
  location?: string;
  role?: string;
}

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
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const res = await api.put("/users/me", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
