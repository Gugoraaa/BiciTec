"use client";

import { useState, useEffect } from "react";
import { StationRow } from "@/types/stations";
import api from "@/lib/api";
import { FaCheck } from "react-icons/fa";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";


type StationStatus = "Operational" | "Offline";

interface ManageStationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManageStationsModal({
  isOpen,
  onClose,
}: ManageStationsModalProps) {
  const [selectedStationId, setSelectedStationId] = useState<string>("");
  const [status, setStatus] = useState<StationStatus>("Operational");
  const [stations, setStations] = useState<StationRow[]>([]);

  const t = useTranslations("StationsModal");
  const fetchStations = async () => {
    try {
      const response = await api.get<StationRow[]>("/stations/getStations");
      if (response.data) setStations(response.data);
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  // Encuentra la estación actual (normalizando id a string)
  const currentStation = stations.find(
    (s) => String(s.id) === selectedStationId
  );

  // Al cargar estaciones o cambiar selección, sincroniza el status mostrado
  useEffect(() => {
    if (stations.length > 0) {
      if (!selectedStationId) {
        setSelectedStationId(String(stations[0].id)); // inicial
      }
      const st = stations.find((s) => String(s.id) === selectedStationId);
      if (st) setStatus((st.estado as StationStatus) ?? "Operational");
    }
  }, [stations, selectedStationId]);

  const handleStationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedStationId(newId);
    const st = stations.find((s) => String(s.id) === newId);
    if (st) setStatus((st.estado as StationStatus) ?? "Operational");
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStationId) return;

    try {
      const response = await api.patch(
        `/stations/updateStatus/${selectedStationId}`,
        {
          status: status,
        }
      );

      if (response.status === 200) {
        toast.success(t('toast.success'));
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 2000);
      } else {
        toast.error(t('toast.error'));
        console.error("Failed to update station status:", response.data);
      }
    } catch (error) {
      toast.error(t('toast.error'));
      console.error("Error updating station status:", error);
    }

    
    
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-slate-800 p-6 ring-1 ring-slate-700">
        <h3 className="text-xl font-semibold text-white mb-4">
          {t("title")}
        </h3>
        
          <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Selector de estación + badge de estado actual */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-300">
                  {t("label1")}
                </label>
              </div>

              <select
                value={selectedStationId}
                onChange={handleStationChange}
                className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-slate-100 ring-1 ring-slate-700 focus:outline-none focus:ring-sky-500"
              >
                {stations.map((station) => (
                  <option key={station.id} value={String(station.id)}>
                    {station.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                {t("label2")}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StationStatus)}
                className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-slate-100 ring-1 ring-slate-700 focus:outline-none focus:ring-sky-500"
              >
                <option value="Operational">{t("Operational")}</option>
                <option value="Offline">{t("Offline")}</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
              disabled={!selectedStationId}
            >
              {t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
