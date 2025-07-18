import React from "react";
import { useAuthStore } from "../../context/authStore";
import { useFarmerProducts, useDeleteProduct } from "../../services/product";
import ProductCard from "../../components/ProductCard";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddProductModal from "../dashboard/components/AddProductModal";

const ProductsPage = () => {
  const { user } = useAuthStore();
  const farmerId = user?._id;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: products = [], isLoading } = useFarmerProducts();
  const { mutate: deleteProduct } = useDeleteProduct();

  const handleDelete = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">My Products</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found. Start by adding one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AddProductModal open={isModalOpen} setOpen={setIsModalOpen} />
    </div>
  );
};

export default ProductsPage;
