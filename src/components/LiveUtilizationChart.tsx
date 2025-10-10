"use client";
import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { FaSpinner } from "react-icons/fa";
import api from "@/lib/api";

interface BikeUsageData {
  hour: string;
  count: number;
}

export default function LiveUtilizationChart() {
  const [bikeData, setBikeData] = useState<BikeUsageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Process the API data for the chart
  const chartData = Array.isArray(bikeData) 
    ? bikeData.map(item => ({
        hour: item?.hour || '00:00',
        hourValue: item?.hour || '00:00', // Keep as string for display
        sortValue: parseInt((item?.hour || '00:00').split(':')[0]), // For sorting
        count: typeof item?.count === 'number' ? item.count : 0
      }))
    : [];
  
  // Sort by hour to ensure correct order (11:00, 12:00, ..., 23:00, 00:00, 01:00, ..., 10:00)
  const sortedChartData = [...chartData].sort((a, b) => {
    // Convert hour to 24-hour number, handling the 24-hour cycle
    const hourA = a.sortValue;
    const hourB = b.sortValue;
    return (hourA < 11 ? hourA + 24 : hourA) - (hourB < 11 ? hourB + 24 : hourB);
  });
  
  const hours = sortedChartData.map(item => item.hourValue);
  const bikes = sortedChartData.map(item => item.count);

  if (isLoading) {
    return (
      <div className="w-full rounded-2xl bg-[#1e293b] p-5 text-white shadow-lg flex items-center justify-center" style={{ height: '500px' }}>
        <div className="flex items-center gap-2 text-blue-400">
          <FaSpinner className="animate-spin text-2xl" />
          <span>Cargando datos de uso...</span>
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
          Uso de bicicletas (Últimas 24h)
        </h3>
      </div>

      <div style={{ height: "400px" }}>
        <LineChart
          xAxis={[{
data: hours,
            label: "Hora del día",
            tickInterval: (value: number, index: number) => index % 2 === 0,
            valueFormatter: (value: string) => {
              // Value is already in 'HH:00' format from the API
              return value;
            },
            scaleType: "point",
            labelStyle: { fill: "#ffffff", fontSize: 12 },
            tickLabelStyle: { fill: "#ffffff", fontSize: 11 }
          }]}
          yAxis={[{
            label: "Bicicletas en uso",
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
