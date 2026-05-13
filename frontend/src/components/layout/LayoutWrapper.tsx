"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth") || pathname.startsWith("/onboarding");

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main className="grow">
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
}
