export type BikeStatus = "Available" | "InUse" | "Maintenance";
import type { LatLngExpression } from "leaflet";

export interface Bike {
  id: string;
  lastSeen: string;
  estacion: string;
  vel_prom: number;
  total_km: number;
  estado: BikeStatus;
}

export interface Trip {
  id: string;
  fecha: string;
  tiempo: string;
  distancia: number;
  userId: string;
  usuario: string;
  startStation: string;
  endStation: string;
  status: string;
  viaje_seguro: boolean;
}

export interface BikeStation {
  id: number;
  position: LatLngExpression;
  nombre: string;
  bicicletas: number;
  capacidad_max: number;
  estado: string;
}

export interface BikeUsageData {
  hour: string;
  count: number;
}
