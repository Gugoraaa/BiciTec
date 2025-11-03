import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useTranslations } from "next-intl";
import api from "@/lib/api";
import toast from "react-hot-toast";

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
  const t = useTranslations("AppealReviewModal");
  const [type, setType] = useState<"ok" | "warning" | "ban">("ok");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function handleSubmit() {
    if (!message.trim()) {
      toast.error(t('errors.emptyMessage'));
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

      toast.success(t('success'));
      onSuccess?.();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error al actualizar la apelación:', error);
      const errorMessage = error instanceof Error ? error.message : t('errors.saveError', {defaultValue: 'Error al guardar la decisión'});
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="  flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {t('title')}
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
              {t('appealMessage')}
            </h3>
            <div className="bg-gray-700 rounded-lg p-4 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {appealText || t('noMessage')}
            </div>
            <div className="mt-2 text-xs text-gray-400">
              {t('appealId')}: {appealId}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">
              {t('adminDecision')}
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
                {t('decisionOptions.ok')}
              </button>
              <button
                onClick={() => setType("warning")}
                className={`flex-1 py-2 text-sm font-medium ${
                  type === "warning"
                    ? "bg-[color:var(--bt-blue,#2563eb)] text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {t('decisionOptions.warning')}
              </button>
              <button
                onClick={() => setType("ban")}
                className={`flex-1 py-2 text-sm font-medium ${
                  type === "ban"
                    ? "bg-[color:var(--bt-blue,#2563eb)] text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {t('decisionOptions.ban')}
              </button>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">
                {t('userMessageLabel')}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('userMessagePlaceholder')}
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
            {t('cancelButton')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? t('savingButton') : t('saveButton')}
          </button>
        </div>
      </div>
    </div>
  );

  
}
