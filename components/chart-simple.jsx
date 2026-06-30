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

export default function ChartSimple({
  key1,
  key2,
  data,
  color1,
  color2,
  domain,
}) {
  return (
    <div style={{ width: "100%", height: 500 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
            tick={{ fontSize: 13 }}
          />
          <YAxis tick={{}} domain={domain} />
          <Tooltip />
          <Bar
            dataKey={key1}
            fill={color1 || "#8884d8"}
            // activeBar={<Rectangle fill="pink" stroke="blue" />}
            barSize={38} // เพิ่มบรรทัดนี้
            radius={[8, 8, 0, 0]}
          />
          {key2 && (
            <Bar
              dataKey={key2}
              fill={color2 || "#82ca9d"}
              // activeBar={<Rectangle fill="gold" stroke="purple" />}
              barSize={38} // เพิ่มบรรทัดนี้
              radius={[8, 8, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
