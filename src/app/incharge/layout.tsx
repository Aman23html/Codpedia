import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/current-user";
import InchargeSidebar from "@/components/incharge/incharge-sidebar";
import { Role } from "@prisma/client";

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
    <div className="min-h-screen bg-[var(--background)]">
      <InchargeSidebar department={user.department.type} />

      <main className="ml-72 min-h-screen">
        {children}
      </main>
    </div>
  );
}