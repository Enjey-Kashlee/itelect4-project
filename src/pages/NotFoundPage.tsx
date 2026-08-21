import { Link } from "react-router";

function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center text-gray-900 dark:bg-gray-900 dark:text-white">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Error 404
      </p>
      <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-300">
        The page you requested does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
      >
        Back to dashboard
      </Link>
    </main>
  );
}

export default NotFoundPage;
