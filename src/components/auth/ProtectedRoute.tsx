'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/ui/LoadingScreen';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
};

export default function ProtectedRoute({ 
  children, 
  requiredRole = 'user' 
}: ProtectedRouteProps) {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Si no hay usuario, redirigir a login
      if (!user) {
        router.push('/login');
        return;
      }

      // Si se requiere ser admin y el usuario no lo es, redirigir a la página principal
      if (requiredRole === 'admin' && !isAdmin) {
        router.push('/bikes');
      }
    }
  }, [user, isAdmin, isLoading, requiredRole, router]);

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (isLoading || !user || (requiredRole === 'admin' && !isAdmin)) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
