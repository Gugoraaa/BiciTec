"use client";
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import BikeMap from "@/components/stations/BikeMap";
import StationTable from "@/components/stations/StationTable";
import ManageStationsModal from "@/components/stations/ManageStationsModal";

export default function StationsPage() {
  const { isAdmin } = useAuth();
  const [isStationsModalOpen, setIsStationsModalOpen] = useState(false);
  const t = useTranslations("StationTable");

  return (
    <main className="min-h-screen bg-[#0f172a] p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
            {t("title")}
          </h1>
          <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
        </div>
        {isAdmin && (
          <div className="w-full sm:w-auto">
            <button
              onClick={() => setIsStationsModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 text-sm sm:text-base"
            >
              <span>{t("ManageStationButton")}</span>
            </button>
          </div>
        )}
      </div>

      <section className="flex flex-col lg:flex-row gap-4 mt-4 sm:mt-6">
        <div className="w-full lg:w-2/3">
          <BikeMap />
        </div>
        <div className="w-full lg:w-1/3">
          <StationTable />
        </div>
      </section>

      <ManageStationsModal
        isOpen={isStationsModalOpen}
        onClose={() => setIsStationsModalOpen(false)}
      />
    </main>
  );
}
