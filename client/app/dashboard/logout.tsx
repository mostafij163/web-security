"use client";

import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  function handleLogout() {
    router.push("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900">
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-xl bg-zinc-900 px-12 py-5 text-xl font-semibold text-white shadow-md transition-colors hover:bg-zinc-800 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Logout
      </button>
    </div>
  );
}
