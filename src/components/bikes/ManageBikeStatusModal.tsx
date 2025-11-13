"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import api from "@/lib/api";

interface ManageBikeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  bikeId: string | null;
  currentStatus?: "Available" | "Maintenance" | null;
}

type BikeStatusOption = "Available" | "Maintenance";

export default function ManageBikeStatusModal({
  isOpen,
  onClose,
  bikeId,
  currentStatus,
}: ManageBikeStatusModalProps) {
  const t = useTranslations("BikeStatusModal");
  const [status, setStatus] = useState<BikeStatusOption>("Available");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStatus((currentStatus as BikeStatusOption) || "Available");
    }
  }, [isOpen, currentStatus]);

  if (!isOpen || !bikeId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bikeId) return;

    setIsSubmitting(true);
    try {
      const response = await api.patch(`/bikes/${bikeId}/status`, {
        status,
      });

      if (response.status === 200) {
        toast.success(t("toast.success"));
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 2000);
      } else {
        toast.error(t("toast.error"));
        console.error("Failed to update bike status:", response.data);
      }
    } catch (error) {
      toast.error(t("toast.error"));
      console.error("Error updating bike status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">{t("title")}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {t("label")}
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BikeStatusOption)}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white"
              required
              disabled={isSubmitting}
            >
              <option value="Available">{t("status.Available")}</option>
              <option value="Maintenance">{t("status.Maintenance")}</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-600 rounded-md hover:bg-slate-500 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:opacity-50 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("saving") : t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}