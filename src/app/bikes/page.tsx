"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import BikeCard from "@/components/bikes/BikeCard";
import ReportModal from "@/components/bikes/ReportModal";
import BikeTripsModal from "@/components/bikes/BikeTripsModal";
import { FaPlus, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import { Bike, BikeStatus, Trip, BikeStation } from "@/types/bike";
import api from "@/lib/api";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import AddBikeModal from "@/components/bikes/AddBikeModal";

export default function Bikes() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [selectedBikeId, setSelectedBikeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<BikeStatus | "All">("All");
  const [isLoaded, setIsLoaded] = useState(false);
  const [bikeTrips, setBikeTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isTripsModalOpen, setIsTripsModalOpen] = useState(false);
  const [isAddBikeModalOpen, setIsAddBikeModalOpen] = useState(false);
  const [visibleCards, setVisibleCards] = useState<string[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);
  const [tripsError, setTripsError] = useState<string | null>(null);
  const [stations, setStations] = useState<BikeStation[]>([]);
  const selectedBike = useMemo(() => 
    selectedBikeId ? bikes.find(b => b.id === selectedBikeId) || null : null, 
    [selectedBikeId, bikes]
  );
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const t = useTranslations("BikesPage");
  const { isAdmin } = useAuth();

  const handleAddBike = async (bikeData: { station: number; size: string }) => {
    try {
      const response = await api.post('/bikes/addBike', {
        station: bikeData.station,
        size: bikeData.size,
      });
      setBikes(prevBikes => [...prevBikes, response.data]);
      setIsAddBikeModalOpen(false);
      window.location.reload(); 
    } catch (error) {
      console.error('Error adding bike:', error);
    }
  };

  const fetchStations = async () => {
    try {
      const response = await api.get('/stations/getStations');
      setStations(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/bikes/getBikes");
        setBikes(response.data);
      } catch (err) {
        console.error("Error fetching bikes:", err);
        setError("Failed to load bikes. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBikes();
  }, []);

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
        setVisibleCards((prev) => [...prev, bike.id]);
      }, 200 + index * 80);
    });

    return () => {
      clearTimeout(timer);
      timeouts.forEach(clearTimeout);
    };
  }, [bikes]);

  useEffect(() => {
    setVisibleCards([]);
    const filtered =
      filter === "All" ? bikes : bikes.filter((b) => b.estado === filter);
    const bikeIds = filtered.map((bike) => bike.id);
    console.log("Filtered bike IDs:", bikeIds);

    const timeouts = filtered.map((bike, index) => {
      return setTimeout(() => {
        setVisibleCards((prev) => {
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
    return bikes.filter((bike) => {
      const bikeId = String(bike.id || "");
      const matchesSearch = bikeId
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter = filter === "All" || bike.estado === filter;
      return matchesSearch && matchesFilter;
    });
  }, [bikes, filter, searchQuery]);

  const statusColors: Record<string, string> = {
    All: "bg-slate-700/40 text-slate-300 border border-slate-600",
    Available:
      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    "In Use": "bg-blue-500/10 text-blue-400 border border-blue-500/30",
    Maintenance: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
  };

  const handleReportSubmit = async (bikeId: string, description: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const { data } = await api.get('/auth/me');
      
      if (!data?.user) {
        return false;
      }

      const user = {
        id: data.user.id,
        matricula: data.user.matricula,
        nombre: data.user.nombre,
        apellido: data.user.apellido,
        role: data.user.rol
      };

      await api.post("/reports/createReport", {
        id_usuario: user.id,
        id_bici: parseInt(bikeId, 10),
        descripcion: description,
      });

      return true;
    } catch (error) {
      console.error("Error submitting report:", error);
      return false;
    }
  };

  const handleViewTrips = async (bikeId: string) => {
    try {
      setIsLoadingTrips(true);
      setTripsError(null);

      const response = await api.get(`/bikes/${bikeId}/logs`);
      setBikeTrips(response.data || []);
      setIsTripsModalOpen(true);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setTripsError(t("trips.error"));
    } finally {
      setIsLoadingTrips(false);
    }
  };

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
    <main className="min-h-screen bg-[#0f172a] text-white">
      <div className="max-w-6xl mx-auto p-6">
        

        <div className="flex justify-between items-center mb-6">
          <h1
            className={`text-2xl font-bold transition-all duration-700 ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
          >
            {t("title")}
          </h1>
          <button
            onClick={() => setIsReportModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <FaExclamationTriangle />
            <span>{t("report")}</span>
          </button>
          {isAdmin && (
          <button
            onClick={() => setIsAddBikeModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <FaPlus />
            <span>{t("addBike")}</span>
          </button>
        )}
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className={`w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                isLoaded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-8"
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div
            className={`flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 transition-all duration-700 delay-100 ${
              isLoaded
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            {(["All", "Available", "InUse", "Maintenance"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s as BikeStatus | "All")}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${
                  filter === s
                    ? statusColors[s as keyof typeof statusColors] ||
                      "bg-slate-700/50"
                    : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-700/50"
                }`}
              >
                {s === "All" ? t("filters.All") : t(`filters.${s}`)}
              </button>
            ))}
          </div>
          {filteredBikes.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              {t("noResults")}
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
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
                  >
                    <BikeCard {...bike} onViewTrips={handleViewTrips} />
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

      <AddBikeModal
        isOpen={isAddBikeModalOpen}
        onClose={() => setIsAddBikeModalOpen(false)}
        onAddBike={handleAddBike}
        stations={stations}
      />
      <BikeTripsModal
        isOpen={isTripsModalOpen}
        onClose={() => setIsTripsModalOpen(false)}
        bikeId={selectedBikeId || ""}
        trips={bikeTrips}
      />
    </main>
  );
}
