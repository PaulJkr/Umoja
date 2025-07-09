import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useFarmerAnalytics = (farmerId: string) => {
  return useQuery({
    queryKey: ["farmerAnalytics", farmerId],
    queryFn: async () => {
      const res = await api.get(`/api/orders/farmer/${farmerId}/stats`);
      return res.data;
    },
    enabled: !!farmerId,
  });
};
