"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="
      flex
      w-full
      items-center
      justify-center
      gap-2
      rounded-xl
      bg-red-600
      px-4
      py-3
      text-white
      transition
      hover:bg-red-700
      "
    >
      Logout
    </button>
  );
}