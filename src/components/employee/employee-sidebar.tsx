"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; 
import { getEmployeeSidebar, SidebarItem } from "@/lib/sidebar/employee-sidebar-config";
import LogoutButton from "@/components/auth/logout-button";
import { DepartmentType } from "@prisma/client";

interface EmployeeSidebarProps {
  department: DepartmentType;
} 

export default function EmployeeSidebar({ department }: EmployeeSidebarProps) {
  const pathname = usePathname();

  // 1. Generate the items inside the client component
  // Added a fallback `|| []` to guarantee it is never undefined
  const items = getEmployeeSidebar(department) || [];

  // 2. Group the flat array
  const groupedItems = items.reduce((acc: Record<string, SidebarItem[]>, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full w-64 bg-[var(--card)] border-r border-[var(--border)]">
      <div className="h-16 flex items-center px-6 border-b border-[var(--border)]">
        <span className="text-lg font-black text-[var(--foreground)]">
          Workspace
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        {Object.entries(groupedItems).map(([groupName, groupItems]) => (
          <div key={groupName}>
            <h3 className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              {groupName}
            </h3>
            <div className="space-y-1">
              {groupItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-500/10 text-blue-600"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-[var(--muted-foreground)]")} />
                      {item.title}
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[var(--border)]">
        <LogoutButton />
      </div>
    </div>
  );
}