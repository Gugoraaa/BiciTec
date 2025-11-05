"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/overview/StatCard";
import StationCapacityCard from "@/components/overview/StationCapacityCard";
import LiveUtilizationChart from "@/components/overview/LiveUtilizationChart";
import { FaSpinner } from "react-icons/fa";
import api from "@/lib/api";
import { useTranslations } from "next-intl";

interface OverviewData {
  totalBikes: number;
  Available: number;
  InUse: number;
  InMaintenance: number;
  activeStation: number;
}

export default function Overview() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("Overview");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/overview/cardsOverview");
        setOverview(response.data);
      } catch (err) {
        console.error("Error fetching overview data:", err);
        setError("Failed to load overview data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex items-center gap-2 text-blue-400">
          <FaSpinner className="animate-spin text-2xl" />
          <span>{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }
  return (
    <main className="min-h-screen bg-[#0f172a] p-3 sm:p-4 md:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
          {t("title")}
        </h1>
        <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 my-3 sm:my-4">
        {[
          {
            title: t("totalBikes"),
            value: overview?.totalBikes || 0,
            color: "text-white",
          },
          {
            title: t("available"),
            value: overview?.Available || 0,
            color: "text-emerald-400",
          },
          {
            title: t("inUse"),
            value: overview?.InUse || 0,
            color: "text-yellow-400",
          },
          {
            title: t("inMaintenance"),
            value: overview?.InMaintenance || 0,
            color: "text-orange-400",
          },
          {
            title: t("activeStations"),
            value: overview?.activeStation || 0,
            color: "text-cyan-400",
          },
        ].map((stat, index) => (
          <div key={index} className="w-full h-full">
            <StatCard
              title={stat.title}
              value={stat.value}
              color={stat.color}
            />
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4 sm:mt-6">
        <div className="lg:col-span-8">
          <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-0 overflow-hidden border border-slate-700/50">
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
