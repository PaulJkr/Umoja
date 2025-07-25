import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { toast } from "sonner";

export const useToggleStockStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      inStock,
    }: {
      productId: string;
      inStock: boolean;
    }) => {
      const response = await api.patch(
        `/admin/products/${productId}/stock`,
        { inStock }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Stock status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: () => {
      toast.error("Failed to update stock status");
    },
  });
};
