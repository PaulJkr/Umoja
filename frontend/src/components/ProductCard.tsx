import React from "react";
import { User, PhoneCall, Trash2 } from "lucide-react";
import { Product } from "../services/product";
import { toast } from "react-toastify";

interface ProductCardProps {
  product: Product;
  onBuyClick?: (product: Product) => void;
  onDelete?: (id: string) => void;
  disableBuy?: boolean;
  isLoading?: boolean;
  showSellerInfo?: boolean;
  showDelete?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onBuyClick,
  onDelete,
  disableBuy = false,
  isLoading = false,
  showSellerInfo = true,
  showDelete = false,
}) => {
  // ✅ Use proxy - no need for full URL since Vite will proxy /uploads requests
  const getImageUrl = (imageUrl: string | undefined): string => {
    if (!imageUrl) return "";

    // Since we have a proxy, just use the path directly
    // Vite will automatically proxy /uploads requests to localhost:5000
    if (imageUrl.startsWith("/uploads")) {
      return imageUrl; // Use as-is
    }

    // If it doesn't start with /uploads, add it
    return `/uploads/${imageUrl.replace(/^\/+/, "")}`;
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition flex flex-col h-full">
      {product.imageUrl && (
        <img
          src={getImageUrl(product.imageUrl)}
          alt={product.name}
          className="w-full h-40 object-cover rounded mb-3"
          onError={(e) => {
            console.error("Image failed to load:", product.imageUrl);
            e.currentTarget.style.display = "none";
          }}
          onLoad={() => {
            // Image loaded successfully
          }}
        />
      )}

      <div className="flex-grow">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600 capitalize">{product.type}</p>
        {product.category && (
          <p className="text-sm text-gray-500">{product.category}</p>
        )}
        <p className="mt-1 font-bold text-green-700">
          KES {product.price.toLocaleString()}
        </p>
        <p className="text-sm text-gray-600">Qty: {product.quantity}</p>

        {product.harvestDate && (
          <p className="text-sm text-gray-500 mt-1">
            Harvested: {new Date(product.harvestDate).toLocaleDateString()}
          </p>
        )}

        {showSellerInfo && product.seller && (
          <div className="mt-4 p-3 bg-gray-50 rounded border">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Farmer Info
            </h4>
            <p className="flex items-center text-sm text-gray-700 mb-1">
              <User className="w-4 h-4 mr-1" /> {product.seller.name}
            </p>
            <p className="flex items-center text-sm text-gray-700">
              <PhoneCall className="w-4 h-4 mr-1" /> {product.seller.phone}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        {onBuyClick && (
          <button
            onClick={() => {
              if (disableBuy || isLoading) {
                toast.info("⏳ Please wait...");
                return;
              }
              onBuyClick(product);
            }}
            disabled={disableBuy || isLoading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Request / Buy"}
          </button>
        )}

        {showDelete && onDelete && (
          <button
            onClick={() => onDelete(product._id)}
            className="w-full flex items-center justify-center gap-2 text-red-600 border border-red-600 py-2 rounded hover:bg-red-50 transition"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        )}
      </div>

      {/* Debug info removed - everything working! */}
    </div>
  );
};

export default ProductCard;
