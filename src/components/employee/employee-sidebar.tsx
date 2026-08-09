"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  getEmployeeSidebar,
  SidebarItem,
} from "@/lib/sidebar/employee-sidebar-config";
import LogoutButton from "@/components/auth/logout-button";

interface EmployeeSidebarProps {
  department: string;
}

export default function EmployeeSidebar({ department }: EmployeeSidebarProps) {
  const pathname = usePathname();

  const items = getEmployeeSidebar(department) || [];

  const groupedItems = items.reduce(
    (acc: Record<string, SidebarItem[]>, item) => {
      if (!acc[item.group]) {
        acc[item.group] = [];
      }
      acc[item.group].push(item);
      return acc;
    },
    {}
  );

  return (
    <div className="flex h-full w-full shrink-0 flex-col border-r border-[var(--border)] bg-[var(--background)] md:w-64">
      
      {/* Sidebar Header */}
      <div className="flex h-14 shrink-0 items-center border-b border-[var(--border)] px-5 sm:h-16 sm:px-6">
        <span className="text-base font-semibold tracking-tight text-[var(--foreground)] sm:text-lg">
          Workspace
        </span>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-5 sm:px-4 sm:py-6">
        {Object.entries(groupedItems).map(([groupName, groupItems]) => (
          <div key={groupName} className="flex flex-col">
            <h3 className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              {groupName}
            </h3>

            <div className="space-y-0.5">
              {groupItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between rounded-md px-2.5 py-2 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                      isActive
                        ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors duration-200",
                          isActive
                            ? "text-[var(--primary)]"
                            : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
                        )}
                      />
                      <span className="truncate">{item.title}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={cn(
                        "ml-2 flex h-4 min-w-[16px] shrink-0 items-center justify-center rounded-full px-1 text-[9px] font-bold",
                        isActive 
                          ? "bg-[var(--primary)] text-white" 
                          : "bg-[var(--border)] text-[var(--muted-foreground)] group-hover:bg-[var(--muted-foreground)] group-hover:text-[var(--background)]"
                      )}>
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

      {/* Sidebar Footer */}
      <div className="shrink-0 border-t border-[var(--border)] p-3 sm:p-4">
        <LogoutButton />
      </div>
      
    </div>
  );
}