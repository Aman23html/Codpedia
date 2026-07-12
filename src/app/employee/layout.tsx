import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/current-user";
import EmployeeSidebar from "@/components/employee/employee-sidebar";
import { Role } from "@/constants/enums";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== Role.EMPLOYEE) {
    redirect("/unauthorized");
  }

  if (!user.department) {
    redirect("/login");
  }

  console.log("EMPLOYEE DEPARTMENT:", user.department);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      <EmployeeSidebar department={user.department.type} />

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}