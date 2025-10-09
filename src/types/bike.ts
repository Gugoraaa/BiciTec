export type BikeStatus = "Available" | "In Use" | "Maintenance";

export interface Bike {
  id: string;
  lastSeen: string;
  station: string;
  avgSpeed: number;
  totalKm: number;
  status: BikeStatus;
}
