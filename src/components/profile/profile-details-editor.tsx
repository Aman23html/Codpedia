"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Building2,
  Calendar,
  Copy,
  Fingerprint,
  Loader2,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";

import { updateProfileDetails } from "@/actions/profile/update-profile-details";

type ProfileUser = {
  id: string;
  employeeCode: string | null;
  fullName: string;
  username: string | null;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  createdAt: Date;
  department: {
    name: string;
    type: string;
  } | null;
};

export default function ProfileDetailsEditor({ user }: { user: ProfileUser }) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function handleSubmit(formData: FormData) {
    setMessage("");

    startTransition(async () => {
      try {
        const result = await updateProfileDetails(formData);
        setMessage(result.message);
        router.refresh();
      } catch (error: any) {
        setMessage(error.message || "Failed to update profile.");
      }
    });
  }

  async function copyId() {
    await navigator.clipboard.writeText(user.employeeCode || "Not Generated");
    setMessage("Employee ID copied.");
  }

  const roleLabel = user.role === "INCHARGE" ? "Incharge ID" : "Employee ID";
    const displayCode = user.employeeCode || user.id;

  return (
    <section className="rounded-[32px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl lg:p-10">
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-[var(--primary)]/10 text-[var(--primary)]">
            <User className="h-8 w-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-[var(--foreground)]">
              Editable Identity Details
            </h2>

            <p className="mt-1 text-sm font-medium text-[var(--muted-foreground)]">
              You can update your name, email address and phone number.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={copyId}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-3 text-xs font-black uppercase tracking-widest text-[var(--foreground)] transition hover:border-[var(--primary)]/40"
        >
          <Copy className="h-4 w-4" />
          Copy ID
        </button>
      </div>

      <div className="mb-8 rounded-[24px] border border-[var(--primary)]/20 bg-[var(--primary)]/10 p-5">
        <p className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">
          <Fingerprint className="h-4 w-4" />
          {roleLabel}
        </p>

        <p className="break-all rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm font-black text-[var(--foreground)]">
          {displayCode}
        </p>
      </div>

      <form action={handleSubmit} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <EditableField
            icon={User}
            label="Full Name"
            name="fullName"
            defaultValue={user.fullName}
          />

          <EditableField
            icon={Mail}
            label="Email Address"
            name="email"
            type="email"
            defaultValue={user.email}
          />

          <EditableField
            icon={Phone}
            label="Phone Number"
            name="phone"
            defaultValue={user.phone || ""}
          />

          <ReadOnlyField
            icon={Building2}
            label="Department"
            value={user.department?.name || "Unassigned"}
          />

          <ReadOnlyField
            icon={Calendar}
            label="Member Since"
            value={new Date(user.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          />

          <ReadOnlyField
            icon={BadgeCheck}
            label="Account Status"
            value={user.status.replaceAll("_", " ")}
          />

          <ReadOnlyField
            icon={ShieldCheck}
            label="Role"
            value={user.role.replaceAll("_", " ")}
          />

          <ReadOnlyField
            icon={User}
            label="Username"
            value={`@${user.username || "username"}`}
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {message ? (
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
              {message}
            </p>
          ) : (
            <p className="text-sm font-medium text-[var(--muted-foreground)]">
              Department, role and username are controlled by the system.
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-6 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-[var(--primary)]/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Details
          </button>
        </div>
      </form>
    </section>
  );
}

function EditableField({
  icon: Icon,
  label,
  name,
  defaultValue,
  type = "text",
}: {
  icon: React.ElementType;
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </label>

      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required
        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm font-bold text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
      />
    </div>
  );
}

function ReadOnlyField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>

      <p className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-4 text-sm font-bold text-[var(--muted-foreground)]">
        {value}
      </p>
    </div>
  );
}