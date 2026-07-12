import { redirect } from "next/navigation";
import { ShieldCheck, Key } from "lucide-react";

import { getCurrentUser } from "@/lib/current-user";
import { getMyProfile } from "@/actions/profile/get-my-profile";
import ProfileMediaEditor from "@/components/profile/profile-media-editor";
import ProfileDetailsEditor from "@/components/profile/profile-details-editor";
import LogoutButton from "@/components/auth/logout-button";
import { Role } from "@/constants/enums";

export default async function EmployeeProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role !== Role.EMPLOYEE) {
    redirect("/unauthorized");
  }

  const user = await getMyProfile();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 pt-28 pb-24 lg:px-12 lg:pt-32 max-w-[1400px] mx-auto space-y-10">
      <header className="relative overflow-hidden rounded-[36px] border border-[var(--border)] bg-[var(--card)]/45 p-8 shadow-sm backdrop-blur-xl lg:p-10">
        <div className="pointer-events-none absolute right-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-[var(--primary)]/10 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-[-130px] left-[20%] h-[280px] w-[280px] rounded-full bg-purple-500/10 blur-[90px]" />

        <div className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-[var(--primary)]">
            <ShieldCheck className="h-4 w-4" />
            Employee Profile
          </div>

          <h1 className="mb-3 text-4xl font-black tracking-tight text-[var(--foreground)] lg:text-5xl">
            Profile Settings
          </h1>

          <p className="max-w-2xl text-sm font-medium leading-7 text-[var(--muted-foreground)]">
            Manage your profile picture, cover layer, identity details and
            account security.
          </p>
        </div>
      </header>

      <ProfileMediaEditor user={user} />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProfileDetailsEditor user={user} />
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
            <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-[var(--foreground)]">
              Account Status
            </h3>

            <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />

              <div>
                <span className="block text-sm font-black text-[var(--foreground)]">
                  Account Active
                </span>

                <span className="text-xs font-semibold text-[var(--muted-foreground)]">
                  Your employee account is verified.
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
            <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-[var(--foreground)]">
              Security
            </h3>

            <div className="space-y-3">
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm font-bold text-amber-500 transition-all hover:bg-amber-500 hover:text-white">
                <Key className="h-4 w-4" />
                Change Password
              </button>

              <LogoutButton />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}