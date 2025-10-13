import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { NextIntlClientProvider } from "next-intl";

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
      <body className="flex bg-[#0f172a]" suppressHydrationWarning>
        <NextIntlClientProvider>
          <ClientLayout>{children}</ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
