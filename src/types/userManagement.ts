export interface UserManagement {
  id: string;
  studentId: string;
  name: string;
  lastName: string;
  status: "ok" | "warning" | "banned";
  creationDate: string;
}

export type UserStatus = 'All' | 'ok' | 'warning' | 'banned';

export interface Appeal {
  id: number;
  mensaje: string;
  fecha: string;
  nombre: string;
  apellido: string;
  userId: number;
  type?: string;
  who: string;
  text: string;
  when: string;
}

export interface AppealApiResponse {
  id: number;
  mensaje: string;
  fecha: string;
  nombre: string;
  apellido: string;
  type?: string;
  userId?: number;
  usuarioId?: number;
  user?: {
    id: number;
  };
  [key: string]: string | number | boolean | undefined | null | object; // More specific type for additional properties
}

