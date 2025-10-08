'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaCheck } from 'react-icons/fa';

export default function ReportModal({ 
  isOpen, 
  onClose,
  bikes,
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  bikes: { id: string }[];
  onSubmit: (bikeId: string, description: string) => void;
}) {
  const [selectedBike, setSelectedBike] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBike || !description.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await Promise.resolve(onSubmit(selectedBike, description));
      
      // Show success state
      setShowSuccess(true);
      
      // Close after delay
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
      
      // Reset form
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
        
        <h2 className="text-xl font-semibold text-white mb-4">Report an Issue</h2>
        
        {showSuccess ? (
          <div className="text-center py-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 mb-4">
              <FaCheck className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Report Submitted!</h3>
            <p className="text-slate-300">Thank you for your report. We'll look into it soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bike-select" className="block text-sm font-medium text-gray-300 mb-1">
              Select Bike
            </label>
            <select
              id="bike-select"
              value={selectedBike}
              onChange={(e) => setSelectedBike(e.target.value)}
              className="w-full rounded-lg border border-gray-600 bg-slate-700 p-2.5 text-sm text-white focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select a bike</option>
              {bikes.map((bike) => (
                <option key={bike.id} value={bike.id}>
                  {bike.id}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Issue Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-600 bg-slate-700 p-2.5 text-sm text-white focus:border-blue-500 focus:ring-blue-500"
              placeholder="Please describe the issue..."
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
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
