import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CuanSelor - Your Partner for Fearless Financial Freedom",
  description: "Platform perencanaan keuangan pensiun berbasis AI. Analisis, proyeksi, dan rekomendasi investasi personal.",
  icons: {
    icon: "/CuanSelorIcon.png",
    shortcut: "/CuanSelorIcon.png",
    apple: "/CuanSelorIcon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} h-full w-full antialiased`}
    >
      <body className="min-h-full w-full flex flex-col">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
