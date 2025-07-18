import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface LineChartCardProps {
  data: Record<string, number>;
}

const LineChartCard = ({ data }: LineChartCardProps) => {
  const chartData = Object.entries(data).map(([date, value]) => ({
    date,
    value,
  }));

  return (
    <div className="bg-white p-4 rounded-lg shadow-md dark:bg-gray-900">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
        Sales Trend (Last 30 Days)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#10B981"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartCard;
