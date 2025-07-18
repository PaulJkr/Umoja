interface StatCardProps {
  title: string;
  value: string | number;
}

const StatCard = ({ title, value }: StatCardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-5 dark:bg-gray-900">
      <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        {value}
      </h2>
    </div>
  );
};

export default StatCard;
