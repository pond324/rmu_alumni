import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const RADIAN = Math.PI / 180;

// label พร้อมเส้นชี้แบบในภาพ (วาดเอง ไม่ใช้ labelLine ของ recharts)
const renderCustomizedLabel = (props) => {
  const { cx, cy, midAngle, outerRadius, name, value, color, total } = props;

  const percent = value / total;
  const showLine = percent < 0.1; // แสดงเส้นเฉพาะ slice ที่เล็กกว่า 10%

  const sin = Math.sin(-midAngle * RADIAN);
  const cos = Math.cos(-midAngle * RADIAN);
  const textAnchor = cos >= 0 ? "start" : "end";

  if (!showLine) {
    // slice ใหญ่: วาง label ชิดขอบวงตรงๆ ไม่มีเส้น
    const x = cx + (outerRadius + 10) * cos;
    const y = cy + (outerRadius + 10) * sin;
    return (
      <text
        x={x}
        y={y}
        textAnchor={textAnchor}
        dominantBaseline="central"
        fill={color}
        fontSize={14}
      >
        {`${name}: ${value.toLocaleString()}`}
      </text>
    );
  }

  // slice เล็ก: วาดเส้นชี้แบบเดิม
  const sx = cx + (outerRadius + 1) * cos;
  const sy = cy + (outerRadius + 1) * sin;
  const mx = cx + (outerRadius + 24) * cos;
  const my = cy + (outerRadius + 24) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 16;
  const ey = my;

  return (
    <g>
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={color}
        fill="none"
        strokeWidth={1}
      />
      <circle cx={ex} cy={ey} r={2.5} fill={color} stroke="none" />
      <text
        x={ex + (textAnchor === "start" ? 8 : -8)}
        y={ey}
        textAnchor={textAnchor}
        dominantBaseline="central"
        fill={color}
        fontSize={14}
      >
        {`${name}: ${value.toLocaleString()}`}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const { name, value, total, color } = payload[0].payload;
  const percent = ((value / total) * 100).toFixed(1);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "10px 14px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        fontSize: 14,
        lineHeight: 1.5,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontWeight: 600,
          color: "#1f2937",
          marginBottom: 4,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: color,
            display: "inline-block",
          }}
        />
        {name}
      </div>
      <div style={{ color: "#374151" }}>
        จำนวน: <strong>{value.toLocaleString()}</strong>
      </div>
      <div style={{ color: "#6b7280" }}>
        คิดเป็น <strong style={{ color }}>{percent}%</strong> ของทั้งหมด
      </div>
    </div>
  );
};

const PieChartComponentWithActiveTooltips = ({ data, openToolTip = true }) => {
  const chartData = data.filter((d) => d.value > 0);
  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  const dataWithTotal = chartData.map((item) => ({ ...item, total }));

  // กรณีเหลือ category เดียว ไม่ต้องวาด external label
  const isSingleSlice = dataWithTotal.length === 1;

  return (
    <div style={{ width: 550, height: 500 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={isSingleSlice ? false : renderCustomizedLabel}
            outerRadius={150}
            innerRadius={0}
            dataKey="value"
            activeShape={{ outerRadius: 165 }}
          >
            {dataWithTotal.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          {openToolTip && <Tooltip content={<CustomTooltip />} />}
        </PieChart>
      </ResponsiveContainer>

      {isSingleSlice && (
        <p
          style={{
            textAlign: "center",
            color: dataWithTotal[0].color,
            fontSize: 14,
          }}
        >
          {dataWithTotal[0].name}: {dataWithTotal[0].value.toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default PieChartComponentWithActiveTooltips;
