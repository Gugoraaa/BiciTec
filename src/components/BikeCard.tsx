"use client";
import { Bike } from "@/types/bike";

export default function BikeCard({
  id,
  lastSeen,
  station,
  avgSpeed,
  totalKm,  
  status,
}: Bike) {
  const statusColors: Record<string, string> = {
    Available: "bg-emerald-500/10 text-emerald-400 border border-emerald-600/30",
    "In Use": "bg-blue-500/10 text-blue-400 border border-blue-600/30",
    In_Use: "bg-blue-500/10 text-blue-400 border border-blue-600/30", 
    Maintenance: "bg-amber-500/10 text-amber-400 border border-amber-600/30",
    default: "bg-slate-500/10 text-slate-400 border border-slate-600/30"
  };


  const getStatusClass = (status: string) => {
    return statusColors[status] || statusColors.default;
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-slate-900 border border-slate-800 p-4">
      
      <div
        className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-full ${
          getStatusClass(status)
        }`}
      >
        {status}
      </div>

     
      <div className="flex flex-col justify-between space-y-3 mt-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{id}</h2>
          <p className="text-sm text-slate-400">Last seen: {lastSeen}</p>
        </div>

        <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-300">
          <div>
            <span className="block text-slate-500 text-xs">Station</span>
            <span className="font-medium">{station}</span>
          </div>
          <div className="text-right">
            <span className="block text-slate-500 text-xs">Avg. Speed</span>
            <span className="font-medium">{avgSpeed} km/h</span>
          </div>
          <div>
            <span className="block text-slate-500 text-xs">Total Km</span>
            <span className="font-medium">{totalKm.toLocaleString()}</span>
          </div>
          <div className="text-right">
            
            
          </div>
        </div>
      </div>
    </div>
  );
}
