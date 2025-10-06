import BikeMap from "@/components/BikeMap";
import StationTable, { StationRow } from "@/components/StationTable";

const rows: StationRow[] = [
  {
    id: "A",
    station: "Station A",
    location: "Central Plaza",
    capacity: 20,
    docked: 15,
    available: 5,
    status: "Operational",
  },
  {
    id: "B",
    station: "Station B",
    location: "Library",
    capacity: 15,
    docked: 10,
    available: 5,
    status: "Operational",
  },
  {
    id: "C",
    station: "Station C",
    location: "Student Union",
    capacity: 25,
    docked: 20,
    available: 5,
    status: "Operational",
  },
  {
    id: "D",
    station: "Station D",
    location: "Engineering",
    capacity: 10,
    docked: 8,
    available: 2,
    status: "Maintenance",
  },
  {
    id: "E",
    station: "Station E",
    location: "Science Building",
    capacity: 18,
    docked: 12,
    available: 6,
    status: "Operational",
  },
  {
    id: "F",
    station: "Station F",
    location: "Arts Building",
    capacity: 12,
    docked: 10,
    available: 2,
    status: "Offline",
  },
];

export default function stations() {
  return (
    <main className="min-h-screen bg-[#0f172a] p-4 md:p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Stations</h1>
      <section className="flex gap-4">
        <BikeMap />
        <StationTable data={rows} />
      </section>
    </main>
  );
}
