'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/navbar";
import { AuthProvider } from '@/contexts/AuthContext';
import '@/lib/passive-events'; // Import passive events configuration

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isRegisterPage = pathname === '/register';

  return (
    <AuthProvider>
      {!isLoginPage && !isRegisterPage && <Navbar />}
      <main className={isLoginPage || isRegisterPage ? 'w-full' : 'flex-1 p-6 overflow-y-auto h-screen'}>
        {children}
      </main>
    </AuthProvider>
  );
}
