export type BikeStatus = "Available" | "InUse" | "Maintenance";

export interface Bike {
  id: string;
  lastSeen: string;
  estacion: string;
  velocidad_prom: number;
  total_km: number;
  estado: BikeStatus;
}
