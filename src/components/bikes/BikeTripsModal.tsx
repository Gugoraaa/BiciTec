import { useState, useEffect } from "react";
import { Trip } from "@/types/bike";
import { useTranslations } from "next-intl";
import { exportToCsv } from "@/lib/csv";

type CsvTrip = {
  id: string;
  usuario: string;
  fecha: string;
  tiempo: string;
  distancia: string;
};

type BikeTripsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bikeId: string;
  trips: Trip[];
};

export default function BikeTripsModal({
  isOpen,
  onClose,
  bikeId,
  trips,
}: BikeTripsModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const t = useTranslations("BikeTripsModal");
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      ></div>

      <div
        className={`fixed inset-0 flex items-center justify-center p-4 transition-opacity ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transition: "opacity 300ms ease-in-out" }}
      >
        <div
          className="relative w-full max-w-5xl bg-slate-800 rounded-lg shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">
              {t("title")}
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="sticky top-0 bg-slate-800 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    {t("columns.id")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    {t("columns.user")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    {t("columns.date")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    {t("columns.duration")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    {t("columns.distance")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                {trips.length > 0 ? (
                  trips.map((trip) => (
                    <tr key={trip.id} className="hover:bg-slate-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {trip.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {trip.usuario || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {new Date(trip.fecha).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {trip.tiempo || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {trip.distancia?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-sm text-slate-400"
                    >
                      {t("noTrips")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-700 flex justify-between items-center">
            <button
              onClick={() => {
                const headers = {
                  id: t('columns.id'),
                  usuario: t('columns.user'),
                  fecha: t('columns.date'),
                  tiempo: t('columns.duration'),
                  distancia: t('columns.distance')
                };
                
                const csvData = trips.map(trip => ({
                  id: trip.id,
                  usuario: trip.usuario || 'N/A',
                  fecha: new Date(trip.fecha).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }),
                  tiempo: trip.tiempo || 'N/A',
                  distancia: trip.distancia?.toFixed(2) || '0.00'
                }));
                
                exportToCsv(csvData, `bike-${bikeId}-trips`, headers);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 mr-2"
              disabled={trips.length === 0}
            >
              {t('exportCSV')}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {t('close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
