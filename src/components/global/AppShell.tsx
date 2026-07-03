"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideLayout =
    pathname.startsWith("/owner") ||
    pathname.startsWith("/employee") ||
    pathname.startsWith("/incharge");

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}