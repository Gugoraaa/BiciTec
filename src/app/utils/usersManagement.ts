export const formattedUsers = (data: any) => data.map((user: any) => ({
          id: user.id || '',
          studentId: user.matricula || '',
          name: user.nombre || '',
          lastName: user.apellido || '',
          status: (user.estado?.toLowerCase() || 'ok') as 'ok' | 'warning' | 'banned',
          creationDate: new Date().toISOString() 
        }));