'use client'
'use client';

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

  // TODO: Fetch stations from your API
  // useEffect(() => {
  //   const fetchStations = async () => {
  //     const response = await fetch('/api/stations');
  //     const data = await response.json();
  //     setStations(data);
  //   };
  //   fetchStations();
  // }, []);

  const handleStatusUpdate = async (stationId: string, newStatus: 'Operational' | 'Offline' ) => {
    try {
      // TODO: Update station status via API
      // await fetch(`/api/stations/${stationId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus }),
      // });
      
      // Update local state
      // setStations(stations.map(station => 
      //   station.id === stationId ? { ...station, status: newStatus } : station
      // ));
    } catch (error) {
      console.error('Failed to update station status:', error);
      // TODO: Show error notification
    }
  };
  return (
    <main className="min-h-screen bg-[#0f172a] p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
        {isAdmin && (
          <button
            onClick={() => setIsStationsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
          >
            <span>{t("ManageStationButton")}</span>
          </button>
        )}
      </div>
      
      <section className="flex gap-4">
        <BikeMap />
        <StationTable  />
      </section>

      <ManageStationsModal
        isOpen={isStationsModalOpen}
        onClose={() => setIsStationsModalOpen(false)}
        onSave={handleStatusUpdate}
        

      />
    </main>
  );
}
