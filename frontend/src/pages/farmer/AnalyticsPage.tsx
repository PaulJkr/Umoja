import React from "react";
import { useAuthStore } from "../../context/authStore";
import { useFarmerAnalytics } from "../../services/analytics";
import StatCard from "../../components/analytics/StatCard";
import LineChartCard from "../../components/analytics/LineChartCard";
import PieChartCard from "../../components/analytics/PieChartCard";

const AnalyticsPage = () => {
  const { user } = useAuthStore();
  const { data, isLoading } = useFarmerAnalytics(user?._id);

  if (isLoading || !data)
    return <div className="p-4">Loading analytics...</div>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatCard
        title="Total Revenue"
        value={`KSh ${data.totalRevenue.toFixed(2)}`}
      />
      <StatCard title="Total Orders" value={data.totalOrders} />

      <div className="col-span-1 md:col-span-2">
        <LineChartCard data={data.salesTrend} />
      </div>

      <div className="col-span-1 md:col-span-2">
        <PieChartCard data={data.salesByProduct} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
