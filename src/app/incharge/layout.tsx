import { redirect } from "next/navigation";
import { Menu, ShieldCheck } from "lucide-react";

import { getCurrentUser } from "@/lib/current-user";
import InchargeSidebar from "@/components/incharge/incharge-sidebar";
import { Role } from "@/constants/enums";

export default async function InchargeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== Role.INCHARGE) {
    redirect("/unauthorized");
  }

  if (!user.department) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[var(--background)] md:flex-row">
      
      {/* ========================================== */}
      {/* CSS-ONLY MOBILE DRAWER STATE               */}
      {/* ========================================== */}
      {/* This hidden checkbox controls the mobile sidebar without needing React state or "use client" */}
      <input 
        type="checkbox" 
        id="mobile-sidebar-toggle" 
        className="peer hidden" 
        aria-hidden="true" 
      />

      {/* Mobile Backdrop Overlay */}
      <label
        htmlFor="mobile-sidebar-toggle"
        className="fixed inset-0 z-40 hidden cursor-pointer bg-black/50 backdrop-blur-sm transition-opacity peer-checked:block md:hidden"
        aria-label="Close sidebar"
      />

      {/* ========================================== */}
      {/* SIDEBAR CONTAINER                          */}
      {/* ========================================== */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-64 -translate-x-full flex-col transition-transform duration-300 ease-in-out peer-checked:translate-x-0 md:static md:w-auto md:translate-x-0">
        <InchargeSidebar department={user.department.type} />
      </aside>

      {/* ========================================== */}
      {/* MAIN CONTENT AREA                          */}
      {/* ========================================== */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-4 sm:h-16 md:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--primary)]/10 text-[var(--primary)]">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-[var(--foreground)]">
              Incharge Console
            </span>
          </div>

          <label
            htmlFor="mobile-sidebar-toggle"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-sm transition-colors hover:bg-[var(--accent)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            aria-label="Open sidebar"
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </label>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>
      </div>
      
    </div>
  );
}