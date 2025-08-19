import api from "../api/axios";
import { useQuery } from "@tanstack/react-query";

export const useFarmerAnalytics = (farmerId: string | undefined, period: string) => {
  return useQuery({
    queryKey: ["farmerAnalytics", farmerId, period],
    queryFn: async () => {
      // Remove the extra /api since your base URL already includes it
      const res = await api.get(`/orders/farmer/${farmerId as string}`);
      const orders = res.data;

      // Process the raw orders data into analytics
      const analytics = processOrdersIntoAnalytics(orders, period);
      return analytics;
    },
    enabled: !!farmerId,
  });
};

// Helper function to process orders into analytics data
interface ProductInOrder {
  productId?: {
    name?: string;
    price?: number;
  };
  quantity?: number;
}

interface Order {
  createdAt?: string;
  date?: string;
  products?: ProductInOrder[];
}

const processOrdersIntoAnalytics = (orders: Order[], period: string) => {
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

  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "7 days":
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case "30 days":
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case "3 months":
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    case "6 months":
      startDate = new Date(now.setMonth(now.getMonth() - 6));
      break;
    case "1 year":
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setMonth(now.getMonth() - 1));
  }

  const filteredOrders = orders.filter(order => {
    const orderDateValue = order.createdAt || order.date;
    if (!orderDateValue) return false;
    const orderDate = new Date(orderDateValue);
    return orderDate >= startDate;
  });

  filteredOrders.forEach((order) => {
    // Extract date from order (you might need to adjust this based on your order structure)
    const orderDateValue = order.createdAt || order.date;
    if (!orderDateValue) return;
    const orderDate = new Date(orderDateValue);
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

  // Fill in missing dates for the selected period
  const datesForPeriod = getDatesForPeriod(period);
  datesForPeriod.forEach((date) => {
    if (!salesTrend[date]) {
      salesTrend[date] = 0;
    }
  });

  return {
    salesTrend,
    salesByProduct,
    totalRevenue,
    totalOrders: filteredOrders.length,
  };
};

// Helper function to get dates for a given period
const getDatesForPeriod = (period: string) => {
  const dates = [];
  const now = new Date();
  let days = 30;

  switch (period) {
    case "7 days":
      days = 7;
      break;
    case "30 days":
      days = 30;
      break;
    case "3 months":
      days = 90;
      break;
    case "6 months":
      days = 180;
      break;
    case "1 year":
      days = 365;
      break;
  }

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
};
