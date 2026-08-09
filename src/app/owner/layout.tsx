import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";

import OwnerSidebar from "@/components/owner/owner-sidebar";
import MobileOwnerSidebar from "@/components/owner/MobileOwnerSidebar";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // ==========================================
  // AUTHENTICATION & AUTHORIZATION
  // ==========================================
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "OWNER") {
    redirect("/unauthorized");
  }

  return (
    // FIX 3: h-[100dvh] and overflow-hidden ensures a proper dashboard layout
    <div className="flex h-[100dvh] w-full overflow-hidden bg-[var(--background)]">
      
      {/* ========================================== */}
      {/* DESKTOP SIDEBAR                            */}
      {/* ========================================== */}
      <aside
        className="
          hidden
          h-full
          w-[280px]
          shrink-0
          md:block
        "
      >
        <OwnerSidebar />
      </aside>

      {/* ========================================== */}
      {/* MAIN APPLICATION AREA                      */}
      {/* ========================================== */}
      <main
        className="
          relative
          flex
          flex-1
          flex-col
          overflow-x-hidden
          overflow-y-auto
          bg-[var(--background)]
        "
      >
        {/* ========================================== */}
        {/* MOBILE HEADER                              */}
        {/* ========================================== */}
        <header
          className="
            sticky
            top-0
            z-40
            flex
            h-14
            w-full
            shrink-0
            items-center
            justify-between
            border-b
            border-[var(--border)]
            bg-[var(--background)]/95
            px-4
            backdrop-blur-md
            md:hidden
          "
        >
          {/* Left */}
          <div className="flex min-w-0 items-center gap-3 z-1000">
            {/* Mobile menu */}
            <MobileOwnerSidebar />

            {/* Mobile title */}
            <span className="truncate text-sm font-semibold tracking-tight text-[var(--foreground)]">
              Command Center
            </span>
          </div>

          {/* Right */}
          {/* <div className="flex shrink-0 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-xs font-semibold text-[var(--foreground)]">
              {user.name?.charAt(0).toUpperCase() || "O"}
            </div>
          </div> */}
        </header>

        {/* ========================================== */}
        {/* PAGE CONTENT                               */}
        {/* ========================================== */}
        <div className="flex-1 w-full min-w-0">
          <div
            className="
              mx-auto
              w-full
              max-w-[1600px]
              px-4
              py-5
              sm:px-5
              sm:py-6
              lg:px-6
              lg:py-7
              xl:px-8
            "
          >
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}