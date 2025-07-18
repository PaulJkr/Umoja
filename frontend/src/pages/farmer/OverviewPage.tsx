import React from "react";
import { useAuthStore } from "../../context/authStore";
import { useFarmerProducts } from "../../services/product";
import { useFarmerOrders } from "../../services/order";
import ProductCard from "../../components/ProductCard";
import { ShoppingBag, Users, BarChart } from "lucide-react";

// Simple StatCard component definition
type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
};

const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => (
  <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
    <div>{icon}</div>
    <div>
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  </div>
);

const OverviewPage = () => {
  const { user } = useAuthStore();
  const farmerId = user?._id;

  const { data: products = [] } = useFarmerProducts();
  const { data: orders = [] } = useFarmerOrders();

  type Order = {
    totalPrice: number;
    buyerId: string;
    // add other fields if needed
  };

  const totalSales = orders.reduce((acc: number, order: Order) => acc + order.totalPrice, 0);
  const totalOrders = new Set(orders.map((order: Order) => order.buyerId)).size;

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-semibold mb-6">
        Welcome back, {user?.name} 👋
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<ShoppingBag className="text-green-600" />}
          title="Products"
          value={products.length.toString()}
        />
        <StatCard
          icon={<BarChart className="text-blue-600" />}
          title="Sales"
          value={`KES ${totalSales.toLocaleString()}`}
        />
        <StatCard
          icon={<Users className="text-purple-600" />}
          title="Orders"
          value={totalOrders.toString()}
        />
      </div>

      {/* Recent Products */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Recent Products</h3>
        {products.length === 0 ? (
          <p className="text-sm text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewPage;
