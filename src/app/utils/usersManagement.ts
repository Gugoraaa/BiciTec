interface UserData {
  id: string;
  matricula?: string;
  nombre?: string;
  apellido?: string;
  estado?: string;
}

export interface FormattedUser {
  id: string;
  studentId: string;
  name: string;
  lastName: string;
  status: 'ok' | 'warning' | 'banned';
  creationDate: string;
}

export const formattedUsers = (data: UserData[]): FormattedUser[] => 
  data.map((user: UserData) => ({
    id: user.id || '',
    studentId: user.matricula || '',
    name: user.nombre || '',
    lastName: user.apellido || '',
    status: (user.estado?.toLowerCase() || 'ok') as 'ok' | 'warning' | 'banned',
    creationDate: new Date().toISOString() 
  }));