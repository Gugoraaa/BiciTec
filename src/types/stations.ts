export type Status = "Operational" | "Maintenance" | "Offline";

export interface StationRow {
  id: string;
  nombre: string;
  capacidad_max: number;
  bicicletas: number;
  available: number;
  estado: Status;
}