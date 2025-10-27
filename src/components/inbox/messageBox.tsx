
interface MessageModalProps {
  message: {
    remitente: string;
    titulo: string;
    cuerpo: string;
    fecha: string;
  } | null;
  onClose: () => void;
}

export default function MessageModal({ message, onClose }: MessageModalProps) {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-lg w-full shadow-2xl">
        {/* Header del modal */}
        <div className="flex items-start justify-between p-6 border-b border-gray-700">
          <div>
            <div className="text-sm text-gray-400 mb-1">From: {message.remitente}</div>
            <h2 className="text-xl font-semibold text-white">{message.titulo}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            X
          </button>
        </div>

        
        <div className="p-6 text-gray-300 space-y-4 max-h-96 overflow-y-auto">
          {message.cuerpo}
        </div>

        <div className="p-6 border-t border-gray-700 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}