"use client";
import { FaFolderOpen } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const CustomCountryTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 border border-slate-200 rounded-xl shadow-xl min-w-[170px]">
        <p className="font-semibold text-slate-800 text-sm mb-1">
          ประเทศ: <span className="text-teal-600 font-bold">{label}</span>
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

const AlumniColumnChart = ({ rawData = [] }) => {
  const data = (rawData || []).map((item) => ({
    name: item.company_place || "ไม่ระบุ",
    alumniCount: item._count?.alumniId || item.value || 0,
  })).filter(item => item.alumniCount > 0);

  return (
    <div className="w-full">
      {data.length > 0 ? (
        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 25, right: 20, left: -15, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
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
              <Tooltip content={<CustomCountryTooltip />} />
              <Bar
                dataKey="alumniCount"
                fill="#0D9488"
                barSize={36}
                radius={[6, 6, 0, 0]}
              >
                <LabelList
                  dataKey="alumniCount"
                  position="top"
                  fill="#0f766e"
                  fontSize={12}
                  fontWeight="bold"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="w-full h-64 flex flex-col text-sm text-slate-400 items-center justify-center gap-2">
          <FaFolderOpen size={36} className="opacity-40" />
          <p className="font-medium">ไม่พบข้อมูลการทำงานต่างประเทศ</p>
        </div>
      )}
    </div>
  );
};

export default AlumniColumnChart;
