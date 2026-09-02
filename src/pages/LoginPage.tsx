import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";

function LoginPage() {
  const [name, setName] = useState<string>("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (): void => {
    const trimmedName = name.trim();

    if (trimmedName === "") {
      return;
    }

    login(trimmedName);
    navigate("/claims");
  };

  return (
    <div className="mx-auto max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Login
      </h1>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleLogin();
        }}
      >
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Your name
        </label>
        <input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          className="w-full rounded border border-gray-300 bg-white p-2 text-gray-900 placeholder-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={name.trim() === ""}
          className="mt-3 rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
