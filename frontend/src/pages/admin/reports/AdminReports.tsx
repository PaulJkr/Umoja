import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";
import { Skeleton } from "../../../components/ui/skeleton";

const AdminReports = () => {
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const res = await api.get("/admin/dashboard-stats");
      return res.data;
    },
  });

  const { data: recentOrders, isLoading: loadingOrders } = useQuery({
    queryKey: ["admin-recent-orders"],
    queryFn: async () => {
      const res = await api.get("/admin/recent-orders");
      return res.data;
    },
  });

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Admin Reports</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingStats ? (
          [...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-md" />
          ))
        ) : (
          <>
            <StatCard label="Total Users" value={stats.totalUsers} />
            <StatCard label="Total Products" value={stats.totalProducts} />
            <StatCard label="Total Orders" value={stats.totalOrders} />
            <StatCard
              label="Total Revenue"
              value={`Ksh ${stats.totalRevenue}`}
            />
          </>
        )}
      </div>

      {/* Recent Orders Table */}
      <div>
        <h3 className="text-lg font-medium mb-2">Recent Orders</h3>
        {loadingOrders ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : !recentOrders?.length ? (
          <p className="text-gray-500">No recent orders available.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Buyer</th>
                  <th className="p-3 text-left">Farmer</th>
                  <th className="p-3 text-left">Product(s)</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{order.buyerName}</td>
                    <td className="p-3">{order.farmerName}</td>
                    <td className="p-3">
                      {order.products.map((p: any) => p.name).join(", ")}
                    </td>
                    <td className="p-3">Ksh {order.total}</td>
                    <td className="p-3">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => (
  <div className="bg-white shadow rounded-lg p-4 border">
    <p className="text-sm text-gray-600">{label}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

export default AdminReports;
