"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = pathname.startsWith("/auth") || pathname.startsWith("/onboarding") || pathname.startsWith("/dashboard");

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className="grow">
        {children}
      </main>
      {!hideLayout && <Footer />}
    </>
  );
}
