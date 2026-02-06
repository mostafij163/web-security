import { redirect } from "next/navigation";
import usersData from "@/data/users.json";

async function loginAction(formData: FormData) {
  "use server";

  const username = formData.get("username") as string | null;
  const password = formData.get("password") as string | null;

  if (!username?.trim() || !password) {
    redirect("/?error=missing");
  }

  const user = usersData.users.find(
    (u) => u.username === username.trim() && u.password === password
  );

  if (!user) {
    redirect("/?error=invalid");
  }

  redirect("/dashboard");
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  const errorMessage =
    params.error === "missing"
      ? "Please enter both username and password."
      : params.error === "invalid"
        ? "Invalid username or password."
        : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900">
      <form
        action={loginAction}
        className="flex w-full max-w-sm flex-col gap-6 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
      >
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Sign in
        </h1>
        {errorMessage && (
          <p
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="username"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-400"
            placeholder="Enter your username"
            autoComplete="username"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-400"
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2.5 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
