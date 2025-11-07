"use client";
import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { FaSpinner } from "react-icons/fa";
import api from "@/lib/api";
import { useTranslations } from "next-intl";
import { BikeUsageData } from "@/types/bike";

export default function LiveUtilizationChart() {
  const [bikeData, setBikeData] = useState<BikeUsageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("LiveUtilizationChart");

  useEffect(() => {
    const fetchBikeUsage = async () => {
      try {
        const { data } = await api.get("/overview/bikes-used-24h");
        setBikeData(data);
      } catch (err) {
        console.error("Error fetching bike usage data:", err);
        setError("Error al cargar los datos de uso de bicicletas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBikeUsage();
  }, []);

  const reversedData = [...bikeData].reverse();
  const hours = reversedData.map((item) => item.hour);
  const bikes = reversedData.map((item) => item.count);

  if (isLoading) {
    return (
      <div
        className="w-full rounded-2xl bg-[#1e293b] p-5 text-white shadow-lg flex items-center justify-center"
        style={{ height: "500px" }}
      >
        <div className="flex items-center gap-2 text-blue-400">
          <FaSpinner className="animate-spin text-2xl" />
          <span>{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="w-full rounded-2xl bg-[#1e293b] p-5 text-white shadow-lg flex items-center justify-center"
        style={{ height: "500px" }}
      >
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white shadow-lg border border-slate-700/50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-blue-400">
            {t("title")}
          </h3>
        </div>
      </div>

      <div style={{ height: "400px" }}>
        <LineChart
          xAxis={[
            {
              data: hours,
              label: t("xAxisLabel"),
              scaleType: "point",
              labelStyle: { fill: "#94a3b8", fontSize: 13, fontWeight: 600 },
              tickLabelStyle: { fill: "#cbd5e1", fontSize: 12 },
            },
          ]}
          yAxis={[
            {
              label: t("yAxisLabel"),
              labelStyle: { fill: "#94a3b8", fontSize: 13, fontWeight: 600 },
              tickLabelStyle: { fill: "#cbd5e1", fontSize: 12 },
              tickMinStep: 1,
              valueFormatter: (value: number) => Number.isInteger(value) ? value.toString() : '',
            },
          ]}
          series={[
            {
              data: bikes,
              color: "#3b82f6",
              curve: "catmullRom",
              showMark: true,
            },
          ]}
          grid={{
            vertical: true,
            horizontal: true,
          }}
          sx={{
            "& .MuiChartsAxis-line": {
              stroke: "#475569",
              strokeWidth: 2,
            },
            "& .MuiChartsAxis-tick": {
              stroke: "#64748b",
            },
            "& .MuiChartsAxis-tickLabel": {
              fill: "#cbd5e1",
            },
            "& .MuiChartsAxis-label": {
              fill: "#94a3b8",
              fontWeight: 600,
            },
            "& .MuiLineElement-root": {
              strokeWidth: 3,
            },
            "& .MuiChartsGrid-line": {
              stroke: "#334155",
              strokeWidth: 1,
              strokeDasharray: "1 1",
            },
            "& .MuiMarkElement-root": {
              fill: "#3b82f6",
              stroke: "#1e293b",
              strokeWidth: 2,
            },
          }}
        />
      </div>
    </div>
  );
}
