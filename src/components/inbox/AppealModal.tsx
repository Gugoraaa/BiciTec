import React, { useState, FormEvent } from "react";
import { IoClose } from "react-icons/io5";
import { useTranslations } from "next-intl";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

interface AppealModalProps {
  onClose: () => void;
  appealId: number | string;
  appealText: string;
  userId: string;
}

export default function AppealModal({ onClose, appealId, appealText, userId }: AppealModalProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const t = useTranslations("AppealModal");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {  
      toast.error(t('validationError'));
      return;
    }

    try {
      setIsSubmitting(true);
      
      await api.post(`/user/CreateAppeal`, {
        id: user?.id,    
        description: message.trim(),
      });
      
      toast.success(t('success'));
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error al enviar la apelación:', error);
      toast.error(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {t('title')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isSubmitting}
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Appeal Message */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">
              {t('appealMessage')}
            </h3>
            <div className="bg-gray-700 rounded-lg p-4 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mb-4">
              {appealText || t('noMessage')}
            </div>
            
            <div className="mt-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                {t('explanationLabel')}
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('messagePlaceholder')}
                className="w-full bg-gray-700 text-gray-300 rounded-lg p-3 text-sm border border-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                rows={4}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-650 transition-colors disabled:opacity-50"
          >
            {t('cancelButton')}
          </button>
          <button 
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? t('submitting') : t('submitButton')}
          </button>
        </div>
      </div>
    </div>
  );
}
