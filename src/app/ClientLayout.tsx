'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <>
      {!isLoginPage && <Navbar />}
      <main className={isLoginPage ? 'w-full' : 'flex-1 p-6 overflow-y-auto h-screen'}>
        {children}
      </main>
    </>
  );
}
