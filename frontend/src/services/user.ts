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
  return useMutation(
    (data: Partial<User>) => api.put("/users/me", data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
      },
    }
  );
};
