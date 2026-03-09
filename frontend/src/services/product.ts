import api from "../api/axios"; 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Seller {
  _id: string;
  name: string;
  phone: string;
  
}

// Update Product interface
export interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  inStock: boolean;
  category?: string;
  type: "produce" | "seed" | "fertilizer";
  imageUrl?: string;
  description?: string;
  harvestDate?: string;
  certification?: string;
  verified?: boolean;
  status?: "active" | "inactive";
  seller?: Seller; 
}
export interface AdminProduct extends Product {
  ownerId?: {
    _id: string;
    name: string;
  };
}
export const useFarmerProducts = () =>
  useQuery<Product[]>({
    queryKey: ["myProducts"],
    queryFn: async () => {
      const res = await api.get("/products/mine"); // ✅ secure
      return res.data;
    },
  });

// ➕ Add a new product
export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await api.post("/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
    },
  });
};


// 🗑️ Delete a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`); // ✅ secure
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
    },
  });
};

// ✏️ Update a product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Product>;
    }) => {
      const res = await api.put(`/products/${id}`, data); // ✅ secure
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
    },
  });
};
// 🌍 Fetch all products (for buyer view)
export const useAllProducts = () =>
  useQuery<AdminProduct[]>({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const res = await api.get("/products/admin"); // 📣 Public endpoint for all products
      return res.data;
    },
  });
