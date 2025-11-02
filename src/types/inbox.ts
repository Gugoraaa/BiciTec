export interface MessageItemProps {
  id_mensaje: number;
  id: number;
  remitente: string;
  titulo: string;
  cuerpo: string;
  fecha: string;
  tipo: string;
  icon: React.ReactNode;
  leido: boolean;
  onClick?: () => void;
}