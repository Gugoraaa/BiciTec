"use client";

import { Bike } from "@/types/bike";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";

type BikeCardProps = Bike & {
  onViewTrips?: (bikeId: string) => void;
};

export default function BikeCard({
  id,
  estacion,
  vel_prom,
  total_km,
  estado,
  onViewTrips
}: BikeCardProps) {
  const { isAdmin } = useAuth();
  const t = useTranslations("BikeCard");

  const statusColors: Record<string, string> = {
    Available:
      "bg-emerald-500/10 text-emerald-400 border border-emerald-600/30",
    InUse: "bg-blue-500/10 text-blue-400 border border-blue-600/30",
    Maintenance: "bg-amber-500/10 text-amber-400 border border-amber-600/30",
    default: "bg-slate-500/10 text-slate-400 border border-slate-600/30",
  };

  const getStatusClass = (status: string) => {
    return statusColors[status] || statusColors.default;
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-slate-900 border border-slate-800 p-4">
      <div
        className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-full ${getStatusClass(
          estado
        )}`}
      >
        {t(`status.${estado}`)} {/* 👈 traducimos el estado */}
      </div>

      <div className="flex flex-col justify-between space-y-3 mt-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            {t("title", { id })} {/* 👈 “Bike {id}” traducido */}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-300">
          <div>
            <span className="block text-slate-500 text-xs">
              {t("station")}
            </span>
            <span className="font-medium">{estacion}</span>
          </div>
          <div className="text-right">
            <span className="block text-slate-500 text-xs">
              {t("avgSpeed")}
            </span>
            <span className="font-medium">{vel_prom} km/h</span>
          </div>
          <div>
            <span className="block text-slate-500 text-xs">
              {t("totalKm")}
            </span>
            <span className="font-medium">{(total_km ?? 0).toLocaleString()}</span>
          </div>
          <div className="text-right">
            {isAdmin && onViewTrips && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewTrips(id);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800/50 text-blue-400 hover:bg-slate-700/50 hover:text-blue-300 transition-colors border border-slate-700/50"
                title={t("logsTooltip")}
              >
                <span>{t("logsButton")}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
