import React, { useState, FormEvent } from "react";
import { IoClose } from "react-icons/io5";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {  
      alert('Por favor ingresa un mensaje');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Call the API to submit the appeal
      await api.post(`/user/CreateAppeal`, {
        id: user?.id,    // The ID of the user making the appeal
        description: message.trim(),
      });
      
      alert('Tu apelación ha sido enviada correctamente');
      onClose();
      
    } catch (error) {
      console.error('Error al enviar la apelación:', error);
      alert('Ocurrió un error al enviar la apelación. Por favor intenta de nuevo.');
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
            Enviar Apelación
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
              Tu mensaje de apelación
            </h3>
            <div className="bg-gray-700 rounded-lg p-4 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mb-4">
              {appealText || 'No se proporcionó un mensaje de apelación.'}
            </div>
            
            <div className="mt-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Explica por qué deberíamos reconsiderar
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
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
            Cancelar
          </button>
          <button 
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Apelación'}
          </button>
        </div>
      </div>
    </div>
  );
}
