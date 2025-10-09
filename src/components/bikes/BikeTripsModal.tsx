import { useState, useEffect } from 'react';

type Trip = {
  id: string;
  startTime: string;
  endTime: string;
  duration: string;
  distance: number;
  userId: string;
  userName: string;
  startStation: string;
  endStation: string;
  status: string;
};

type BikeTripsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bikeId: string;
  trips: Trip[];
};

export default function BikeTripsModal({ isOpen, onClose, bikeId, trips }: BikeTripsModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose}></div>
      
      <div 
        className={`fixed inset-0 flex items-center justify-center p-4 transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ transition: 'opacity 300ms ease-in-out' }}
      >
        <div 
          className="relative w-full max-w-5xl bg-slate-800 rounded-lg shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">
              Bike {bikeId} Trips
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Start
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    End
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Distance (km)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                {trips.length > 0 ? (
                  trips.map((trip) => (
                    <tr key={trip.id} className="hover:bg-slate-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {trip.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {trip.userName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {new Date(trip.startTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {trip.endTime ? new Date(trip.endTime).toLocaleString() : 'In Progress'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {trip.duration || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {trip.distance?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          trip.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : trip.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {trip.status === 'completed' ? 'Completed' : trip.status === 'in_progress' ? 'In Progress' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-slate-400">
                      No trips recorded for this bike.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-700 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
