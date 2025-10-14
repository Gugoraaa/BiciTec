"use client";
import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { FaSpinner } from "react-icons/fa";
import api from "@/lib/api";
import { useTranslations } from "next-intl";

interface BikeUsageData {
  hour: string;
  count: number;
}

export default function LiveUtilizationChart() {
  const [bikeData, setBikeData] = useState<BikeUsageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("LiveUtilizationChart"); 
  
  useEffect(() => {
    const fetchBikeUsage = async () => {
      try {
        const { data } = await api.get('/overview/bikes-used-24h');
        setBikeData(data);
      } catch (err) {
        console.error('Error fetching bike usage data:', err);
        setError('Error al cargar los datos de uso de bicicletas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBikeUsage();
  }, []);

  const dataMap = new Map(bikeData.map(item => [item.hour, item.count]));

  const hours: string[] = [];
  const bikes: number[] = [];
  for (let i = 18; i < 24; i++) {
    const hour = `${String(i).padStart(2, '0')}:00`;
    hours.push(hour);
    bikes.push(dataMap.get(hour) || 0);
  }

  for (let i = 0; i <= 17; i++) {
    const hour = `${String(i).padStart(2, '0')}:00`;
    hours.push(hour);
    bikes.push(dataMap.get(hour) || 0);
  }

  if (isLoading) {
    return (
      <div className="w-full rounded-2xl bg-[#1e293b] p-5 text-white shadow-lg flex items-center justify-center" style={{ height: '500px' }}>
        <div className="flex items-center gap-2 text-blue-400">
          <FaSpinner className="animate-spin text-2xl" />
          <span>{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-2xl bg-[#1e293b] p-5 text-white shadow-lg flex items-center justify-center" style={{ height: '500px' }}>
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-[#1e293b] p-5 text-white shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold tracking-tight">
          {t("title")}
        </h3>
      </div>

      <div style={{ height: "400px" }}>
        <LineChart
          xAxis={[{
            data: hours,
            label: t("xAxisLabel"),
            tickInterval: (value: number, index: number) => index % 2 === 0,
            valueFormatter: (value: string) => value,
            scaleType: "point",
            labelStyle: { fill: "#ffffff", fontSize: 12 },
            tickLabelStyle: { fill: "#ffffff", fontSize: 11 }
          }]}
          yAxis={[{
            label: t("yAxisLabel"),
            labelStyle: { fill: "#ffffff", fontSize: 12 },
            tickLabelStyle: { fill: "#ffffff", fontSize: 11 }
          }]}
          series={[{
            data: bikes,
            color: "#3b82f6"
          }]}
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