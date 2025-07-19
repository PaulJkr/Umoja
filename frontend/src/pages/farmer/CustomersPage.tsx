// src/pages/FarmerDashboard/CustomersPage.tsx
import React from "react";
import { useFarmerCustomers, useFarmerOrders } from "../../services/order";
import { Loader2, UserCircle } from "lucide-react";
import { motion } from "framer-motion";

// ✅ Define proper TypeScript interfaces
interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
}

interface ProductInOrder {
  productId?: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  _id: string;
}

interface Order {
  _id: string;
  buyerId: {
    _id: string;
    name: string;
    phone: string;
  };
  sellerId: string;
  products: ProductInOrder[];
  status: string;
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomerStats {
  orderCount: number;
  totalSpent: number;
}

const CustomersPage = () => {
  const { data: customers, isLoading: customersLoading } = useFarmerCustomers();
  const { data: orders, isLoading: ordersLoading } = useFarmerOrders();

  if (customersLoading || ordersLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin h-8 w-8 text-green-600" />
      </div>
    );
  }

  // ✅ Properly type the orders array and reduce function
  const customerStats = ((orders as Order[]) || []).reduce(
    (acc: Record<string, CustomerStats>, order: Order) => {
      const id = order.buyerId._id;

      // ✅ Properly type the products reduce function
      const amount = order.products.reduce((sum: number, p: ProductInOrder) => {
        return sum + p.quantity * (p.productId?.price || 0);
      }, 0);

      if (!acc[id]) {
        acc[id] = { orderCount: 1, totalSpent: amount };
      } else {
        acc[id].orderCount += 1;
        acc[id].totalSpent += amount;
      }

      return acc;
    },
    {} as Record<string, CustomerStats>
  );

  // ✅ Handle case where customers might be undefined
  const customersList = (customers as Customer[]) || [];

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-semibold mb-6">Your Customers</h1>

      {customersList.length === 0 ? (
        <div className="text-center py-8">
          <UserCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">You have no customers yet.</p>
          <p className="text-gray-400 text-sm mt-2">
            Customers will appear here after they place orders with you.
          </p>
        </div>
      ) : (
        <>
          {/* ✅ Summary stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
              <h3 className="text-sm font-medium opacity-90">
                Total Customers
              </h3>
              <p className="text-2xl font-bold">{customersList.length}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
              <h3 className="text-sm font-medium opacity-90">Total Orders</h3>
              <p className="text-2xl font-bold">
                {Object.values(customerStats).reduce(
                  (sum, stats) => sum + stats.orderCount,
                  0
                )}
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
              <h3 className="text-sm font-medium opacity-90">Total Revenue</h3>
              <p className="text-2xl font-bold">
                KES{" "}
                {Object.values(customerStats)
                  .reduce((sum, stats) => sum + stats.totalSpent, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>

          {/* ✅ Customer cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {customersList.map((customer: Customer) => {
              const stats = customerStats[customer._id] || {
                orderCount: 0,
                totalSpent: 0,
              };

              return (
                <motion.div
                  key={customer._id}
                  className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md border dark:border-zinc-700 hover:shadow-lg transition-shadow"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <UserCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {customer.name}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        {customer.phone}
                      </p>
                      {customer.email && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {customer.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Orders Placed
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {stats.orderCount}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Total Spent
                      </span>
                      <span className="font-medium text-green-600">
                        KES {stats.totalSpent.toLocaleString()}
                      </span>
                    </div>

                    {stats.orderCount > 0 && (
                      <div className="flex justify-between items-center pt-2 border-t dark:border-zinc-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Avg. Order Value
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          KES{" "}
                          {Math.round(
                            stats.totalSpent / stats.orderCount
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ✅ Customer status badge */}
                  <div className="mt-4 pt-3 border-t dark:border-zinc-700">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        stats.orderCount >= 5
                          ? "bg-gold-100 text-gold-800 dark:bg-gold-900 dark:text-gold-200"
                          : stats.orderCount >= 2
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }`}
                    >
                      {stats.orderCount >= 5
                        ? "VIP Customer"
                        : stats.orderCount >= 2
                        ? "Regular Customer"
                        : "New Customer"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default CustomersPage;
