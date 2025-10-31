'use client';

import { useState } from 'react';
import { FaTimes, FaCheck, FaExclamationCircle } from 'react-icons/fa';
import { useTranslations } from "next-intl";
import toast from 'react-hot-toast';
export default function ReportModal({ 
  isOpen, 
  onClose,
  bikes,
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  bikes: { id: string }[];
  onSubmit: (bikeId: string, description: string) => Promise<boolean>;
}) {
  const [selectedBike, setSelectedBike] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("ReportModal");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBike || !description.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await Promise.resolve(onSubmit(selectedBike, description));
      
      if (result === false) {
        toast.error("Error al enviar el reporte");
      } else {
        toast.success("Reporte enviado correctamente");
        setTimeout(() => {
          onClose();
        }, 2000);
      }
      
      setSelectedBike('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-800 p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <FaTimes className="h-5 w-5" />
        </button>
        
        <h2 className="text-xl font-semibold text-white mb-4">{t("title")}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bike-select" className="block text-sm font-medium text-gray-300 mb-1">
              {t("bikeSelect")}
            </label>
            <select
              id="bike-select"
              value={selectedBike}
              onChange={(e) => setSelectedBike(e.target.value)}
              className="w-full rounded-lg border border-gray-600 bg-slate-700 p-2.5 text-sm text-white focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">{t("bikeSelect")}</option>
              {bikes.map((bike) => (
                <option key={bike.id} value={bike.id}>
                  {bike.id}
                </option>
              ))}
            </select>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              {t("description")}
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-600 bg-slate-700 p-2.5 text-sm text-white focus:border-blue-500 focus:ring-blue-500"
              placeholder={t("describeIssue")}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 hover:bg-slate-700"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("submitting") : t("submitReport")}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>  
  );
}
