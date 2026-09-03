"use client";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { FaFolderOpen } from "react-icons/fa";

// Palette สีที่ออกแบบให้เข้ากัน สบายตา และดูมืออาชีพ
const MODERN_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#84CC16", // Lime
  "#E11D48", // Rose
  "#64748B", // Slate
];

const FACULTY_COLOR_MAP = {
  "คณะวิทยาศาสตร์และเทคโนโลยี": "#3B82F6",
  "คณะเทคโนโลยีสารสนเทศ": "#0ea5e9",
  "คณะครุศาสตร์": "#06b6d4",
  "คณะวิทยาการจัดการ": "#F59E0B",
  "คณะเทคโนโลยีการเกษตร": "#10B981",
  "คณะมนุษยศาสตร์และสังคมศาสตร์": "#8B5CF6",
  "คณะรัฐศาสตร์และรัฐประศาสนศาสตร์": "#6366F1",
  "คณะนิติศาสตร์": "#EC4899",
  "คณะวิศวกรรมศาสตร์": "#EF4444",
};

const getColor = (name, index) => {
  if (FACULTY_COLOR_MAP[name]) return FACULTY_COLOR_MAP[name];
  return MODERN_COLORS[index % MODERN_COLORS.length];
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const color = getColor(data.name, data.index || 0);

    return (
      <div className="bg-white/95 backdrop-blur-sm p-3.5 border border-slate-200 rounded-xl shadow-xl min-w-[200px]">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <p className="font-semibold text-slate-800 text-sm">{data.name}</p>
        </div>
        <div className="space-y-1 text-xs text-slate-600 pl-5">
          <p>
            เงินเดือนเฉลี่ย:{" "}
            <span className="font-bold text-blue-600 text-sm">
              {Number(Math.round(data.value)).toLocaleString()}
            </span>{" "}
            บาท
          </p>
          {data.total > 0 && (
            <p>
              สัดส่วน:{" "}
              <span className="font-semibold text-slate-700">
                {((data.value / data.total) * 100).toFixed(1)}%
              </span>
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  if (percent < 0.05) return null; // ซ่อน label ถ้าน้อยกว่า 5% เพื่อไม่ให้ทับกัน
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PieChartComponent = ({ data = [], openToolTip = true }) => {
  const validData = (data || []).filter((d) => d && Number(d.value) > 0);
  const total = validData.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  const dataWithTotal = validData.map((item, index) => ({
    ...item,
    total,
    index,
  }));

  if (!validData.length || total === 0) {
    return (
      <div className="w-full h-72 flex flex-col items-center justify-center text-slate-400 gap-2">
        <FaFolderOpen size={36} className="opacity-40" />
        <p className="text-sm font-medium">ยังไม่มีข้อมูลเงินเดือน</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithTotal}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={105}
              innerRadius={50} // Donut shape for modern look
              paddingAngle={2}
              dataKey="value"
            >
              {dataWithTotal.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColor(entry.name, index)}
                  stroke="#ffffff"
                  strokeWidth={2}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Pie>
            {openToolTip && <Tooltip content={<CustomTooltip />} />}
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend list */}
      <div className="w-full mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto px-2">
        {dataWithTotal.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-xs py-1 px-2 rounded-md hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2 truncate pr-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: getColor(item.name, idx) }}
              />
              <span className="truncate text-slate-700 font-medium">
                {item.name}
              </span>
            </div>
            <span className="font-semibold text-slate-600 shrink-0">
              ฿{Number(Math.round(item.value)).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChartComponent;
