"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

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

import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

const center: LatLngExpression = [25.6515, -100.2905];

interface BikeStation {
  id: number;
  position: LatLngExpression;
  name: string;
  bikes: number;
  capacity: number;
}

const bikeStations: BikeStation[] = [
  {
    id: 1,
    position: [25.65031647685729, -100.2885139793042],
    name: "Estación 1 - Rectoría",
    bikes: 5,
    capacity: 10,
  },
  {
    id: 2,
    position: [25.65025844761321, -100.28832622468403],
    name: "Estación 2 - Biblioteca",
    bikes: 3,
    capacity: 8,
  },
  {
    id: 3,
    position: [25.648787759533555, -100.28930992479417],
    name: "Estación 3 - Aulas 1",
    bikes: 7,
    capacity: 12,
  },
  {
    id: 4,
    position: [25.649614683789466, -100.28943598861056],
    name: "Estación 4 - Estadio",
    bikes: 2,
    capacity: 6,
  },
  {
    id: 6,
    position: [25.65012062805281, -100.28936423953428],
    name: "Estación 5 - CETEC",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 7,
    position: [25.65116537272076, -100.28759309989297],
    name: "Estación 6 - Centro",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 8,
    position: [25.6514579343149, -100.28813758829149],
    name: "Estación 7 - Plaza",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 9,
    position: [25.651741642077706, -100.28854610738213],
    name: "Estación 8 - Norte",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 10,
    position: [25.651238727032045, -100.28867619451184],
    name: "Estación 9 - Este",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 11,
    position: [25.65114443022557, -100.28909864242047],
    name: "Estación 10 - Sur",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 12,
    position: [25.651714784139234, -100.28911485716232],
    name: "Estación 11 - Oeste",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 13,
    position: [25.651894914293486, -100.28901159212123],
    name: "Estación 12 - Lab",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 14,
    position: [25.651832050109462, -100.2896043602792],
    name: "Estación 13 - Gym",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 15,
    position: [25.652488495634742, -100.28905718967019],
    name: "Estación 14 - Pool",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 16,
    position: [25.652732697286282, -100.28995572965026],
    name: "Estación 15 - Parking",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 17,
    position: [25.651842930461008, -100.29030441682718],
    name: "Estación 16 - Admin",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 18,
    position: [25.652181429491524, -100.29087840952313],
    name: "Estación 17 - Cafeteria",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 19,
    position: [25.65125055483213, -100.29165893233943],
    name: "Estación 18 - Dorms",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 20,
    position: [25.650834681213134, -100.29049753590529],
    name: "Estación 19 - Arts",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 21,
    position: [25.650618281279918, -100.28992086097858],
    name: "Estación 20 - Music",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 22,
    position: [25.65051673034114, -100.28940587687754],
    name: "Estación 21 - Theater",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 23,
    position: [25.65004766059756, -100.29010861559875],
    name: "Estación 22 - Science",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 24,
    position: [25.65025801684466, -100.29053508680744],
    name: "Estación 23 - Engineering",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 25,
    position: [25.65029670301063, -100.29082074205097],
    name: "Estación 24 - Business",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 26,
    position: [25.649859440113563, -100.29080354957794],
    name: "Estación 25 - Medicine",
    bikes: 4,
    capacity: 8,
  },
];

const createBikeIcon = (L: any, number: number, isVisible: boolean) => {
  const station = bikeStations[number - 1];
  const isAvailable = station?.bikes > 0;
  const fillPercentage = station ? (station.bikes / station.capacity) * 100 : 0;

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
          <span style="position: relative; z-index: 1;">${number}</span>
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
  const [visibleMarkers, setVisibleMarkers] = useState<number[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Dynamically import Leaflet only on client side
    if (typeof window !== 'undefined') {
      import('leaflet').then((leafletModule) => {
        const LeafletLib = leafletModule.default;
        
        // Configure default icon
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
    
    // Animated loading progress
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
    if (!mapReady) return;

    // Stagger marker appearances
    bikeStations.forEach((_, index) => {
      setTimeout(() => {
        setVisibleMarkers(prev => [...prev, index]);
      }, index * 40);
    });
  }, [mapReady]);

  if (!mounted || !mapReady || !L) {
    return (
      <div className="h-[600px] w-full rounded-lg overflow-hidden border-2 border-gray-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="text-center z-10 space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
            <div 
              className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"
              style={{ animationDuration: '1s' }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-blue-400 font-bold text-sm">{Math.round(loadProgress)}%</span>
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
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
        `}</style>
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
            icon={createBikeIcon(L, station.id, visibleMarkers.includes(index))}
          >
            <Popup className="font-sans min-w-[220px]">
              <div className="space-y-2 p-1">
                <h3 className="font-bold text-lg text-gray-800 border-b pb-2">{station.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Bicicletas:</span>
                  <span className="font-bold text-blue-600 text-lg">
                    {station.bikes} / {station.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden shadow-inner">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 relative overflow-hidden"
                    style={{
                      width: `${(station.bikes / station.capacity) * 100}%`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-500">ID: {station.id}</span>
                  <span className={`font-semibold ${station.bikes > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {station.bikes > 0 ? '✓ Disponible' : '✗ Sin bicicletas'}
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
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}