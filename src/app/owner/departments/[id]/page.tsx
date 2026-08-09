// import Link from "next/link";
// import { notFound } from "next/navigation";

// import {
//   ArrowLeft,
//   Building2,
//   Mail,
//   ShieldCheck,
//   UserCheck,
//   UserCog,
//   Users,
//   CircleDot,
//   Fingerprint,
//   Phone,
//   Crown,
//   Activity,
//   ArrowRight,
//   BadgeCheck,
// } from "lucide-react";

// import { getDepartmentDetails } from "@/actions/owner/get-department-details";

// type DepartmentUser = {
//   id?: string;
//   _id?: string;
//   fullName: string;
//   username?: string | null;
//   email?: string | null;
//   phone?: string | null;
//   role: string;
//   status: string;
//   employeeCode?: string | null;
//   profileImageUrl?: string | null;
// };

// type DepartmentDetails = {
//   id?: string;
//   _id?: string;
//   name: string;
//   type: string;
//   users: DepartmentUser[];
// };

// function getInitials(name?: string | null) {
//   if (!name) return "U";

//   return name
//     .split(" ")
//     .filter(Boolean)
//     .map((part) => part[0])
//     .join("")
//     .substring(0, 2)
//     .toUpperCase();
// }

// function getIdLabel(role?: string | null) {
//   if (role === "OWNER") return "Owner ID";
//   if (role === "INCHARGE") return "Incharge ID";
//   return "Employee ID";
// }

// function getDisplayCode(user: { employeeCode?: string | null }) {
//   return user.employeeCode || "Not Generated";
// }

// function getRoleSubtitle(role?: string | null) {
//   if (role === "OWNER") return "System Owner";
//   if (role === "INCHARGE") return "Department Manager";
//   return "Department Employee";
// }

// function getSafeProfileImageUrl(url?: string | null) {
//   if (!url) return null;

//   const trimmedUrl = String(url).trim();

//   if (!trimmedUrl) return null;

//   return trimmedUrl;
// }

// export default async function DepartmentPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;

//   const department = (await getDepartmentDetails(
//     id
//   )) as DepartmentDetails | null;

//   if (!department) {
//     notFound();
//   }

//   const users = department.users || [];

//   const totalUsers = users.length;

//   const owners = users.filter(
//     (user: DepartmentUser) => user.role === "OWNER"
//   ).length;

//   const employees = users.filter(
//     (user: DepartmentUser) => user.role === "EMPLOYEE"
//   ).length;

//   const incharges = users.filter(
//     (user: DepartmentUser) => user.role === "INCHARGE"
//   ).length;

//   const activeUsers = users.filter(
//     (user: DepartmentUser) => user.status === "ACTIVE"
//   ).length;

//   const pendingUsers = users.filter(
//     (user: DepartmentUser) =>
//       user.status === "PENDING_APPROVAL" || user.status === "PENDING_EMAIL"
//   ).length;

//   const activeRate =
//     totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

//   return (
//     <div className="min-h-screen bg-[var(--background)] px-4 pt-24 pb-12 md:px-6 lg:px-8 max-w-[1600px] mx-auto flex flex-col gap-6">
//       <header className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm lg:p-8">
//         <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[var(--primary)]/5 to-transparent opacity-50" />

//         <div className="relative z-10">
//           <Link
//             href="/owner/departments"
//             className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to Departments
//           </Link>

//           <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
//             <div className="flex-1">
//               <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-[var(--primary)]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] shadow-sm ring-1 ring-[var(--primary)]/20">
//                 <Building2 className="h-3 w-3" />
//                 Department Control Center
//               </div>

//               <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] lg:text-3xl">
//                 {department.name}
//               </h1>

//               <p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)]">
//                 View department members, employee IDs, incharge details, account
//                 status, and role distribution from one professional control
//                 panel.
//               </p>
//             </div>

//             <div className="w-full xl:w-80">
//               <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-sm">
//                 <div className="mb-4 flex items-center justify-between">
//                   <div>
//                     <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
//                       Department Type
//                     </p>

//                     <p className="mt-0.5 text-base font-bold text-[var(--foreground)]">
//                       {department.type.replaceAll("_", " ")}
//                     </p>
//                   </div>

//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[var(--primary)]">
//                     <Building2 className="h-5 w-5" />
//                   </div>
//                 </div>

//                 <div className="space-y-2 text-sm">
//                   <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
//                     <span>Active Rate</span>
//                     <span className="text-[var(--foreground)]">
//                       {activeRate}%
//                     </span>
//                   </div>

//                   <div className="h-1.5 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--card)]">
//                     <div
//                       className="h-full rounded-full bg-[var(--primary)] transition-all duration-700"
//                       style={{ width: `${activeRate}%` }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
//         <SummaryCard
//           title="Total Users"
//           value={totalUsers}
//           icon={Users}
//           tone="blue"
//         />

//         <SummaryCard
//           title="Owners"
//           value={owners}
//           icon={Crown}
//           tone="amber"
//         />

//         <SummaryCard
//           title="Employees"
//           value={employees}
//           icon={UserCheck}
//           tone="emerald"
//         />

//         <SummaryCard
//           title="Incharges"
//           value={incharges}
//           icon={UserCog}
//           tone="purple"
//         />

//         <SummaryCard
//           title="Active"
//           value={activeUsers}
//           icon={ShieldCheck}
//           tone="green"
//         />

//         <SummaryCard
//           title="Pending"
//           value={pendingUsers}
//           icon={Activity}
//           tone="orange"
//         />
//       </section>

//       <section className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
//         <div className="flex flex-col gap-4 border-b border-[var(--border)] bg-[var(--card)]/50 p-6 lg:flex-row lg:items-center lg:justify-between">
//           <div>
//             <div className="mb-2 inline-flex items-center gap-1.5 rounded-md bg-[var(--primary)]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">
//               Live Members Directory
//             </div>

//             <h2 className="text-lg font-bold text-[var(--foreground)]">
//               Department Members
//             </h2>

//             <p className="text-xs text-[var(--muted-foreground)]">
//               Employees, incharges, and active accounts assigned to this
//               department.
//             </p>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             <BadgeItem label="Members" value={totalUsers} />
//             <BadgeItem label="Active" value={activeUsers} />
//             <BadgeItem label="Pending" value={pendingUsers} />
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm">
//             <thead className="bg-[var(--background)]">
//               <tr>
//                 <TableHead>Member</TableHead>
//                 <TableHead>Employee ID</TableHead>
//                 <TableHead>Contact</TableHead>
//                 <TableHead>Role</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Department</TableHead>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-[var(--border)]">
//               {users.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     className="px-6 py-16 text-center text-[var(--muted-foreground)]"
//                   >
//                     <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)]">
//                       <Users className="h-6 w-6 text-[var(--muted-foreground)]" />
//                     </div>
//                     No users assigned to this department yet.
//                   </td>
//                 </tr>
//               ) : (
//                 users.map((user: DepartmentUser) => (
//                   <MemberRow
//                     key={String(user.id || user._id || user.email)}
//                     user={user}
//                     department={department}
//                   />
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </div>
//   );
// }

// function MemberRow({
//   user,
//   department,
// }: {
//   user: DepartmentUser;
//   department: {
//     name: string;
//     type: string;
//   };
// }) {
//   const visibleCode = getDisplayCode(user);
//   const visibleIdLabel = getIdLabel(user.role);
//   const imageUrl = getSafeProfileImageUrl(user.profileImageUrl);

//   return (
//     <tr className="group transition-colors hover:bg-[var(--background)]/50">
//       <td className="whitespace-nowrap px-6 py-4">
//         <div className="flex items-center gap-3">
//           <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs font-bold text-[var(--foreground)] shadow-sm">
//             {imageUrl ? (
//               <img
//                 src={imageUrl}
//                 alt={user.fullName || "User"}
//                 className="h-full w-full object-cover"
//               />
//             ) : (
//               getInitials(user.fullName)
//             )}
//           </div>

//           <div>
//             <p className="font-semibold text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
//               {user.fullName || "Unknown User"}
//             </p>

//             <p className="text-[11px] font-medium text-[var(--muted-foreground)]">
//               {user.username ? `@${user.username}` : getRoleSubtitle(user.role)}
//             </p>
//           </div>
//         </div>
//       </td>

//       <td className="whitespace-nowrap px-6 py-4">
//         <div>
//           <p className="mb-0.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
//             <Fingerprint className="h-3 w-3 text-[var(--primary)]" />
//             {visibleIdLabel}
//           </p>

//           <p className="font-mono text-sm font-semibold text-[var(--foreground)]">
//             {visibleCode}
//           </p>
//         </div>
//       </td>

//       <td className="whitespace-nowrap px-6 py-4">
//         <div className="space-y-1">
//           <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)]">
//             <Mail className="h-3.5 w-3.5 opacity-70" />
//             {user.email || "No Email"}
//           </div>

//           <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)]">
//             <Phone className="h-3.5 w-3.5 opacity-70" />
//             {user.phone || "Not Provided"}
//           </div>
//         </div>
//       </td>

//       <td className="whitespace-nowrap px-6 py-4">
//         <RoleBadge role={user.role || "EMPLOYEE"} />
//       </td>

//       <td className="whitespace-nowrap px-6 py-4">
//         <StatusBadge status={user.status || "PENDING_APPROVAL"} />
//       </td>

//       <td className="whitespace-nowrap px-6 py-4">
//         <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] shadow-sm">
//           <Building2 className="h-3 w-3 text-[var(--primary)]" />
//           {department.name}
//         </span>
//       </td>
//     </tr>
//   );
// }

// function BadgeItem({ label, value }: { label: string; value: number }) {
//   return (
//     <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-bold text-[var(--foreground)] shadow-sm">
//       <span className="text-[var(--muted-foreground)]">{label}: </span>
//       {value}
//     </div>
//   );
// }

// function SummaryCard({
//   title,
//   value,
//   icon: Icon,
//   tone,
// }: {
//   title: string;
//   value: number;
//   icon: React.ElementType;
//   tone: "blue" | "emerald" | "purple" | "amber" | "green" | "orange";
// }) {
//   const styles = {
//     blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
//     emerald:
//       "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
//     purple:
//       "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
//     amber:
//       "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
//     green:
//       "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
//     orange:
//       "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
//   };

//   return (
//     <div className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition-transform hover:-translate-y-0.5">
//       <div className="mb-4 flex items-center justify-between">
//         <div className={`rounded-lg p-2.5 border ${styles[tone]}`}>
//           <Icon className="h-4 w-4" />
//         </div>

//         <ArrowRight className="h-3.5 w-3.5 text-[var(--muted-foreground)] opacity-0 transition-opacity group-hover:opacity-100" />
//       </div>

//       <h3 className="text-2xl font-bold text-[var(--foreground)]">{value}</h3>

//       <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
//         {title}
//       </p>
//     </div>
//   );
// }

// function TableHead({ children }: { children: React.ReactNode }) {
//   return (
//     <th className="whitespace-nowrap px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
//       {children}
//     </th>
//   );
// }

// function RoleBadge({ role }: { role: string }) {
//   const styles: Record<string, string> = {
//     OWNER:
//       "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
//     INCHARGE:
//       "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
//     EMPLOYEE:
//       "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
//   };

//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
//         styles[role] ??
//         "bg-[var(--background)] border-[var(--border)] text-[var(--muted-foreground)]"
//       }`}
//     >
//       <BadgeCheck className="h-3 w-3" />
//       {role}
//     </span>
//   );
// }

// function StatusBadge({ status }: { status: string }) {
//   const styles: Record<string, string> = {
//     ACTIVE:
//       "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
//     PENDING_APPROVAL:
//       "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
//     PENDING_EMAIL:
//       "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
//     REJECTED:
//       "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
//     SUSPENDED:
//       "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400",
//   };

//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
//         styles[status] ??
//         "bg-[var(--background)] border-[var(--border)] text-[var(--muted-foreground)]"
//       }`}
//     >
//       <CircleDot className="h-3 w-3" />
//       {status.replaceAll("_", " ")}
//     </span>
//   );
// }



import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  Building2,
  Mail,
  ShieldCheck,
  UserCheck,
  UserCog,
  Users,
  CircleDot,
  Fingerprint,
  Phone,
  Crown,
  Activity,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";

import { getDepartmentDetails } from "@/actions/owner/get-department-details";

// ============================================================================
// TYPES & HELPER FUNCTIONS (UNCHANGED)
// ============================================================================

type DepartmentUser = {
  id?: string;
  _id?: string;
  fullName: string;
  username?: string | null;
  email?: string | null;
  phone?: string | null;
  role: string;
  status: string;
  employeeCode?: string | null;
  profileImageUrl?: string | null;
};

type DepartmentDetails = {
  id?: string;
  _id?: string;
  name: string;
  type: string;
  users: DepartmentUser[];
};

function getInitials(name?: string | null) {
  if (!name) return "U";

  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function getIdLabel(role?: string | null) {
  if (role === "OWNER") return "Owner ID";
  if (role === "INCHARGE") return "Incharge ID";
  return "Employee ID";
}

function getDisplayCode(user: { employeeCode?: string | null }) {
  return user.employeeCode || "Not Generated";
}

function getRoleSubtitle(role?: string | null) {
  if (role === "OWNER") return "System Owner";
  if (role === "INCHARGE") return "Department Manager";
  return "Department Employee";
}

function getSafeProfileImageUrl(url?: string | null) {
  if (!url) return null;
  const trimmedUrl = String(url).trim();
  if (!trimmedUrl) return null;
  return trimmedUrl;
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const department = (await getDepartmentDetails(
    id
  )) as DepartmentDetails | null;

  if (!department) {
    notFound();
  }

  // --------------------------------------------------------------------------
  // LOGIC (UNCHANGED)
  // --------------------------------------------------------------------------
  const users = department.users || [];
  const totalUsers = users.length;
  const owners = users.filter((user: DepartmentUser) => user.role === "OWNER").length;
  const employees = users.filter((user: DepartmentUser) => user.role === "EMPLOYEE").length;
  const incharges = users.filter((user: DepartmentUser) => user.role === "INCHARGE").length;
  const activeUsers = users.filter((user: DepartmentUser) => user.status === "ACTIVE").length;
  const pendingUsers = users.filter(
    (user: DepartmentUser) =>
      user.status === "PENDING_APPROVAL" || user.status === "PENDING_EMAIL"
  ).length;

  const activeRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-6 px-4 py-8 pt-20 sm:gap-8 sm:px-5 sm:py-12 md:pt-24 lg:px-6">
      
      {/* ========================================== */}
      {/* HEADER SECTION                             */}
      {/* ========================================== */}
      <header className="flex flex-col gap-5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-5 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
          <Link
            href="/owner/departments"
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Directory
          </Link>

          <div className="inline-flex items-center gap-1.5 rounded-md bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--primary)] sm:text-xs">
            <Building2 className="h-3 w-3 shrink-0" />
            <span>Department Control Center</span>
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            {department.name}
          </h1>

          <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">
            View department members, employee IDs, incharge details, account status, and role distribution from one professional control panel.
          </p>
        </div>

        {/* Compact Right-Side Info Widget */}
        <div className="flex w-full shrink-0 flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 sm:w-64 md:p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Department Type
              </span>
              <span className="mt-0.5 text-sm font-semibold text-[var(--foreground)]">
                {department.type.replaceAll("_", " ")}
              </span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--primary)]/10 text-[var(--primary)]">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider">
              <span className="text-[var(--muted-foreground)]">Active Rate</span>
              <span className="text-[var(--foreground)] font-semibold">{activeRate}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full border border-[var(--border)]/50 bg-[var(--card)]">
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-all duration-700 ease-in-out"
                style={{ width: `${activeRate}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* METRICS GRID                               */}
      {/* ========================================== */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        <SummaryCard title="Total Users" value={totalUsers} icon={Users} tone="blue" />
        <SummaryCard title="Owners" value={owners} icon={Crown} tone="amber" />
        <SummaryCard title="Employees" value={employees} icon={UserCheck} tone="emerald" />
        <SummaryCard title="Incharges" value={incharges} icon={UserCog} tone="purple" />
        <SummaryCard title="Active" value={activeUsers} icon={ShieldCheck} tone="green" />
        <SummaryCard title="Pending" value={pendingUsers} icon={Activity} tone="orange" />
      </section>

      {/* ========================================== */}
      {/* TABLE SECTION                              */}
      {/* ========================================== */}
      <section className="mt-2 flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm sm:mt-4">
        <div className="flex flex-col gap-3 border-b border-[var(--border)] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)] sm:text-lg">
              Department Members
            </h2>
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)] sm:text-sm">
              Employees, incharges, and active accounts assigned to this department.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <BadgeItem label="Members" value={totalUsers} />
            <BadgeItem label="Active" value={activeUsers} />
            <BadgeItem label="Pending" value={pendingUsers} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-[var(--background)]">
              <tr>
                <TableHead>Member</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Department</TableHead>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--border)]">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--muted-foreground)]">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)]">
                      <Users className="h-5 w-5 text-[var(--muted-foreground)]" />
                    </div>
                    <p className="text-sm font-medium">No users assigned to this department yet.</p>
                  </td>
                </tr>
              ) : (
                users.map((user: DepartmentUser) => (
                  <MemberRow
                    key={String(user.id || user._id || user.email)}
                    user={user}
                    department={department}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function MemberRow({
  user,
  department,
}: {
  user: DepartmentUser;
  department: {
    name: string;
    type: string;
  };
}) {
  const visibleCode = getDisplayCode(user);
  const visibleIdLabel = getIdLabel(user.role);
  const imageUrl = getSafeProfileImageUrl(user.profileImageUrl);

  return (
    <tr className="group transition-colors hover:bg-[var(--background)]/50">
      <td className="px-4 py-3 sm:px-5 sm:py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[var(--border)] bg-[var(--background)] text-[10px] font-bold text-[var(--foreground)] shadow-sm">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={user.fullName || "User"}
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials(user.fullName)
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)] text-sm">
              {user.fullName || "Unknown User"}
            </p>
            <p className="truncate text-[11px] font-medium text-[var(--muted-foreground)]">
              {user.username ? `@${user.username}` : getRoleSubtitle(user.role)}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3 sm:px-5 sm:py-3.5">
        <div className="min-w-0">
          <p className="mb-0.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            <Fingerprint className="h-3 w-3 text-[var(--primary)]" />
            {visibleIdLabel}
          </p>
          <p className="truncate font-mono text-xs font-semibold text-[var(--foreground)] sm:text-sm">
            {visibleCode}
          </p>
        </div>
      </td>

      <td className="px-4 py-3 sm:px-5 sm:py-3.5">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)]">
            <Mail className="h-3.5 w-3.5 shrink-0 opacity-70" />
            <span className="truncate">{user.email || "No Email"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)]">
            <Phone className="h-3.5 w-3.5 shrink-0 opacity-70" />
            <span className="truncate">{user.phone || "Not Provided"}</span>
          </div>
        </div>
      </td>

      <td className="px-4 py-3 sm:px-5 sm:py-3.5 whitespace-nowrap">
        <RoleBadge role={user.role || "EMPLOYEE"} />
      </td>

      <td className="px-4 py-3 sm:px-5 sm:py-3.5 whitespace-nowrap">
        <StatusBadge status={user.status || "PENDING_APPROVAL"} />
      </td>

      <td className="px-4 py-3 sm:px-5 sm:py-3.5 whitespace-nowrap">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] shadow-sm">
          <Building2 className="h-3 w-3 text-[var(--primary)]" />
          <span className="truncate max-w-[120px]">{department.name}</span>
        </span>
      </td>
    </tr>
  );
}

function BadgeItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-xs font-semibold text-[var(--foreground)] shadow-sm">
      <span className="text-[var(--muted-foreground)] mr-1">{label}:</span>
      {value}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  tone: "blue" | "emerald" | "purple" | "amber" | "green" | "orange";
}) {
  const styles: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    green: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  };

  return (
    <div className="group relative flex min-w-0 flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5 sm:p-4 transition-all duration-200 hover:-translate-y-[1px] hover:border-[var(--primary)]/30 hover:shadow-sm">
      <div className="mb-3 flex items-start justify-between sm:mb-4">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border sm:h-9 sm:w-9 ${styles[tone]}`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-[var(--muted-foreground)] opacity-100 transition-all duration-200 group-hover:text-[var(--primary)] md:opacity-0 md:group-hover:opacity-100" />
      </div>

      <div className="mt-auto min-w-0">
        <h2 className="truncate text-xl font-semibold leading-tight text-[var(--foreground)] sm:text-2xl">
          {value}
        </h2>
        <p className="mt-0.5 truncate text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          {title}
        </p>
      </div>
    </div>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="whitespace-nowrap px-4 py-3 sm:px-5 sm:py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
      {children}
    </th>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    OWNER: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
    INCHARGE: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
    EMPLOYEE: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
        styles[role] ?? "bg-[var(--background)] border-[var(--border)] text-[var(--muted-foreground)]"
      }`}
    >
      <BadgeCheck className="h-3 w-3" />
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
    PENDING_APPROVAL: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
    PENDING_EMAIL: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
    REJECTED: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
    SUSPENDED: "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
        styles[status] ?? "bg-[var(--background)] border-[var(--border)] text-[var(--muted-foreground)]"
      }`}
    >
      <CircleDot className="h-3 w-3" />
      {status.replaceAll("_", " ")}
    </span>
  );
}