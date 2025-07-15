import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Search, Trash2 } from "lucide-react";
import { Product } from "../../services/product";
import { toast } from "react-toastify";
import { useWishlistStore } from "../../context/wishlistStore";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useWishlistStore();

  console.log("🧠 Wishlist items:", wishlist);

  const handleRemove = (product: Product) => {
    toggleWishlist(product);
    toast.info("Removed from wishlist");
  };

  const handleViewProduct = () => {
    navigate("/buyer/dashboard/marketplace");
    toast.info("Scroll to find this product");
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Your Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="text-gray-500 text-center pt-20">No items in wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product: Product) => (
            <div
              key={product._id}
              className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition relative"
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

              <div className="mt-3 text-sm text-gray-600">
                👨‍🌾 {product.seller?.name ?? "Unknown"} <br />
                📞 {product.seller?.phone ?? "N/A"}
              </div>

              <div className="mt-4 flex justify-between gap-2">
                <button
                  onClick={() => handleRemove(product)}
                  className="flex items-center justify-center w-1/2 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </button>

                <button
                  onClick={handleViewProduct}
                  className="flex items-center justify-center w-1/2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded"
                >
                  <Search className="w-4 h-4 mr-1" />
                  View in Marketplace
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
