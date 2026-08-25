import { redirect } from "next/navigation";
import { ShieldCheck, Key, Lock } from "lucide-react";

import { getCurrentUser } from "@/lib/current-user";
import { getMyProfile } from "@/actions/profile/get-my-profile";
import ProfileMediaEditor from "@/components/profile/profile-media-editor";
import ProfileDetailsEditor from "@/components/profile/profile-details-editor";
import LogoutButton from "@/components/auth/logout-button";
import { Role } from "@/constants/enums";

export default async function InchargeProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role !== Role.INCHARGE) {
    redirect("/unauthorized");
  }

  const user = await getMyProfile();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-4 px-4 py-5 pt-20 sm:gap-5 sm:px-5 md:pt-24 lg:px-6">
      
      {/* ========================================== */}
      {/* 1. COMPACT HEADER                          */}
      {/* ========================================== */}
      <header className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
            <ShieldCheck className="h-3 w-3 shrink-0" />
            <span>Incharge Profile</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            Profile Settings
          </h1>
          <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">
            Manage your personal information, media, and account security.
          </p>
        </div>
      </header>

      {/* ========================================== */}
      {/* 2. DENSE LAYOUT GRID                       */}
      {/* ========================================== */}
      <div className="mt-1 grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-5">
        
        {/* Left Column: Editable Forms */}
        <div className="flex flex-col gap-4 lg:col-span-2 lg:gap-5">
          {/* Note: Ensure these components internally follow the new compact border/padding system (rounded-xl, p-4 sm:p-5) */}
          <ProfileMediaEditor user={user} />
          <ProfileDetailsEditor user={user} />
        </div>

        {/* Right Column: Read-Only System Data & Actions */}
        <aside className="flex flex-col gap-4 lg:gap-5">
          
          {/* Read-Only: System Identity */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-[var(--foreground)]">
                System Identity
              </h3>
              <Lock className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
            </div>
            
            <div className="flex flex-col gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)]/50 p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[var(--muted-foreground)]">Role</span>
                <span className="rounded bg-[var(--primary)]/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">
                  {user.role || "INCHARGE"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[var(--muted-foreground)]">Employee ID</span>
                <span className="font-mono text-[12px] font-semibold text-[var(--foreground)]">
                  {user.employeeCode || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[var(--muted-foreground)]">Email Address</span>
                <span className="text-[12px] font-semibold text-[var(--foreground)] truncate max-w-[150px]">
                  {user.email || "N/A"}
                </span>
              </div>
              <div className="mt-1 border-t border-[var(--border)]/60 pt-2 text-[10px] text-[var(--muted-foreground)] leading-tight">
                These core identity fields are locked. Contact system administration for changes.
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-5">
            <h3 className="mb-3 text-[13px] font-semibold text-[var(--foreground)]">
              Account Status
            </h3>
            <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--background)]/50 p-3 shadow-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-500/10">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-[var(--foreground)]">
                  Active & Verified
                </span>
                <span className="text-[11px] text-[var(--muted-foreground)]">
                  Incharge privileges active.
                </span>
              </div>
            </div>
          </div>

          {/* Security & Actions */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-5">
            <h3 className="mb-3 text-[13px] font-semibold text-[var(--foreground)]">
              Security
            </h3>
            <div className="flex flex-col gap-2">
              <button className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 text-[13px] font-medium text-amber-600 shadow-sm transition-colors hover:bg-amber-500 hover:text-white dark:text-amber-500 dark:hover:text-white">
                <Key className="h-3.5 w-3.5 shrink-0" />
                Change Password
              </button>

              {/* Ensure LogoutButton component internally renders a compact button */}
              <div className="w-full *:w-full">
                <LogoutButton />
              </div>
            </div>
          </div>
          
        </aside>
      </div>
    </div>
  );
}