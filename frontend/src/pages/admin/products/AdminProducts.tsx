import React, { useState } from "react";
import ProductTable from "../../admin/products/ProductTable";
import ProductFilters from "../../admin/products/ProductFilters";
import { useAdminProducts } from "../../../services/admin/useAdminProducts";

const AdminProductsPage = () => {
  const [filters, setFilters] = useState({
    type: "",
    farmer: "",
    search: "",
  });

  const { data: products, isLoading } = useAdminProducts(filters);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">All Products</h2>
      <ProductFilters filters={filters} onChange={setFilters} />
      <ProductTable products={products} isLoading={isLoading} />
    </div>
  );
};

export default AdminProductsPage;
