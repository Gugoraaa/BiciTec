"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import AppealModal from "./AppealModal";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface MessageModalProps {
  message: {
    id: number | string;
    id_mensaje: number;
    remitente: string;
    titulo: string;
    cuerpo: string;
    fecha: string;
    tipo: string;
  } | null;
  onClose: () => void;
}

export default function MessageModal({ message, onClose }: MessageModalProps) {
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMarkAsReadAndClose = async () => {
    if (!message) return;

    try {
      setIsSubmitting(true);
      await api.patch(`/messages/markAsRead/${message.id}`);
      onClose();
    } catch (error) {
      toast.error(t("errorMarkingAsRead"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const t = useTranslations("MessageBox");

  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-lg w-full shadow-2xl relative">
        <div className="flex items-start justify-between p-6 border-b border-gray-700">
          <div>
            <div className="text-sm text-gray-400 mb-1">
              {t("from")} {message.remitente}
            </div>
            <h2 className="text-xl font-semibold text-white">
              {message.titulo}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl"
            disabled={isSubmitting}
            aria-label={t("closeButton")}
          >
            &times;
          </button>
        </div>

        <div className="p-6 text-gray-300 space-y-4 max-h-96 overflow-y-auto">
          {message.cuerpo}
        </div>

        <div className="p-4 bg-gray-800/50 flex justify-between items-center border-t border-gray-700">
          <div className="text-sm text-gray-400">{message.fecha}</div>
          <div className="flex gap-3">
            {message.tipo === "account_notification" && (
              <button
                onClick={() => setShowAppealModal(true)}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {t("appealButton")}
              </button>
            )}
            <button
              onClick={handleMarkAsReadAndClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("marking") : t("markAsReadButton")}
            </button>
          </div>
        </div>

        {showAppealModal && (
          <AppealModal
            onClose={() => setShowAppealModal(false)}
            appealId={message.id}
            appealText={message.cuerpo}
            userId={message.remitente}
          />
        )}
      </div>
    </div>
  );
}
