
type Priority = "High" | "Medium" | "Low";
export type Status = "Open" | "In Progress" | "Done";

export interface Ticket {
  id: number;
  bike: string;
  title: string;
  date: string;
  priority: Priority;
  status: Status;
}