import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";

import OwnerSidebar from "@/components/owner/owner-sidebar";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "OWNER") {
    redirect("/unauthorized");
  }

  return (
    <div className="flex h-full bg-slate-950">
      <OwnerSidebar />

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}