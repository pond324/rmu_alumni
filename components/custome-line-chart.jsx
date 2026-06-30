import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const LineChartComponents = ({ data, name }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data || []}
        margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#dbeafe" // blue-100
        />

        <XAxis
          dataKey="name"
          tick={{
            fontSize: 15,
            fill: "#1e3a8a", // blue-900
          }}
          axisLine={{ stroke: "#93c5fd" }}
          tickLine={{ stroke: "#93c5fd" }}
        />

        <YAxis
          allowDecimals={false}
          tick={{ fill: "#1e3a8a" }}
          axisLine={{ stroke: "#93c5fd" }}
          tickLine={{ stroke: "#93c5fd" }}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #bfdbfe",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
          labelStyle={{
            fontWeight: "bold",
            color: "#1d4ed8",
          }}
        />

        <Legend
          verticalAlign="top"
          height={36}
          wrapperStyle={{
            color: "#1e3a8a",
          }}
        />

        <Line
          type="monotone"
          dataKey="value"
          stroke="#3b82f6" // blue-500
          strokeWidth={3}
          dot={{
            r: 5,
            fill: "#3b82f6",
            stroke: "#ffffff",
            strokeWidth: 2,
          }}
          activeDot={{
            r: 8,
            fill: "#2563eb", // blue-600
            stroke: "#ffffff",
            strokeWidth: 2,
          }}
          name={name}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponents;