"use client";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { FaGlobeAsia, FaMapMarkerAlt } from "react-icons/fa";

const PLACE_COLORS = ["#3B82F6", "#10B981"]; // Blue (In Thailand), Emerald (Abroad)

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const color = data.name.includes("ต่างประเทศ") ? "#10B981" : "#3B82F6";

    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 border border-slate-200 rounded-xl shadow-xl min-w-[180px]">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <p className="font-semibold text-slate-800 text-xs">{data.name}</p>
        </div>
        <div className="space-y-0.5 text-xs text-slate-600 pl-4">
          <p>
            จำนวน:{" "}
            <span className="font-bold text-slate-900">
              {Number(Math.round(data.value)).toLocaleString()}
            </span>{" "}
            คน
          </p>
          {data.total > 0 && (
            <p>
              คิดเป็น:{" "}
              <span className="font-semibold text-blue-600">
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

const WorkPlaceRatePieChartComponent = ({ data = [], openToolTip = true }) => {
  const total = data.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  const dataWithTotal = data.map((item) => ({
    ...item,
    total,
  }));

  const inThai = data.find((d) => d.name.includes("ในประเทศ"))?.value || 0;
  const abroad = data.find((d) => d.name.includes("ต่างประเทศ"))?.value || 0;

  return (
    <div className="w-full flex flex-col items-center">
      {total === 0 ? (
        <div className="w-full flex flex-col items-center justify-center gap-2 py-10 text-slate-400">
          <FaGlobeAsia size={38} className="opacity-25" />
          <p className="text-sm font-medium text-slate-400">ยังไม่มีข้อมูลสถานที่ทำงาน</p>
          <p className="text-xs text-slate-300">ศิษย์เก่ายังไม่ได้ระบุข้อมูลการทำงาน</p>
        </div>
      ) : (
        <div className="w-full h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithTotal}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {dataWithTotal.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name.includes("ต่างประเทศ") ? "#10B981" : "#3B82F6"}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              {openToolTip && <Tooltip content={<CustomTooltip />} />}
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary Badges */}
      <div className="w-full grid grid-cols-2 gap-2 mt-2">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50/80 border border-blue-100">
          <div className="p-1.5 bg-blue-500 rounded-md text-white">
            <FaMapMarkerAlt size={14} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-slate-500 truncate">ในประเทศ</span>
            <span className="text-xs font-bold text-slate-800">
              {Number(inThai).toLocaleString()} คน{" "}
              <span className="text-[10px] text-blue-600 font-normal">
                ({total > 0 ? ((inThai / total) * 100).toFixed(0) : 0}%)
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/80 border border-emerald-100">
          <div className="p-1.5 bg-emerald-500 rounded-md text-white">
            <FaGlobeAsia size={14} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-slate-500 truncate">ต่างประเทศ</span>
            <span className="text-xs font-bold text-slate-800">
              {Number(abroad).toLocaleString()} คน{" "}
              <span className="text-[10px] text-emerald-600 font-normal">
                ({total > 0 ? ((abroad / total) * 100).toFixed(0) : 0}%)
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkPlaceRatePieChartComponent;
