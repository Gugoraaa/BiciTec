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
import toast from "react-hot-toast";


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
  const tR = useTranslations("ReportModal");
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
        toast.error(tR('toast.loginRequired'));
        return false;
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const { data } = await api.get('/auth/me');
      
      if (!data?.user) {
        toast.error(tR('toast.loginRequired'));
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
     toast.error("Error al enviar el reporte");
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
      <div className="max-w-6xl mx-auto p-3 sm:p-4 md:p-6">
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="w-full sm:w-auto">
              <h1 className={`text-2xl sm:text-3xl font-bold text-white transition-all duration-700 mb-1 sm:mb-2 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
              }`}>
                {t("title")}
              </h1>
              <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 text-sm sm:text-base ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <FaExclamationTriangle className="text-sm sm:text-base" />
                <span className="whitespace-nowrap">{t("report")}</span>
              </button>
              {isAdmin && (
                <button
                  onClick={() => setIsAddBikeModalOpen(true)}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 text-sm sm:text-base ${
                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <FaPlus className="text-sm sm:text-base" />
                  <span className="whitespace-nowrap">{t("addBike")}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
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
              className={`w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base ${
                isLoaded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-8"
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div
            className={`flex flex-wrap gap-2 sm:gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-2 sm:p-3 transition-all duration-700 delay-100 ${
              isLoaded
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            {(["All", "Available", "InUse", "Maintenance"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s as BikeStatus | "All")}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full transition-all whitespace-nowrap ${
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
            <div className="mt-2 grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
