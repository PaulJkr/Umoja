import api from "../api/axios"; // ✅ This ensures token is sent
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Product type definition
// Add Seller interface
export interface Seller {
  _id: string;
  name: string;
  phone: string;
  // Add other seller properties as needed
}

// Update Product interface
export interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  type: "produce" | "seed" | "fertilizer";
  imageUrl?: string;
  harvestDate?: string;
  certification?: string;
  verified?: boolean;
  seller?: Seller; // Add optional seller info
}
// 🔍 Fetch all products owned by the logged-in farmer/supplier
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
  useQuery<Product[]>({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const res = await api.get("/products"); // 📣 Public endpoint for all products
      return res.data;
    },
  });
