
type Priority = "High" | "Medium" | "Low";
export type Status = "Open" | "InProgress" | "Done";

export interface Ticket {
  id: number;
  bike: string;
  description: string;
  date: string;
  priority: Priority;
  status: Status;
}