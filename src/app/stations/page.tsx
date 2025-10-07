import BikeMap from "@/components/BikeMap";
import StationTable from "@/components/StationTable";

export default function stations() {
  return (
    <main className="min-h-screen bg-[#0f172a] p-4 md:p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Stations</h1>
      <section className="flex gap-4">
        <BikeMap />
        <StationTable />
      </section>
    </main>
  );
}
