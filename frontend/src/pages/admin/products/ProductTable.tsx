import React from "react";
import { Skeleton } from "../../../components/ui/skeleton";

interface Product {
  _id: string;
  name: string;
  category: string;
  type: string;
  price: number;
  imageUrl: string;
  ownerId: {
    _id: string;
    name: string;
  };
}

const ProductTable = ({
  products,
  isLoading,
}: {
  products: Product[] | undefined;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, idx) => (
          <Skeleton key={idx} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return <p className="text-gray-500 text-center">No products found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="table-auto w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Image</th>
            <th className="p-3">Name</th>
            <th className="p-3">Type</th>
            <th className="p-3">Farmer</th>
            <th className="p-3">Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product._id}
              className="border-t hover:bg-gray-50 transition-all"
            >
              <td className="p-3">
                {product.imageUrl ? (
                  <img
                    src={`http://localhost:5000${product.imageUrl}`}
                    alt={product.name}
                    className="h-10 w-10 object-cover rounded-md"
                  />
                ) : (
                  <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                    No Image
                  </div>
                )}
              </td>
              <td className="p-3">{product.name}</td>
              <td className="p-3">{product.type}</td>
              <td className="p-3">{product.ownerId?.name || "Unknown"}</td>
              <td className="p-3">Ksh {product.price.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
