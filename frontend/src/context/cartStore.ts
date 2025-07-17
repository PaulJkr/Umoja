import { create } from "zustand";
import api from "../api/axios";
import { useAuthStore } from "../context/authStore";
import { useOrderStore } from "../context/orderStore"; // Optional, if still used

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sellerId: string;
}

interface CartState {
  cartItems: CartItem[];
  isCheckingOut: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  checkout: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  isCheckingOut: false,

  addToCart: (item) => {
    const existing = get().cartItems.find((i) => i.id === item.id);
    if (existing) {
      set({
        cartItems: get().cartItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      set({ cartItems: [...get().cartItems, { ...item, quantity: 1 }] });
    }
  },

  removeFromCart: (id) =>
    set({ cartItems: get().cartItems.filter((i) => i.id !== id) }),

  increaseQuantity: (id) =>
    set({
      cartItems: get().cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ),
    }),

  decreaseQuantity: (id) =>
    set({
      cartItems: get()
        .cartItems.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0),
    }),

  clearCart: () => set({ cartItems: [] }),

  checkout: async () => {
    const { cartItems } = get();
    const { user } = useAuthStore.getState();

    set({ isCheckingOut: true });

    try {
      const payload = {
        cartItems: cartItems.map((item) => ({
          _id: item.id,
          quantity: item.quantity,
          price: item.price,
          sellerId: item.sellerId,
        })),
      };

      await api.post("/orders", payload);

      set({ cartItems: [] });
      alert("🎉 Order placed successfully!");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("❌ Failed to place order. Please try again.");
    } finally {
      set({ isCheckingOut: false });
    }
  },
}));
