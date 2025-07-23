import React from "react";

interface Props {
  filters: {
    type: string;
    farmer: string;
    search: string;
  };
  onChange: (filters: Props["filters"]) => void;
}

const ProductFilters: React.FC<Props> = ({ filters, onChange }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <input
        type="text"
        placeholder="Search products"
        className="input input-bordered"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />
      <input
        type="text"
        placeholder="Filter by Type"
        className="input input-bordered"
        value={filters.type}
        onChange={(e) => onChange({ ...filters, type: e.target.value })}
      />
      <input
        type="text"
        placeholder="Filter by Farmer"
        className="input input-bordered"
        value={filters.farmer}
        onChange={(e) => onChange({ ...filters, farmer: e.target.value })}
      />
    </div>
  );
};

export default ProductFilters;
