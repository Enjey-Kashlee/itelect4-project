import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, register as registerAccount } from "../api/client";
import useAuthStore from "../store/authStore";
import type { RegisterBody } from "../types/index";

function LoginPage({ registering = false }: { registering?: boolean }) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterBody>();
  const auth = useMutation({
    mutationFn: async (values: RegisterBody) => {
      if (registering) {
        await registerAccount(values);
        try {
          return await login({
            email: values.email,
            password: values.password,
          });
        } catch {
          throw new Error(
            "Account created, but automatic login failed. Use the login page to continue.",
          );
        }
      }
      return login({ email: values.email, password: values.password });
    },
    onSuccess: ({ token, user }) => {
      useAuthStore.getState().setSession(token, user);
      navigate("/claims", { replace: true });
    },
  });

  return (
    <div className="mx-auto max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        {registering ? "Create account" : "Login"}
      </h1>
      <form
        onSubmit={handleSubmit((values) => auth.mutate(values))}
        className="grid gap-4"
      >
        {registering && (
          <div className="grid gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              autoComplete="name"
              minLength={2}
              maxLength={80}
              required
              {...register("name", {
                required: "Enter your name.",
                minLength: { value: 2, message: "Use at least 2 characters." },
              })}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && (
              <p role="alert" className="text-sm text-red-700">
                {errors.name.message}
              </p>
            )}
          </div>
        )}
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            {...register("email", { required: "Enter your email." })}
            aria-invalid={Boolean(errors.email)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete={registering ? "new-password" : "current-password"}
            minLength={registering ? 8 : undefined}
            required
            {...register("password", {
              required: "Enter your password.",
              validate: (value) =>
                new TextEncoder().encode(value).length <= 72 ||
                "Use at most 72 UTF-8 bytes.",
            })}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <p
              id="password-error"
              role="alert"
              className="text-sm text-red-700"
            >
              {errors.password.message}
            </p>
          )}
          {registering && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              At least 8 characters, up to 72 UTF-8 bytes.
            </p>
          )}
        </div>
        {auth.isError && (
          <p role="alert" className="text-sm text-red-700 dark:text-red-300">
            {auth.error.message}
          </p>
        )}
        <Button type="submit" disabled={auth.isPending}>
          {auth.isPending
            ? "Please wait..."
            : registering
              ? "Create account"
              : "Log In"}
        </Button>
      </form>
      <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
        <Link className="underline" to={registering ? "/login" : "/register"}>
          {registering
            ? "Already have an account? Log in"
            : "Create an account"}
        </Link>
      </p>
    </div>
  );
}
export default LoginPage;
