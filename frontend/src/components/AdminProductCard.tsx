import React from "react";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import { useToggleStockStatus } from "../hooks/useToggleStockStatus";
import { AdminProduct } from "../services/product";

interface Props {
  product: AdminProduct;
}

const AdminProductCard = ({ product }: Props) => {
  const deleteMutation = useDeleteProduct();
  const toggleStock = useToggleStockStatus();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(product._id);
    }
  };

  const handleToggleStock = () => {
    toggleStock.mutate({
      productId: product._id,
      inStock: !product.inStock,
    });
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-md shadow-sm">
      <div className="flex items-center gap-4">
        {product.imageUrl ? (
          <img
            src={`http://localhost:5000${product.imageUrl}`}
            alt={product.name}
            className="h-12 w-12 object-cover rounded-md"
          />
        ) : (
          <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
            No Image
          </div>
        )}
        <div>
          <p className="font-semibold">{product.name}</p>
          <p className="text-xs text-gray-500">{product.type}</p>
          <p className="text-xs text-gray-500">
            Ksh {product.price.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400">
            Farmer: {product.ownerId?.name || "Unknown"}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-end md:items-center gap-2 mt-4 md:mt-0">
        <Button
          variant={product.inStock ? "outline" : "default"}
          onClick={handleToggleStock}
          className="text-xs"
        >
          {product.inStock ? (
            <>
              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
              In Stock
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 mr-1 text-red-500" />
              Out of Stock
            </>
          )}
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          className="text-xs"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default AdminProductCard;
