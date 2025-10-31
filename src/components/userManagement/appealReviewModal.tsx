import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import api from "@/lib/api";

interface ReviewUserAppealProps {
  onClose: () => void;
  appealId: number;
  appealText: string;
  userId: number;
  adminId: string;
  onSuccess?: () => void;
}

export default function ReviewUserAppeal({
  onClose,
  appealId,
  appealText,
  userId,
  adminId,
  onSuccess,
}: ReviewUserAppealProps) {
  const [type, setType] = useState<"ok" | "warning" | "ban">("ok");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function handleSubmit() {
    if (!message.trim()) {
      alert('Por favor ingresa un mensaje explicando tu decisión');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await api.patch(`/user/updateAppeal/${appealId}`, {
        description: message.trim(),
        state: type,
        adminId: adminId,       
        userId: userId,         
      });

      alert('La decisión ha sido guardada exitosamente');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error al actualizar la apelación:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar la decisión';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="  flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            Revisar Apelación
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">
              Mensaje de Apelación
            </h3>
            <div className="bg-gray-700 rounded-lg p-4 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {appealText || "No appeal message provided."}
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Appeal ID: {appealId}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">
              Decisión del Administrador
            </h3>
            <div className="flex bg-gray-700 border border-slate-800 rounded-xl mb-4 overflow-hidden">
              <button
                onClick={() => setType("ok")}
                className={`flex-1 py-2 text-sm font-medium ${
                  type === "ok"
                    ? "bg-[color:var(--bt-blue,#2563eb)] text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                Ok
              </button>
              <button
                onClick={() => setType("warning")}
                className={`flex-1 py-2 text-sm font-medium ${
                  type === "warning"
                    ? "bg-[color:var(--bt-blue,#2563eb)] text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                Warning
              </button>
              <button
                onClick={() => setType("ban")}
                className={`flex-1 py-2 text-sm font-medium ${
                  type === "ban"
                    ? "bg-[color:var(--bt-blue,#2563eb)] text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                Ban
              </button>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">
                Mensaje para el Usuario
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explica tu decisión al usuario..."
                className="w-full bg-gray-700 text-gray-300 rounded-lg p-3 text-sm border border-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                rows={4}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-650 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Decisión'}
          </button>
        </div>
      </div>
    </div>
  );

  
}
