import { Product } from "../services/product";

interface Props {
  product: Product;
  onDelete: (id: string) => void;
}

const ProductCard = ({ product, onDelete }: Props) => {
  return (
    <div className="p-4 bg-white border rounded shadow space-y-2">
      <h2 className="font-semibold text-lg">{product.name}</h2>
      <p>Price: KES {product.price}</p>
      <p>Quantity: {product.quantity}</p>
      <p className="text-gray-500 text-sm">{product.category}</p>
      <button
        onClick={() => onDelete(product._id)}
        className="text-red-600 hover:underline text-sm"
      >
        Delete
      </button>
    </div>
  );
};

export default ProductCard;
