import {
  Pie,
  PieChart,
  Sector,
  PieSectorDataItem,
  Tooltip,
  TooltipIndex,
  Cell,
  ResponsiveContainer,
} from "recharts";

// #region Sample data

export const BLUE_WHITE_15 = [
  "#0F172A",
  "#1E3A8A",
  "#2563EB",
  "#3B82F6",
  "#60A5FA",

  "#93C5FD",
  "#BFDBFE",
  "#DBEAFE",
  "#EFF6FF",
  "#F8FAFC",

  "#E0F2FE",
  "#F0F9FF",
  "#F8FBFF",
  "#FCFDFF",
  "#FFFFFF",
];

// #endregion
const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}) => {
  const RADIAN = Math.PI / 180;
  const angle = -RADIAN * (midAngle ?? 0);

  const x = (cx ?? 0) + (innerRadius ?? 0) * 0.65 * Math.cos(angle);
  const y = (cy ?? 0) + (innerRadius ?? 0) * 0.65 * Math.sin(angle);

  return (
    <g>
      {/* 🔹 สำคัญ: ต้อง render Sector */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />

      {/* (ถ้าต้องการ highlight เพิ่ม) */}
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) - 6}
        outerRadius={outerRadius}
        fill={fill}
        opacity={0.9}
      />

      {/* Text ภายในโดนัท */}
      <text
        x={x}
        y={y - 10}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#333"
        fontSize={14}
        fontWeight={600}
      >
        {value?.toLocaleString() || 0} คน
      </text>

      <text
        x={x}
        y={y + 8}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#999"
        fontSize={12}
      >
        ( {((percent ?? 0) * 100).toFixed(2)}%)
      </text>

      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={fill}
        fontSize={14}
        fontWeight={500}
      >
        {payload.name}
      </text>
    </g>
  );
};

export default function CustomActiveShapePieChart({
  isAnimationActive = true,
  defaultIndex = undefined,
  data = [],
  color = BLUE_WHITE_15,
}) {
  return (
   <ResponsiveContainer width="90%" aspect={1}>
      <PieChart>
        <Pie
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="80%"
          fill="#8884d8"
          dataKey="value"
          isAnimationActive={isAnimationActive}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={color[index % color.length]} />
          ))}
        </Pie>
        <Tooltip content={() => null} defaultIndex={defaultIndex} />
      </PieChart>
    </ResponsiveContainer>
  );
}
