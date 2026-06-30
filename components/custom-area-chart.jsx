import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const CustomAreaChart = ({ data, name }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />

        <XAxis dataKey="name" />
        <YAxis />

        <Tooltip />
        <Legend />

        <Area
          type="monotone"
          dataKey="value"
          stroke="#2563eb"
          strokeWidth={3}
          fill="#2563eb"
          fillOpacity={0.15}
          name={name}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CustomAreaChart;
