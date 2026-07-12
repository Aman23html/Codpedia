import {
  LayoutDashboard,
  Megaphone,
  Activity,
  Wallet,
  BookOpen,
  Globe,
  Clock3,
  Plane,
  CalendarDays,
  Bell,
  UserCircle2,
  Settings,
} from "lucide-react";

import { DepartmentType } from "@/constants/enums";

export type SidebarItem = {
  title: string;
  href: string;
  icon: any;
  group: string;
  badge?: number;
};

const commonItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/employee",
    icon: LayoutDashboard,
    group: "MAIN",
  },
  {
    title: "Attendance",
    href: "/employee/attendance",
    icon: Clock3,
    group: "WORK",
  },
  {
    title: "Leave",
    href: "/employee/leave",
    icon: Plane,
    group: "WORK",
  },
  {
    title: "Company Calendar",
    href: "/employee/calendar",
    icon: CalendarDays,
    group: "WORK",
  },
  {
    title: "Notifications",
    href: "/employee/notifications",
    icon: Bell,
    group: "ACCOUNT",
  },
  {
    title: "Profile",
    href: "/employee/profile",
    icon: UserCircle2,
    group: "ACCOUNT",
  },
  {
    title: "Settings",
    href: "/employee/settings",
    icon: Settings,
    group: "ACCOUNT",
  },
];

const marketingItems: SidebarItem[] = [
  {
    title: "Marketing",
    href: "/employee/marketing",
    icon: Megaphone,
    group: "WORKSPACE",
  },
  {
    title: "Analytics",
    href: "/employee/analytics",
    icon: Globe,
    group: "WORKSPACE",
  },
];

const operationsItems: SidebarItem[] = [
  {
    title: "Operations",
    href: "/employee/operations",
    icon: Activity,
    group: "WORKSPACE",
  },
  {
    title: "Analytics",
    href: "/employee/operations/analytics",
    icon: Globe,
    group: "WORKSPACE",
  },
];

const accountsItems: SidebarItem[] = [
  {
    title: "Accounts",
    href: "/employee/accounts",
    icon: Wallet,
    group: "WORKSPACE",
  },
  {
    title: "Analytics",
    href: "/employee/analytics",
    icon: Globe,
    group: "WORKSPACE",
  },
];

const tutorItems: SidebarItem[] = [
  {
    title: "Tutor",
    href: "/employee/tutor",
    icon: BookOpen,
    group: "WORKSPACE",
  },
  {
    title: "Analytics",
    href: "/employee/analytics",
    icon: Globe,
    group: "WORKSPACE",
  },
];

const digitalItems: SidebarItem[] = [
  {
    title: "Digital Marketing",
    href: "/employee/digital-marketing",
    icon: Globe,
    group: "WORKSPACE",
  },
  {
    title: "Analytics",
    href: "/employee/analytics",
    icon: Globe,
    group: "WORKSPACE",
  },
];

export function getEmployeeSidebar(department: string): SidebarItem[] {
  let workspace: SidebarItem[] = [];

  switch (department) {
    case DepartmentType.MARKETING:
      workspace = marketingItems;
      break;

    case DepartmentType.OPERATIONS:
      workspace = operationsItems;
      break;

    case DepartmentType.ACCOUNTS:
      workspace = accountsItems;
      break;

    case DepartmentType.TUTOR:
      workspace = tutorItems;
      break;

    case DepartmentType.DIGITAL_MARKETING:
      workspace = digitalItems;
      break;
  }

  return [commonItems[0], ...workspace, ...commonItems.slice(1)];
}