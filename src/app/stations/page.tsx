import BikeMap from "@/components/bikes/BikeMap";
import StationTable from "@/components/stations/StationTable";
import { useTranslations } from "next-intl";

export default function stations() {
  const t = useTranslations("StationTable");
  return (
    <main className="min-h-screen bg-[#0f172a] p-4 md:p-6">
      <h1 className="text-2xl font-bold text-white mb-4">{t("title")}</h1>
      <section className="flex gap-4">
        <BikeMap />
        <StationTable />
      </section>
    </main>
  );
}
