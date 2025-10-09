export type BikeStatus = "Available" | "InUse" | "Maintenance";

export interface Bike {
  id: string;
  lastSeen: string;
  estacion: string;
  vel_prom: number;
  total_km: number;
  estado: BikeStatus;
}


export interface Trip  {
  id: string;
  fecha: string;
  tiempo: string;
  distancia: number;
  userId: string;
  usuario: string;
  startStation: string;
  endStation: string;
  status: string;
};