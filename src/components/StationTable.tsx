"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";

type Status = "Operational" | "Maintenance" | "Offline";

export type StationRow = {
  id: string;
  nombre: string;
  capacidad_max: number;
  bicicletas: number;
  available: number;
  estado: Status;
};

const statusStyles: Record<Status, { dot: string; pill: string }> = {
  Operational: {
    dot: "bg-emerald-500",
    pill: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20",
  },
  Maintenance: {
    dot: "bg-amber-500",
    pill: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20",
  },
  Offline: {
    dot: "bg-rose-500",
    pill: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/20",
  },
};

function StatusBadge({ status }: { status?: Status }) {
  // Default to 'Offline' if status is undefined or not in statusStyles
  const safeStatus = status && status in statusStyles ? status : 'Offline';
  const s = statusStyles[safeStatus];
  
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${s.pill}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
      {safeStatus}
    </span>
  );
}

export default function StationTable({
  title = "Stations",
}: {
  title?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<StationRow[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleRows, setVisibleRows] = useState<number[]>([]);

  // Cargar datos de la API y manejar animación
  useEffect(() => {
    let isMounted = true;
    
    const fetchStations = async () => {
      setIsLoadingData(true);
      setError(null);
      try {
        const response = await api.get<Array<{
          id: number;
          nombre: string;
          capacidad_max: number;
          bicicletas: number;
          estado: Status;
        }>>("/stations/getStations");
          
        if (!isMounted) return;
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          // Transformar datos de la API
          const transformedData: StationRow[] = response.data.map((station) => ({
            id: String(station.id),
            nombre: station.nombre,
            capacidad_max: station.capacidad_max,
            bicicletas: station.bicicletas,
            available: (typeof station.capacidad_max === 'number' && typeof station.bicicletas === 'number') 
              ? Math.max(0, station.capacidad_max - station.bicicletas) 
              : 0,
            estado: station.estado,
          }));
          
          // Eliminar duplicados basados en ID
          const uniqueData = Array.from(
            new Map(transformedData.map(item => [item.id, item])).values()
          );
          
          setData(uniqueData);
          
          // Iniciar animación después de cargar los datos
          setTimeout(() => {
            if (isMounted) {
              setIsLoaded(true);
              // Inicializar todas las filas como visibles
              setVisibleRows(Array.from({length: uniqueData.length}, (_, i) => i));
            }
          }, 100);
        } else {
          setError("No se encontraron estaciones.");
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Error al cargar estaciones:", err);
        setError("Error al cargar las estaciones.");
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    };

    void fetchStations();
    
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoadingData) {
    return (
      <div className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-slate-400">Cargando estaciones...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full overflow-hidden rounded-2xl border border-red-800 bg-slate-900/60 shadow-lg p-8">
        <div className="text-center text-red-400">
          <p className="text-lg font-semibold">⚠️ Error</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-[600px] flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg transition-all duration-700 ${
      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="px-4 py-3 border-b border-slate-800 flex-shrink-0">
        <h3 className={`text-slate-200 font-semibold transition-all duration-500 delay-100 ${
          isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}>
          {title}
        </h3>
      </div>

      <div className="overflow-x-auto overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900/50 hover:scrollbar-thumb-slate-600">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/80 sticky top-0 z-10">
            <tr className="[&>th]:py-3 [&>th]:px-4 text-slate-400 font-medium">
              <th className={`w-40 transition-all duration-500 delay-200 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}>
                Station
              </th>
              <th className={`text-right transition-all duration-500 delay-[350ms] ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}>
                Capacity
              </th>
              <th className={`text-right transition-all duration-500 delay-[400ms] ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}>
                Bikes Docked
              </th>
              <th className={`text-right transition-all duration-500 delay-[450ms] ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}>
                Available
              </th>
              <th className={`w-40 transition-all duration-500 delay-500 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}>
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {data.map((row, index) => {
              const isVisible = visibleRows.includes(index);
              return (
                <tr
                  key={row.id}
                  className={`hover:bg-slate-800/40 transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                  }`}
                  style={{
                    transitionDelay: `${150 + index * 50}ms`
                  }}
                >
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="text-slate-200 font-semibold">
                        {row.nombre}
                      </span>
                      
                    </div>
                  </td>

                  

                  <td className="py-3 px-4 text-right text-slate-300">
                    {row.capacidad_max} 
                  </td>

                  <td className="py-3 px-4 text-right text-slate-300">
                    {row.bicicletas}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span className="text-slate-200 font-medium">
                      {typeof row.available === 'number' ? Math.max(0, row.available) : 0}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <StatusBadge status={row.estado} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgb(51, 65, 85);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgb(71, 85, 105);
        }
      `}</style>
    </div>
  );
}