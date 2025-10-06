"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ScaleControl,
} from "react-leaflet";
import type { LatLngExpression, IconOptions } from "leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
const DefaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Campus center coordinates (Tec de Monterrey Campus Monterrey)
const center: LatLngExpression = [25.6515, -100.2905];



interface BikeStation {
  id: number;
  position: LatLngExpression;
  name: string;
  bikes: number;
  capacity: number;
}

// Multiple bike stations around campus
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
    id:7  ,
    position: [25.65116537272076, -100.28759309989297],
    name: "Estación 5 - CETEC",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 8,
    position: [25.6514579343149, -100.28813758829149],
    name: "Estación 5 - CETEC",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 9,
    position: [25.651741642077706, -100.28854610738213],
    name: "Estación 5 - CETEC",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 10,
    position: [25.651238727032045, -100.28867619451184],
    name: "Estación 5 - CETEC",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 11,
    position: [25.65114443022557, -100.28909864242047],
    name: "Estación 5 - CETEC",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 12,
    position: [25.651714784139234, -100.28911485716232],
    name: "Estación 5 - CETEC",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 13,
    position: [25.651894914293486, -100.28901159212123],
    name: "Estación 5 - CETEC",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 14,
    position: [25.651832050109462, -100.2896043602792],
    name: "Estación 5 - CETEC",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 15  ,
    position: [25.652488495634742, -100.28905718967019],
    name: "Estación 5 - CETEC",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 16,
    position: [25.652732697286282, -100.28995572965026],
    name: "Estación 5 - CETEC",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 17,
    position: [25.651842930461008, -100.29030441682718],
    name: "Estación 5 - CETEC",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 18,
    position: [25.652181429491524, -100.29087840952313],
    name: "Estación 5 - CETEC",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 19,
    position: [25.65125055483213, -100.29165893233943],
    name: "Estación 5 - CETEC",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 20,
    position: [25.650834681213134, -100.29049753590529],
    name: "Estación 5 - CETEC",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 21  ,
    position: [25.650618281279918, -100.28992086097858],
    name: "Estación 5 - CETEC",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 22,
    position: [25.65051673034114, -100.28940587687754],
    name: "Estación 5 - CETEC",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 23,
    position: [25.65004766059756, -100.29010861559875],
    name: "Estación 5 - CETEC",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 24,
    position: [25.65025801684466, -100.29053508680744],
    name: "Estación 5 - CETEC",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 25,
    position: [25.65029670301063, -100.29082074205097],
    name: "Estación 5 - CETEC",
    bikes: 4,
    capacity: 8,
  },
  {
    id: 26,
    position: [25.649859440113563, -100.29080354957794],
    name: "Estación 5 - CETEC",
    bikes: 4,
    capacity: 8,
  },
];

// Create custom numbered markers
const createBikeIcon = (number: number) => {
  const isAvailable = bikeStations[number - 1]?.bikes > 0;

  return L.divIcon({
    html: `
      <div style="
        background: ${isAvailable ? "#3b82f6" : "#6b7280"};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        border: 2px solid white;
        box-shadow: 0 0 5px rgba(0,0,0,0.5);
      ">
        ${number}
      </div>
    `,
    className: "bike-marker",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -10],
  });
};

export default function BikeMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
  }

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden border-2 border-gray-700">
      {mounted && (
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

          {/* Bike stations */}
          {bikeStations.map((station) => (
            <Marker
              key={station.id}
              position={station.position}
              icon={createBikeIcon(station.id)}
            >
              <Popup className="font-sans min-w-[200px]">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">{station.name}</h3>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bicicletas:</span>
                    <span className="font-medium">
                      {station.bikes} / {station.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${(station.bikes / station.capacity) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="pt-2 text-sm text-gray-500">
                    ID: {station.id} •{" "}
                    {station.bikes > 0 ? "Disponible" : "Sin bicicletas"}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Add scale control */}
          <ScaleControl position="bottomleft" />
        </MapContainer>
      )}
    </div>
  );
}
