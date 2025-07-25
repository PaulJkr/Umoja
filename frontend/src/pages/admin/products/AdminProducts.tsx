import React, { useState } from "react";
import { useAdminProducts } from "../../../hooks/useAdminProducts";
import AdminProductCard from "../../../components/AdminProductCard";
import { Skeleton } from "../../../components/ui/skeleton";
import { Button } from "../../../components/ui/button";

const AdminProducts = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminProducts({ page, limit: 10 });

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Admin Product List</h2>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, idx) => (
            <Skeleton key={idx} className="h-16 w-full rounded-md" />
          ))}
        </div>
      ) : !products.length ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="space-y-2">
          {products.map((product) => (
            <AdminProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-4 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground pt-1">Page {page}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AdminProducts;
