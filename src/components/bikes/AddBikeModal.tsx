"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BikeStation } from '@/types/bike';
import { ImCross } from 'react-icons/im';
import toast from 'react-hot-toast';

interface AddBikeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBike: (bike: { station: number; size: string }) => Promise<void>;
  stations: BikeStation[];
}

export default function AddBikeModal({ isOpen, onClose, onAddBike, stations }: AddBikeModalProps) {
  const t = useTranslations("BikeForm");
  const [selectedStation, setSelectedStation] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStation) return;
    
    setIsSubmitting(true);
    try {
      await onAddBike({
        station: selectedStation,
        size: selectedSize
      });
      toast.success("Bicicleta agregada correctamente");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      toast.error("Error al agregar la bicicleta");
      console.error('Error adding bike:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStation(Number(e.target.value));
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSize(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">{t('addBike')}</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            disabled={isSubmitting}
          >
            <ImCross />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {t('station')}
            </label>
            <select
              value={selectedStation}
              onChange={handleStationChange}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white"
              required
              disabled={isSubmitting}
              
            >
              
              {stations.map(station => (
                <option key={station.id} value={station.id}>
                  {station.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {t('size')}
            </label>
            <select
              value={selectedSize}
              onChange={handleSizeChange}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white"
              required
              disabled={isSubmitting}
            >
              <option value="S">{t('small')}</option>
              <option value="M">{t('medium')}</option>
              <option value="L">{t('large')}</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-600 rounded-md hover:bg-slate-500 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:opacity-50 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('adding')}
                </>
              ) : (
                t('addBike')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
