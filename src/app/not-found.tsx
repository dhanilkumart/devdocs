import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 dark:bg-zinc-950">
      <p className="text-sm font-medium text-sky-600 dark:text-sky-400">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Page not found</h1>
      <p className="mt-2 max-w-md text-center text-zinc-600 dark:text-zinc-400">
        That route does not exist. Try the search bar or return home.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        Back to home
      </Link>
    </div>
  );
}
