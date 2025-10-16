import type { BikeStation } from "@/types/bike";
import type * as LeafletTypes from "leaflet";

export const bikeIcon = (
  L: typeof LeafletTypes,
  stations: BikeStation[],
  stationId: number,
  isVisible: boolean,
  isOnline: boolean
) => {
  const station = stations.find(s => s.id === stationId);
  const isAvailable = station ? station.bicicletas > 0 : false;
  const fillPercentage = station ? (station.bicicletas / station.capacidad_max) * 100 : 0;
  const isOffline = station ? station.estado?.toLowerCase() === 'offline' || !isOnline : true;

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
          background: ${isOffline ? "rgba(75, 85, 99, 0.2)" : isAvailable ? "rgba(59, 130, 246, 0.2)" : "rgba(107, 114, 128, 0.2)"};
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        "></div>
        <div style="
          position: absolute;
          inset: 5px;
          background: ${isOffline ? "linear-gradient(135deg, #6b7280, #4b5563)" : isAvailable ? "linear-gradient(135deg, #3b82f6, #1d4ed8)" : "linear-gradient(135deg, #6b7280, #4b5563)"};
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
        ${!isOffline && isAvailable ? `
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