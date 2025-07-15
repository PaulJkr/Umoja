import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader, Search, Heart, HeartCrack } from "lucide-react";
import api from "../../api/axios";
import { useAuthStore } from "../../context/authStore";
import { useWishlistStore } from "../../context/wishlistStore";
import { toast } from "react-toastify";

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  type: "produce" | "seed" | "fertilizer";
  imageUrl?: string;
  seller?: {
    _id: string;
    name: string;
    phone: string;
  };
}

const MarketplacePage = () => {
  const { user, loadUserFromStorage } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const {
    data: allProducts,
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["marketplaceProducts"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data;
    },
  });

  const filteredProducts = (allProducts ?? [])
    .filter((product) => {
      return (
        (category === "all" || product.type === category) &&
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === "priceLow") return a.price - b.price;
      if (sortBy === "priceHigh") return b.price - a.price;
      if (sortBy === "nameAZ") return a.name.localeCompare(b.name);
      if (sortBy === "nameZA") return b.name.localeCompare(a.name);
      return 0;
    });

  if (isLoading)
    return (
      <div className="p-6 text-gray-600">
        Loading <Loader className="inline animate-spin" />
      </div>
    );

  if (isError)
    return <div className="p-6 text-red-500">Failed to load products.</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Marketplace</h2>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border w-full rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-4 py-2 rounded-lg focus:ring-green-500"
        >
          <option value="all">All Categories</option>
          <option value="produce">Produce</option>
          <option value="seed">Seeds</option>
          <option value="fertilizer">Fertilizer</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-4 py-2 rounded-lg focus:ring-green-500"
        >
          <option value="default">Sort: Default</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="nameAZ">Name: A → Z</option>
          <option value="nameZA">Name: Z → A</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="relative bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{product.type}</p>
            <p className="mt-1 font-bold text-green-700">
              KES {product.price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Qty: {product.quantity}</p>

            {product.seller && (
              <div className="mt-3 text-sm text-gray-600">
                👨‍🌾 {product.seller.name} <br />
                📞 {product.seller.phone}
              </div>
            )}

            <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-2 right-2 bg-pink-100 text-pink-500 rounded-full p-1 hover:bg-pink-200 transition"
              title="Toggle Wishlist"
            >
              {isInWishlist(product._id) ? (
                <HeartCrack className="w-5 h-5" />
              ) : (
                <Heart className="w-5 h-5" />
              )}
            </button>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-gray-500 text-center pt-10">No products found.</p>
      )}
    </div>
  );
};

export default MarketplacePage;
