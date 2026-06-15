import { useEffect, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { authenticate, isAuthenticated } from "../lib/auth";

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      router.navigate({ to: "/" });
    }
  }, [router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    if (!authenticate(email.trim(), password)) {
      setError("Invalid email or password.");
      return;
    }

    router.navigate({ to: "/" });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#07101f] py-12 px-4 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-700 bg-[#0d1a2f]/95 p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white">Staff Login</h1>
        <p className="mt-2 text-sm text-slate-300">Enter your corporate email and password to continue.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none ring-emerald-500 focus:ring-2"
              placeholder="admin@etsmart.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none ring-emerald-500 focus:ring-2"
              placeholder="Enter your password"
            />
          </div>
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          <button
            type="submit"
            className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-[#0B192C] transition hover:bg-emerald-400"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/login copy")({
  head: () => ({
    meta: [
      { title: "Staff Login — ET Smart Wealth Gateway" },
      { name: "description", content: "Login to the ET Smart Wealth Gateway internal console." },
    ],
  }),
  component: LoginPage,
});
