// context/orderStore.ts
import { create } from "zustand";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  date: string;
}

interface OrderState {
  orders: OrderItem[];
  addOrder: (items: OrderItem[]) => void;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  addOrder: (items) =>
    set((state) => ({
      orders: [
        ...state.orders,
        ...items.map((item) => ({
          ...item,
          date: new Date().toISOString(),
        })),
      ],
    })),
  clearOrders: () => set({ orders: [] }),
}));
