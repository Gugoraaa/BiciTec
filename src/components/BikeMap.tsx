"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import api from "@/lib/api";
import type { LatLngExpression } from "leaflet";
import type * as LeafletTypes from "leaflet";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const ScaleControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.ScaleControl),
  { ssr: false }
);

const center: LatLngExpression = [25.6515, -100.2905];

interface BikeStation {
  id: number;
  position: LatLngExpression;
  nombre: string;
  bicicletas: number;
  capacity: number;
}

const createBikeIcon = (
  L: typeof LeafletTypes,
  stations: BikeStation[],
  stationId: number,
  isVisible: boolean
) => {
  const station = stations.find(s => s.id === stationId);
  const isAvailable = station ? station.bicicletas > 0 : false;
  const fillPercentage = station ? (station.bicicletas / station.capacity) * 100 : 0;

  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: 40px;
        height: 40px;
        transform: scale(${isVisible ? 1 : 0});
        transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      ">
        <div style="
          position: absolute;
          inset: 0;
          background: ${isAvailable ? "rgba(59, 130, 246, 0.2)" : "rgba(107, 114, 128, 0.2)"};
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        "></div>
        <div style="
          position: absolute;
          inset: 5px;
          background: ${isAvailable ? "linear-gradient(135deg, #3b82f6, #1d4ed8)" : "linear-gradient(135deg, #6b7280, #4b5563)"};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.2);
          overflow: hidden;
        ">
          <div style="
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: ${fillPercentage}%;
            background: rgba(255, 255, 255, 0.15);
            transition: height 0.3s ease;
          "></div>
          <span style="position: relative; z-index: 1;">${stationId}</span>
        </div>
        ${isAvailable ? `
          <div style="
            position: absolute;
            top: -2px;
            right: -2px;
            width: 12px;
            height: 12px;
            background: #10b981;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
            animation: blink 1.5s ease-in-out infinite;
          "></div>
        ` : ''}
      </div>
      <style>
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      </style>
    `,
    className: "bike-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -15],
  });
};

export default function BikeMap() {
  const [mounted, setMounted] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [L, setL] = useState<typeof LeafletTypes | null>(null);
  const [bikeStations, setBikeStations] = useState<BikeStation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [visibleMarkers, setVisibleMarkers] = useState<number[]>([]);

  
  useEffect(() => {
    let isMounted = true;
    
    const fetchStations = async () => {
      setError(null);
      try {
        const response = await api.get<Array<{
          id: number;
          nombre: string;
          latitud: string;
          longitud: string;
          bicicletas: number;
          capacidad: number;
        }>>("/stations/getStations");
        
        if (!isMounted) return;
        
        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          // Transformar datos de la API al formato que espera el componente
          const transformedStations = response.data.map((station) => ({
            id: station.id,
            position: [parseFloat(station.latitud), parseFloat(station.longitud)] as [number, number],
            nombre: station.nombre,
            bicicletas: station.bicicletas,
            capacity: station.capacidad,
          }));
          
          // Eliminar duplicados basados en ID
          const uniqueStations = Array.from(
            new Map(transformedStations.map(item => [item.id, item])).values()
          );
          
          setBikeStations(uniqueStations);
        } else {
          setError("No se encontraron estaciones disponibles.");
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Error al cargar estaciones:", err);
        setError(
          "Error al conectar con el servidor. Por favor, intenta de nuevo más tarde."
        );
      } finally {
      }
    };

    void fetchStations();
    
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    
    if (typeof window !== "undefined") {
      import("leaflet").then((leafletModule) => {
        const LeafletLib = leafletModule.default;

        
        const DefaultIcon = LeafletLib.icon({
          iconUrl: "/marker-icon.png",
          iconRetinaUrl: "/marker-icon-2x.png",
          shadowUrl: "/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        LeafletLib.Marker.prototype.options.icon = DefaultIcon;
        setL(LeafletLib);
        setMounted(true);
      });
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    
    const duration = 1500;
    let start: number | null = null;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      setLoadProgress(eased * 100);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setTimeout(() => setMapReady(true), 200);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [mounted]);

  useEffect(() => {
    if (!mapReady || bikeStations.length === 0) return;

    
    bikeStations.forEach((_, index) => {
      setTimeout(() => {
        setVisibleMarkers((prev) => [...prev, index]);
      }, index * 40);
    });
  }, [mapReady, bikeStations]);

  if (!mounted || !mapReady || !L) {
    return (
      <div className="h-[600px] w-full rounded-lg overflow-hidden border-2 border-gray-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="text-center z-10 space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
            <div
              className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"
              style={{ animationDuration: "1s" }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-blue-400 font-bold text-sm">
                {Math.round(loadProgress)}%
              </span>
            </div>
          </div>
          <div className="text-white font-semibold">Cargando mapa...</div>
          <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 relative overflow-hidden"
              style={{ width: `${loadProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(200%);
            }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
        `}</style>
      </div>
    );
  }

  
  if (error || bikeStations.length === 0) {
    return (
      <div className="h-[600px] w-full rounded-lg overflow-hidden border-2 border-red-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]"></div>
        <div className="text-center z-10 space-y-6 px-6 max-w-md">
          <div className="text-red-500 text-6xl">⚠️</div>
          <div>
            <h3 className="text-white text-2xl font-bold mb-2">
              Error al cargar el mapa
            </h3>
            <p className="text-gray-300 text-lg">
              {error || "No se encontraron estaciones disponibles."}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden border-2 border-gray-700 shadow-2xl relative animate-fadeIn">
      <MapContainer
        center={center}
        zoom={17}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        maxZoom={50}
        minZoom={14}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={50}
        />

        {bikeStations.map((station, index) => (
          <Marker 
            key={station.id} 
            position={station.position}
            icon={createBikeIcon(L, bikeStations, station.id, visibleMarkers.includes(index))}
          >
            <Popup className="font-sans min-w-[220px]">
              <div className="space-y-2 p-1">
                <h3 className="font-bold text-lg text-gray-800 border-b pb-2">
                  {station.nombre}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Bicicletas:</span>
                  <span className="font-bold text-blue-600 text-lg">
                    {station.bicicletas} / {station.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden shadow-inner">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 relative overflow-hidden"
                    style={{
                      width: `${(station.bicicletas / station.capacity) * 100}%`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-500">ID: {station.id}</span>
                  <span
                    className={`font-semibold ${
                      station.bicicletas > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {station.bicicletas > 0 ? "✓ Disponible" : "✗ Sin bicicletas"}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <ScaleControl position="bottomleft" />
      </MapContainer>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
