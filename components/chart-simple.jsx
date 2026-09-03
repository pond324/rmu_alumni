"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaFolderOpen } from "react-icons/fa";

const CustomBarTooltip = ({ active, payload, label, key1, key2 }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-3.5 border border-slate-200 rounded-xl shadow-xl min-w-[180px]">
        <p className="font-semibold text-slate-800 text-sm mb-2 border-b border-slate-100 pb-1">
          {label}
        </p>
        <div className="space-y-1 text-xs">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-600">
                  {entry.name === "working"
                    ? "มีงานทำ"
                    : entry.name === "unemployed"
                      ? "ว่างงาน/ไม่พบข้อมูล"
                      : entry.name === "percent"
                        ? "อัตราการได้งาน"
                        : entry.name === "count"
                          ? "จำนวน"
                          : entry.name}
                  :
                </span>
              </div>
              <span className="font-bold text-slate-800">
                {entry.name === "percent"
                  ? `${entry.value}%`
                  : `${Number(entry.value).toLocaleString()} คน`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function ChartSimple({
  key1,
  key2,
  data = [],
  color1,
  color2,
  domain,
  height = 380,
}) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{ height }}
        className="w-full flex flex-col items-center justify-center text-slate-400 gap-2"
      >
        <FaFolderOpen size={36} className="opacity-40" />
        <p className="text-sm font-medium">ไม่พบข้อมูลสถิติ</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 15, left: -15, bottom: 65 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            angle={-35}
            textAnchor="end"
            height={70}
            interval={0}
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
          />
          <YAxis
            domain={domain}
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomBarTooltip key1={key1} key2={key2} />} />
          <Bar
            dataKey={key1}
            name={key1}
            fill={color1 || "#3B82F6"}
            barSize={key2 ? 20 : 28}
            radius={[6, 6, 0, 0]}
          />
          {key2 && (
            <Bar
              dataKey={key2}
              name={key2}
              fill={color2 || "#F97316"}
              barSize={20}
              radius={[6, 6, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
