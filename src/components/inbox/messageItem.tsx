import { MessageItemProps } from '@/types/inbox';

export default function MessageItem({ 
  remitente, 
  titulo, 
  cuerpo, 
  fecha, 
  icon,  
  onClick 
}: MessageItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };
  
  return (
    <div 
      className="flex items-center gap-4 p-4 border-b border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer"
      onClick={handleClick}
    >      
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="w-8 h-8 rounded flex items-center justify-center">
          {icon}
        </div>
        <span className="font-medium text-white">{remitente}</span>
      </div>
      
      <div className="flex-1">
        <div className="font-semibold text-white mb-1">{titulo}</div>
        <div className="text-sm text-gray-400 truncate">{cuerpo}</div>
      </div>
      
      <div className="text-sm text-gray-400 min-w-[120px] text-right">
        {fecha}
      </div>
    </div>
  );
};