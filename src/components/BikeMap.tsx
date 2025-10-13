"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import api from "@/lib/api";
import type { LatLngExpression } from "leaflet";
import type * as LeafletTypes from "leaflet";
import "leaflet/dist/leaflet.css";
import {BikeStation} from "@/types/bike";
import {bikeIcon} from "./BikeIcon";

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





export default function BikeMap() {
  const [mounted, setMounted] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [L, setL] = useState<typeof LeafletTypes | null>(null);
  const [bikeStations, setBikeStations] = useState<BikeStation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [visibleMarkers, setVisibleMarkers] = useState<number[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  
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
          capacidad_max: number;  
          estado: string;
        }>>("/stations/getStations");
        
        if (!isMounted) return;
        
        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const transformedStations = response.data.map((station) => ({
            id: station.id,
            position: [parseFloat(station.latitud), parseFloat(station.longitud)] as [number, number],
            nombre: station.nombre,
            bicicletas: station.bicicletas,
            capacidad_max: station.capacidad_max,
            estado: station.estado,
          }));
          
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
    <>
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

          {bikeStations.map((station, index) => {
            const stationIsOffline = station.estado?.toLowerCase() === 'offline' || !isOnline;
            
            return (
              <Marker 
                key={station.id} 
                position={station.position}
                icon={bikeIcon(L, bikeStations, station.id, visibleMarkers.includes(index), isOnline)}
              >
                <Popup className="font-sans min-w-[220px]">
                  <div className="space-y-2">
                    {stationIsOffline ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Bicicletas:</span>
                          <span className="font-bold text-gray-600 text-lg">
                            0 / {station.capacidad_max}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden shadow-inner">
                          <div className="h-3 rounded-full bg-gray-400"></div>
                        </div>
                        <div className="pt-2 flex items-center justify-between text-sm">
                          <span className="text-gray-500">ID: {station.id}</span>
                          <span className="font-semibold text-gray-600">
                            🔴 Sin conexión
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Bicicletas:</span>
                          <span className="font-bold text-blue-600 text-lg">
                            {station.bicicletas} / {station.capacidad_max}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden shadow-inner">
                          <div
                            className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 relative overflow-hidden"
                            style={{
                              width: `${(station.bicicletas / station.capacidad_max) * 100}%`,
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
                      </>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
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
    </>
  );
}