'use client'
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { FaExclamationCircle } from 'react-icons/fa';

interface StationData {
  id_estacion: number;
  nombre: string;
  estado: 'Operational' | 'Offline' | string;
  porcentaje_ocupacion: number;
  bicicletas_disponibles: number;
  capacidad_total: number;
}

export default function StationCapacityCard() {
  const [stations, setStations] = useState<StationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchStationData = async () => {
      try {
        const response = await api.get('/overview/stationPercent');
        setStations(response.data);
      } catch (err) {
        console.error('Error fetching station data:', err);
        setError('Failed to load station data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStationData();

    // Animation setup
    const duration = 1200;
    let start: number | null = null;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const newProgress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - newProgress, 3);
      setProgress(eased);
      
      if (newProgress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-[#0b1425] rounded-2xl p-6 h-full flex items-center justify-center">
        <div className="text-blue-400">Loading station data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0b1425] rounded-2xl p-6 h-full flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b1425] rounded-2xl p-6 h-full flex flex-col">
      <h3 className="text-lg font-medium text-white mb-4">Station Capacity</h3>
      <div className="overflow-y-auto pr-2" style={{ maxHeight: '400px' }}>
        <div className="space-y-4">
        {stations.length === 0 ? (
          <div className="text-gray-400 text-center py-4">No station data available</div>
        ) : (
          stations.map((station, index) => {
            const isOffline = station.estado !== 'Operational';
            const displayValue = Math.min(100, Math.max(0, station.porcentaje_ocupacion));
            const animatedWidth = displayValue * progress;

            return (
              <div key={station.id_estacion} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`${isOffline ? 'text-red-400' : 'text-gray-400'}`}>
                      {station.nombre}
                    </span>
                    {isOffline && (
                      <span className="text-xs text-red-400 flex items-center gap-1">
                        <FaExclamationCircle />
                        Offline
                      </span>
                    )}
                  </div>
                  <span className={isOffline ? 'text-red-400' : 'text-white'}>
                    {isOffline ? 'N/A' : `${station.bicicletas_disponibles}/${station.capacidad_total}`}
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full transition-all duration-1000 ease-out ${
                      isOffline 
                        ? 'bg-gradient-to-r from-red-500 to-red-600' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-400'
                    }`}
                    style={{
                      width: isOffline ? '100%' : `${animatedWidth}%`,
                      transitionProperty: 'width',
                      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                      transitionDuration: '150ms',
                      opacity: isOffline ? 0.7 : 1,
                    }}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={isOffline ? 100 : Math.round(displayValue)}
                    aria-label={`${station.nombre} capacity`}
                  >
                    {!isOffline && (
                      <div 
                        className="absolute inset-0 -translate-x-full animate-shimmer"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                          animationDelay: `${index * 100}ms`,
                          animationDuration: '2s',
                          animationIterationCount: 'infinite',
                          animationTimingFunction: 'ease-in-out',
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        </div>
      </div>
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        /* Modern Scrollbar Styling */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, 0.5) rgba(30, 41, 59, 0.1);
          padding-right: 4px;
        }
        
        /* Webkit Scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.2);
          border-radius: 4px;
          margin: 4px 0;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, rgba(100, 116, 139, 0.7), rgba(71, 85, 105, 0.7));
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background-clip: padding-box;
          transition: all 0.2s ease;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, rgba(148, 163, 184, 0.8), rgba(100, 116, 139, 0.8));
          cursor: pointer;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:active {
          background: linear-gradient(135deg, rgba(148, 163, 184, 1), rgba(100, 116, 139, 1));
        }
        
        /* Smooth scrolling */
        .overflow-y-auto {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
}