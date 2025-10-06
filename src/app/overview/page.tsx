"use client";

import React from "react";
import StatCard from "@/components/StatCard"; // ajusta el path si es distinto
import StationCapacityCard from "@/components/StationCapacityCard";
import LiveUtilizationChart from "@/components/LiveUtilizationChart";


export default function overview() {
  return (
    <main className="min-h-screen bg-[#0f172a] p-4 md:p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Overview</h1>
      <section className="grid grid-cols-5 my-4">
        <div className="p-1">
          <StatCard title="Total Bikes" value={250} color="text-white" />
        </div>
        <div className="p-1">
          <StatCard title="Available" value={180} color="text-green-400" />
        </div>
        <div className="p-1">
          <StatCard title="In Use" value={50} color="text-yellow-400" />
        </div>
        <div className="p-1">
          <StatCard title="In Maintenance" value={20} color="text-yellow-400" />
        </div>
        <div className="p-1">
          <StatCard title="Active Stations" value={15} color="text-white" />
        </div>
      </section>

      {/* Main grid: Chart (8 cols) + Capacity (4 cols) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <div className="rounded-2xl bg-[#0b1425] p-0 overflow-hidden">
            <LiveUtilizationChart />
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="h-full">
            <StationCapacityCard />
          </div>
        </div>
      </section>
    </main>
  );
}
