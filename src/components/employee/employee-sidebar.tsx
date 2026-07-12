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
    <div className="flex h-full w-64 flex-col border-r border-[var(--border)] bg-[var(--card)]">
      <div className="flex h-16 items-center border-b border-[var(--border)] px-6">
        <span className="text-lg font-black text-[var(--foreground)]">
          Workspace
        </span>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto px-4 py-6">
        {Object.entries(groupedItems).map(([groupName, groupItems]) => (
          <div key={groupName}>
            <h3 className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
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
                      "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-500/10 text-blue-600"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "h-5 w-5",
                          isActive
                            ? "text-blue-600"
                            : "text-[var(--muted-foreground)]"
                        )}
                      />
                      {item.title}
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
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

      <div className="border-t border-[var(--border)] p-4">
        <LogoutButton />
      </div>
    </div>
  );
}