import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";


export const metadata: Metadata = {
  title: "BiciTec",
  description: "BiciTec",
  icons: {
    icon: "/tec.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex bg-[#0f172a]">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
