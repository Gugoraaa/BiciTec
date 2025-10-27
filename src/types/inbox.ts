export interface MessageItemProps {
  id: number;
  remitente: string;
  titulo: string;
  cuerpo: string;
  fecha: string;
  icon: React.ReactNode;
  onClick?: () => void;
}