"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/auth/logout";

export default function LogoutButton() {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logout();

      router.push("/login");

      router.refresh();
    });
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="rounded-xl bg-red-600 px-4 py-2 text-white"
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}