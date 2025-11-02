'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/navbar";
import { AuthProvider } from '@/contexts/AuthContext';
import '@/lib/passive-events'; // Import passive events configuration
import { Toaster } from 'react-hot-toast';

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
      <Toaster 
      position="top-right" 
        toastOptions={{
            style: {
            background: "#1F2937",
            color: "#F3F4F6",
            border: "1px solid #374151",
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
          }
        }}
      />
    </AuthProvider>
  );
}
