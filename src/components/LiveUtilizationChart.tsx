"use client";
import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

export default function LiveUtilizationChart() {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const bikes = hours.map((h) => {
    const base =
      10 +
      40 * Math.sin(((h - 6) / 24) * Math.PI * 2) ** 2 +
      25 * Math.max(0, Math.sin(((h - 17) / 12) * Math.PI * 2));
    const noise = (Math.random() - 0.5) * 8;
    return Math.max(0, Math.round(base + noise));
  });

  return (
    <div className="w-full rounded-2xl bg-[#1e293b] p-5 text-white shadow-lg">
      <h3 className="text-lg font-semibold tracking-tight mb-4">
        Live Utilization (Last 24h)
      </h3>

      <div style={{ height: "400px" }}>
        <LineChart
          xAxis={[
            {
              data: hours,
              label: "Hour of Day",
              tickInterval: (_v: number, i: number) => i % 2 === 0,
              valueFormatter: (v: number) =>
                `${v.toString().padStart(2, "0")}:00`,
              scaleType: "point",
              labelStyle: { fill: "#ffffff", fontSize: 12 },
              tickLabelStyle: { fill: "#ffffff", fontSize: 11 },
            },
          ]}
          yAxis={[
            {
              label: "Bikes in Use",
              labelStyle: { fill: "#ffffff", fontSize: 12 },
              tickLabelStyle: { fill: "#ffffff", fontSize: 11 },
            },
          ]}
          series={[
            {
              data: bikes,
              color: "#3b82f6",
              showMark: true,
              area: false,
              
            },
          ]}
          grid={{ vertical: false }}
          sx={{
            "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
              stroke: "#64748b",
            },
            "& .MuiChartsAxis-tickLabel, & .MuiChartsAxis-label": {
              fill: "#ffffff", 
            },
            "& .MuiLineElement-root": {
              strokeWidth: 2,
            },
            "& .MuiChartsAxis-root, & .MuiChartsGrid-root": {
              "& line": {
                stroke: "#334155",
              },
            },
          }}
        />
      </div>
    </div>
  );
}
