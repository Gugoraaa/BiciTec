"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import BikeCard from "@/components/BikeCard";
import ReportModal from "@/components/bikes/ReportModal";
import BikeTripsModal from "@/components/bikes/BikeTripsModal";
import { FaExclamationTriangle } from "react-icons/fa";
import { Bike, BikeStatus } from "@/types/bike";

type Trip = {
  id: string;
  startTime: string;
  endTime: string;
  duration: string;
  distance: number;
  userId: string;
  userName: string;
  startStation: string;
  endStation: string;
  status: string;
};

// Mock data for bike trips
const mockTrips: Record<string, Trip[]> = {
  "Bike 123": [
    {
      id: "TRIP-001",
      startTime: "2023-10-01T08:00:00Z",
      endTime: "2023-10-01T08:30:00Z",
      duration: "30 min",
      distance: 5.2,
      userId: "USER-001",
      userName: "Juan Pérez",
      startStation: "Central",
      endStation: "Library",
      status: "completed"
    },
    {
      id: "TRIP-002",
      startTime: "2023-10-02T14:15:00Z",
      endTime: "2023-10-02T14:45:00Z",
      duration: "30 min",
      distance: 4.8,
      userId: "USER-002",
      userName: "María García",
      startStation: "Library",
      endStation: "Engineering",
      status: "completed"
    }
  ],
  "Bike 087": [
    {
      id: "TRIP-003",
      startTime: "2023-10-03T10:00:00Z",
      endTime: "2023-10-03T10:45:00Z",
      duration: "45 min",
      distance: 7.3,
      userId: "USER-003",
      userName: "Carlos López",
      startStation: "Arts Building",
      endStation: "Dorms",
      status: "completed"
    }
  ]
};

export default function Bikes() {
  const bikes = useMemo<Bike[]>(() => [
    { id: "Bike 123", lastSeen: "2 hours ago", estacion: "Central", velocidad_prom: 15, total_km: 2345, estado: "Available" },
    { id: "Bike 087", lastSeen: "10 minutes ago", estacion: "Library", velocidad_prom: 12, total_km: 1780, estado: "InUse" },
    { id: "Bike 214", lastSeen: "1 day ago", estacion: "Engineering", velocidad_prom: 9, total_km: 4012, estado: "Maintenance" },
    { id: "Bike 376", lastSeen: "30 minutes ago", estacion: "Arts Building", velocidad_prom: 11, total_km: 2230, estado: "Available" },
    { id: "Bike 512", lastSeen: "3 days ago", estacion: "Dorms", velocidad_prom: 0, total_km: 5034, estado: "Maintenance" },
  ], []);
  
  const [selectedBikeId, setSelectedBikeId] = useState<string | null>(null);
  const [isTripsModalOpen, setIsTripsModalOpen] = useState(false);
  const [bikeTrips, setBikeTrips] = useState<Trip[]>([]);
  
  const [filter, setFilter] = useState<"All" | BikeStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleCards, setVisibleCards] = useState<string[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  // Efecto para la animación de carga inicial
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    const timeouts = bikes.map((bike, index) => {
      return setTimeout(() => {
        setVisibleCards(prev => [...prev, bike.id]);
      }, 200 + index * 80);
    });

    // Limpiar timeouts
    return () => {
      clearTimeout(timer);
      timeouts.forEach(clearTimeout);
    };
  }, [bikes]);

  // Efecto para filtrar bicicletas
  useEffect(() => {
    setVisibleCards([]);
    const filtered = filter === "All" ? bikes : bikes.filter((b) => b.estado === filter);
    // Get bike IDs for filtered bikes
    const bikeIds = filtered.map(bike => bike.id);
    console.log('Filtered bike IDs:', bikeIds);
    
    const timeouts = filtered.map((bike, index) => {
      return setTimeout(() => {
        setVisibleCards(prev => {
          // Prevent duplicate bike IDs
          if (!prev.includes(bike.id)) {
            return [...prev, bike.id];
          }
          return prev;
        });
      }, index * 80);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [filter, bikes]);

  const filteredBikes = useMemo(() => {
    return bikes.filter(bike => {
      const matchesSearch = bike.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === "All" || bike.estado === filter;
      return matchesSearch && matchesFilter;
    });
  }, [bikes, filter, searchQuery]);

  const statusColors: Record<string, string> = {
    All: "bg-slate-700/40 text-slate-300 border border-slate-600",
    Available: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    "In Use": "bg-blue-500/10 text-blue-400 border border-blue-500/30",
    Maintenance: "bg-amber-500/10 text-amber-400 border border-amber-500/30"
  };

  const handleReportSubmit = (bikeId: string, description: string) => {
    // Here you would typically make an API call to submit the report
    console.log(`Report submitted for ${bikeId}: ${description}`);
    // You can add a toast notification here
  };

  const handleViewTrips = (bikeId: string) => {
    setSelectedBikeId(bikeId);
    // In a real app, you would fetch the trips for this bike from an API
    setBikeTrips(mockTrips[bikeId] || []);
    setIsTripsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 
            className={`text-2xl font-bold transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            Bikes
          </h1>
          <button
            onClick={() => setIsReportModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <FaExclamationTriangle />
            <span>Report Issue</span>
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search bikes..."
              className={`w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div 
            className={`flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 transition-all duration-700 delay-100 ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            {(['All', 'Available', 'InUse', 'Maintenance'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${
                  filter === s
                    ? statusColors[s]
                    : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-700/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        {filteredBikes.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            No bikes found matching your search.
          </div>
        ) : (
          <div className="mt-2 grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
            {filteredBikes.map((bike) => {
              const isVisible = visibleCards.includes(bike.id);
              return (
                <div
                  key={bike.id}
                  className={`transition-all duration-500 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                >
                  <BikeCard 
                    {...bike} 
                    onViewTrips={handleViewTrips}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        bikes={bikes}
        onSubmit={handleReportSubmit}
      />

      <BikeTripsModal
        isOpen={isTripsModalOpen}
        onClose={() => setIsTripsModalOpen(false)}
        bikeId={selectedBikeId || ''}
        trips={bikeTrips}
      />
    </main>
  );
}