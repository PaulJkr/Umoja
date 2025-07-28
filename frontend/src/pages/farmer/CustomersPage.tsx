import React from "react";
import { motion } from "framer-motion";
import { useFarmerCustomers, useFarmerOrders } from "../../services/order";
import {
  Loader2,
  UserCircle,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Star,
  Calendar,
  Phone,
  Mail,
} from "lucide-react";

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

const StatCard = ({
  icon: Icon,
  title,
  value,
  color,
  trend,
}: {
  icon: any;
  title: string;
  value: string | number;
  color: string;
  trend?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    className={`bg-gradient-to-br ${color} text-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group`}
  >
    {/* Background decoration */}
    <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-300" />

    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-white/20 rounded-xl">
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium opacity-90 mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </motion.div>
);

const CustomerCard = ({
  customer,
  stats,
}: {
  customer: Customer;
  stats: CustomerStats;
}) => {
  const getCustomerBadge = () => {
    if (stats.orderCount >= 5) {
      return {
        label: "VIP Customer",
        className:
          "bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900",
      };
    } else if (stats.orderCount >= 2) {
      return {
        label: "Regular Customer",
        className:
          "bg-gradient-to-r from-emerald-400 to-emerald-500 text-emerald-900",
      };
    } else {
      return {
        label: "New Customer",
        className: "bg-gradient-to-r from-blue-400 to-blue-500 text-blue-900",
      };
    }
  };

  const badge = getCustomerBadge();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.02 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group"
    >
      {/* Customer Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <UserCircle className="w-8 h-8 text-emerald-600" />
          </div>
          {stats.orderCount >= 5 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 text-yellow-800" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 truncate">
            {customer.name}
          </h3>
          <div className="flex items-center gap-2 text-gray-600 mt-1">
            <Phone className="w-3 h-3" />
            <span className="text-sm">{customer.phone}</span>
          </div>
          {customer.email && (
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <Mail className="w-3 h-3" />
              <span className="text-xs truncate">{customer.email}</span>
            </div>
          )}
        </div>
      </div>

      {/* Customer Stats */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Orders Placed
            </span>
          </div>
          <span className="font-bold text-gray-900">{stats.orderCount}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">
              Total Spent
            </span>
          </div>
          <span className="font-bold text-emerald-600">
            KES {stats.totalSpent.toLocaleString()}
          </span>
        </div>

        {stats.orderCount > 0 && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Avg. Order
              </span>
            </div>
            <span className="font-bold text-blue-600">
              KES{" "}
              {Math.round(stats.totalSpent / stats.orderCount).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Customer Badge */}
      <div className="flex justify-center">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${badge.className}`}
        >
          {stats.orderCount >= 5 && <Star className="w-3 h-3" />}
          {badge.label}
        </span>
      </div>
    </motion.div>
  );
};

const CustomersPage = () => {
  const { data: customers, isLoading: customersLoading } = useFarmerCustomers();
  const { data: orders, isLoading: ordersLoading } = useFarmerOrders();

  if (customersLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600 font-medium">Loading customers...</p>
          </div>
        </div>
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

  const totalOrders = Object.values(customerStats).reduce(
    (sum, stats) => sum + stats.orderCount,
    0
  );

  const totalRevenue = Object.values(customerStats).reduce(
    (sum, stats) => sum + stats.totalSpent,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Customers
            </h1>
            <p className="text-gray-600">
              Manage your customer relationships and track their activity
            </p>
          </div>
        </motion.div>

        {customersList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No customers yet
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Customers will appear here after they place orders with you.
                Start by adding products to attract buyers!
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            {/* ✅ Summary stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <StatCard
                icon={Users}
                title="Total Customers"
                value={customersList.length}
                color="from-blue-500 to-blue-600"
              />
              <StatCard
                icon={ShoppingCart}
                title="Total Orders"
                value={totalOrders}
                color="from-emerald-500 to-emerald-600"
              />
              <StatCard
                icon={DollarSign}
                title="Total Revenue"
                value={`KES ${totalRevenue.toLocaleString()}`}
                color="from-purple-500 to-purple-600"
              />
            </motion.div>

            {/* Customer Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Customer Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {
                      customersList.filter(
                        (c) => customerStats[c._id]?.orderCount >= 5
                      ).length
                    }
                  </p>
                  <p className="text-sm text-gray-600 font-medium">
                    VIP Customers
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">
                    {
                      customersList.filter(
                        (c) =>
                          customerStats[c._id]?.orderCount >= 2 &&
                          customerStats[c._id]?.orderCount < 5
                      ).length
                    }
                  </p>
                  <p className="text-sm text-gray-600 font-medium">
                    Regular Customers
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {
                      customersList.filter(
                        (c) =>
                          !customerStats[c._id] ||
                          customerStats[c._id]?.orderCount < 2
                      ).length
                    }
                  </p>
                  <p className="text-sm text-gray-600 font-medium">
                    New Customers
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-600">
                    KES{" "}
                    {totalRevenue > 0
                      ? Math.round(
                          totalRevenue / customersList.length
                        ).toLocaleString()
                      : "0"}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">
                    Avg. Customer Value
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ✅ Customer cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {customersList.map((customer: Customer, index) => {
                const stats = customerStats[customer._id] || {
                  orderCount: 0,
                  totalSpent: 0,
                };

                return (
                  <motion.div
                    key={customer._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <CustomerCard customer={customer} stats={stats} />
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
