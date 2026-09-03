"use client";
import { FaFolderOpen } from "react-icons/fa";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 border border-slate-200 rounded-xl shadow-xl min-w-[170px]">
        <p className="font-semibold text-slate-800 text-sm mb-1">
          จังหวัด: <span className="text-blue-600 font-bold">{label}</span>
        </p>
        <p className="text-xs text-slate-600">
          จำนวนศิษย์เก่า:{" "}
          <span className="font-bold text-slate-900 text-sm">
            {Number(payload[0].value).toLocaleString()}
          </span>{" "}
          คน
        </p>
      </div>
    );
  }
  return null;
};

const AlumniLineChart = ({ data = [] }) => {
  const validData = (data || []).filter((d) => d && (d.company_place || d.name));

  return (
    <div className="w-full">
      {validData.length > 0 ? (
        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={validData}
              margin={{ top: 10, right: 20, left: -15, bottom: 40 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="company_place"
                angle={-30}
                textAnchor="end"
                height={50}
                interval={0}
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomLineTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#2563EB"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
                dot={{ r: 4, fill: "#2563EB", stroke: "#ffffff", strokeWidth: 2 }}
                activeDot={{ r: 7, fill: "#1D4ED8", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="w-full h-64 flex flex-col text-sm text-slate-400 items-center justify-center gap-2">
          <FaFolderOpen size={36} className="opacity-40" />
          <p className="font-medium">ไม่พบข้อมูลจังหวัดที่ทำงาน</p>
        </div>
      )}
    </div>
  );
};

export default AlumniLineChart;
