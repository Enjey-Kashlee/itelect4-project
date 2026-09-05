import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        <Label
          htmlFor="name"
          className="mb-2 text-foreground"
        >
          Your name
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
        />
        <Button
          type="submit"
          disabled={name.trim() === ""}
          className="mt-3"
        >
          Log In
        </Button>
      </form>
    </div>
  );
}

export default LoginPage;
