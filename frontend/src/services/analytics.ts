import api from "../api/axios";
import { useQuery } from "@tanstack/react-query";

export const useFarmerAnalytics = (farmerId: string) => {
  return useQuery({
    queryKey: ["farmerAnalytics", farmerId],
    queryFn: async () => {
      // Remove the extra /api since your base URL already includes it
      const res = await api.get(`/orders/farmer/${farmerId}`);
      const orders = res.data;

      // Process the raw orders data into analytics
      const analytics = processOrdersIntoAnalytics(orders);
      return analytics;
    },
    enabled: !!farmerId,
  });
};

// Helper function to process orders into analytics data
const processOrdersIntoAnalytics = (orders: any[]) => {
  if (!orders || !Array.isArray(orders)) {
    return {
      salesTrend: {},
      salesByProduct: {},
      totalRevenue: 0,
      totalOrders: 0,
    };
  }

  // Calculate sales trend (last 30 days)
  const salesTrend: Record<string, number> = {};
  const salesByProduct: Record<string, number> = {};
  let totalRevenue = 0;

  orders.forEach((order) => {
    // Extract date from order (you might need to adjust this based on your order structure)
    const orderDate = new Date(order.createdAt || order.date);
    const dateKey = orderDate.toISOString().split("T")[0]; // YYYY-MM-DD format

    // Calculate order total
    let orderTotal = 0;
    if (order.products && Array.isArray(order.products)) {
      order.products.forEach((product: any) => {
        const productName = product.productId?.name || "Unknown Product";
        const quantity = product.quantity || 0;
        const price = product.productId?.price || 0;
        const productTotal = quantity * price;

        orderTotal += productTotal;

        // Track sales by product
        if (salesByProduct[productName]) {
          salesByProduct[productName] += productTotal;
        } else {
          salesByProduct[productName] = productTotal;
        }
      });
    }

    // Track daily sales
    if (salesTrend[dateKey]) {
      salesTrend[dateKey] += orderTotal;
    } else {
      salesTrend[dateKey] = orderTotal;
    }

    totalRevenue += orderTotal;
  });

  // Fill in missing dates for the last 30 days
  const last30Days = getLast30Days();
  last30Days.forEach((date) => {
    if (!salesTrend[date]) {
      salesTrend[date] = 0;
    }
  });

  return {
    salesTrend,
    salesByProduct,
    totalRevenue,
    totalOrders: orders.length,
  };
};

// Helper function to get last 30 days
const getLast30Days = () => {
  const dates = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
};
