"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Loader2,
  Phone,
  Save,
  User,
  AtSign,
  Info
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

  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex flex-col gap-1">
        <h2 className="text-[15px] font-semibold text-[var(--foreground)]">
          Personal Information
        </h2>
        <p className="text-[13px] text-[var(--muted-foreground)]">
          Update your contact details and preferred display name.
        </p>
      </div>

      <form action={handleSubmit} className="flex flex-col gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Editable Fields */}
          <EditableField
            icon={User}
            label="Full Name"
            name="fullName"
            defaultValue={user.fullName}
          />

          <EditableField
            icon={Phone}
            label="Phone Number"
            name="phone"
            defaultValue={user.phone || ""}
          />

          {/* Read-Only Secondary Fields */}
          <ReadOnlyField
            icon={AtSign}
            label="Username"
            value={`@${user.username || "username"}`}
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
        </div>

        <div className="mt-2 flex flex-col-reverse gap-3 border-t border-[var(--border)]/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            {message ? (
              <p className="text-[12px] font-medium text-[var(--foreground)]">
                {message}
              </p>
            ) : (
              <p className="flex items-center gap-1.5 text-[11px] text-[var(--muted-foreground)]">
                <Info className="h-3.5 w-3.5" />
                Email and department changes require admin approval.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 text-[13px] font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
          >
            {isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Save Changes
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
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--foreground)]">
        <Icon className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
        {label}
      </label>

      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required
        className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-[13px] font-medium text-[var(--foreground)] shadow-sm outline-none transition focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
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
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--foreground)]">
        <Icon className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
        {label}
      </label>

      <div className="flex h-9 w-full items-center rounded-lg border border-[var(--border)] bg-[var(--background)]/50 px-3 text-[13px] font-medium text-[var(--muted-foreground)] shadow-sm">
        {value}
      </div>
    </div>
  );
}