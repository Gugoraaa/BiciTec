"use client";
import { useState, useEffect, useMemo } from "react";
import BikeCard from "@/components/BikeCard";
import ReportModal from "@/components/bikes/ReportModal";
import { FaPlus, FaExclamationTriangle } from "react-icons/fa";

export default function Bikes() {
  const bikes = useMemo<Bike[]>(() => [
    { id: "Bike 123", lastSeen: "2 hours ago", station: "Central", avgSpeed: 15, totalKm: 2345, health: 95, status: "Available" },
    { id: "Bike 087", lastSeen: "10 minutes ago", station: "Library", avgSpeed: 12, totalKm: 1780, health: 82, status: "In Use" },
    { id: "Bike 041", lastSeen: "5 hours ago", station: "Science Building", avgSpeed: 14, totalKm: 3560, health: 68, status: "Available" },
    { id: "Bike 214", lastSeen: "1 day ago", station: "Engineering", avgSpeed: 9, totalKm: 4012, health: 45, status: "Maintenance" },
    { id: "Bike 376", lastSeen: "30 minutes ago", station: "Arts Building", avgSpeed: 11, totalKm: 2230, health: 89, status: "Available" },
    { id: "Bike 512", lastSeen: "3 days ago", station: "Dorms", avgSpeed: 0, totalKm: 5034, health: 52, status: "Maintenance" },
  ], []);

  const [filter, setFilter] = useState<"All" | BikeStatus>("All");
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleCards, setVisibleCards] = useState<string[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const isInitialMount = useRef(true);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    const timeouts = bikes.map((bike, index) => {
      return setTimeout(() => {
        setVisibleCards(prev => [...prev, bike.id]);
      }, 200 + index * 80);
    });

    return () => {
      clearTimeout(timer);
      timeouts.forEach(clearTimeout);
    };
  }, [bikes]);

  useEffect(() => {
    setVisibleCards([]);
    const filtered = filter === "All" ? bikes : bikes.filter((b) => b.status === filter);
    const bikeIds = filtered.map(bike => bike.id);
    
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

  const filteredBikes =
    filter === "All" ? bikes : bikes.filter((b) => b.status === filter);

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

        <div 
          className={`flex items-center gap-3 mb-6 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 transition-all duration-700 delay-100 ${
            isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}
        >
          {(["All", "Available", "In Use", "Maintenance"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${
                filter === s
                  ? `${statusColors[s]} ring-1 ring-offset-0`
                  : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-700/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

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
                <BikeCard {...bike} />
              </div>
            );
          })}
        </div>
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        bikes={bikes}
        onSubmit={handleReportSubmit}
      />
    </main>
  );
}