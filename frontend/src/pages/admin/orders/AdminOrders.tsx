import React, { useState } from "react";
import { useAllOrders } from "../../../hooks/useAllOrders";
import { motion } from "framer-motion";
import { Skeleton } from "../../../components/ui/skeleton";
import { Button } from "../../../components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AdminOrders = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAllOrders({ page, limit: 10 });

  const orders = data?.orders || [];
  const totalPages = data?.totalPages || 1;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const pageNumbers = [];
  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, page + 2);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-slate-900">All Orders</h1>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-slate-200 shadow-sm"
      >
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Farmer
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Products
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any, index: number) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-4">{order.buyerName}</td>
                      <td className="px-4 py-4">{order.farmerName}</td>
                      <td className="px-4 py-4">
                        {order.products.map((p: any) => p.name).join(", ")}
                      </td>
                      <td className="px-4 py-4">
                        Ksh {order.total?.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {totalPages > 1 && (
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing page {page} of {totalPages}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="px-3"
              >
                <ChevronLeft size={16} />
                <ChevronLeft size={16} className="-ml-1" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3"
              >
                <ChevronLeft size={16} />
              </Button>

              <div className="flex gap-1">
                {pageNumbers.map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className="w-10 h-10"
                  >
                    {pageNum}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3"
              >
                <ChevronRight size={16} />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="px-3"
              >
                <ChevronRight size={16} />
                <ChevronRight size={16} className="-ml-1" />
              </Button>
            </div>

            <div className="text-sm text-slate-600">
              Total: {orders.length} orders
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminOrders;
