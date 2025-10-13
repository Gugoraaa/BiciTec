'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

type User = {
  id: string;
  matricula: string;
  nombre: string;
  apellido: string;
  role: 'user' | 'admin';
};

type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (matricula: string, password: string) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const { data } = await api.get('/auth/me');
        
        const user = {
          id: data.user.id,
          matricula: data.user.matricula,
          nombre: data.user.nombre,
          apellido: data.user.apellido,
          role: data.user.rol
      };
        
        setUser(user);
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (matricula: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { matricula, password });
      localStorage.setItem('token', data.token);
      
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      const userRole = (data.user.rol || 'user').toLowerCase();
      const user = {
        id: data.user.id,
        matricula: data.user.matricula,
        nombre: data.user.nombre,
        apellido: data.user.apellido,
        role: userRole
      };
      
      setUser(user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAdmin: user?.role?.toLowerCase() === 'admin', 
        isLoading, 
        login, 
        logout 
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
