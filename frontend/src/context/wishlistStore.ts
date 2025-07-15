import { Product } from "../services/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  wishlist: Product[];
  toggleWishlist: (productOrId: Product | string) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      toggleWishlist: (productOrId) => {
        const id =
          typeof productOrId === "string" ? productOrId : productOrId._id;

        const exists = get().wishlist.find((item) => item._id === id);

        if (exists) {
          set((state) => ({
            wishlist: state.wishlist.filter((item) => item._id !== id),
          }));
        } else if (typeof productOrId !== "string") {
          set((state) => ({
            wishlist: [...state.wishlist, productOrId],
          }));
        }
      },
      isInWishlist: (id) => !!get().wishlist.find((item) => item._id === id),
    }),
    {
      name: "wishlist-storage",
    }
  )
);
