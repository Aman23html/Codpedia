"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Role, User, UserStatus } from "@prisma/client";

import { updateUser } from "@/actions/owner/update-user";

interface Props {
  user: User;
}

export function UserRowActions({ user }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const [isPending, startTransition] = useTransition();

  const [role, setRole] = useState<Role>(user.role);

  const [status, setStatus] = useState<UserStatus>(
    user.status
  );

  function handleSave() {
    startTransition(async () => {
      try {
        await updateUser(user.id, role, status);

        router.refresh();
        setMessage("User updated successfully");
      } catch (error) {
        console.error(error);
        alert("Failed to update user");
        setMessage("Failed to update user");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
        className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-white"
      >
        {Object.values(Role).map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(e) =>
          setStatus(e.target.value as UserStatus)
        }
        className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-white"
      >
        {Object.values(UserStatus).map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>

      <button
        onClick={handleSave}
        disabled={isPending}
        className="rounded bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save"}
      </button>
    </div>
  );
}