"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "./store-provider";
import { Spinner } from "./ui";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser, toast } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";
  const next = searchParams.get("next") ?? "/";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch(`/api/auth/${isLogin ? "login" : "register"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isLogin ? { email, password } : { name, email, password }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }
    await refreshUser();
    toast("👋", isLogin ? `Welcome back, ${data.user.name.split(" ")[0]}!` : "Account created — welcome!");
    router.push(data.user.role === "ADMIN" && next === "/" ? "/admin" : next);
    router.refresh();
  };

  const fillDemo = (kind: "admin" | "user") => {
    setEmail(kind === "admin" ? "admin@pixelvault.dev" : "user@pixelvault.dev");
    setPassword(kind === "admin" ? "Admin123!" : "User123!");
  };

  return (
    <div className="relative flex min-h-[calc(100vh-61px)] items-center justify-center overflow-hidden px-6 py-16">
      <div className="orb -right-32 top-0 h-[500px] w-[500px] animate-pulse-slow bg-violet-brand/15" />
      <div className="orb -left-32 bottom-0 h-[400px] w-[400px] bg-cyan-brand/10" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="gradient-ring glass relative w-full max-w-md rounded-3xl p-8 sm:p-10"
      >
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {isLogin ? (
            <>Welcome <span className="text-gradient">back</span></>
          ) : (
            <>Join the <span className="text-gradient">vault</span></>
          )}
        </h1>
        <p className="mt-2 text-sm text-fog-2">
          {isLogin
            ? "Sign in to access your downloads, requests and wishlist."
            : "Create a free account to buy assets and commission custom work."}
        </p>

        <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
          {!isLogin && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              required
              minLength={2}
              className="field"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="field"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isLogin ? "Password" : "Password (min 8 characters)"}
            required
            minLength={isLogin ? 1 : 8}
            className="field"
          />

          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary !py-3">
            {loading && <Spinner />}
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {isLogin && (
          <div className="mt-5 rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-fog-2">
              Demo accounts
            </p>
            <div className="flex gap-2">
              <button onClick={() => fillDemo("user")} className="btn-outline flex-1 !py-1.5 !text-xs">
                👤 Customer
              </button>
              <button onClick={() => fillDemo("admin")} className="btn-outline flex-1 !py-1.5 !text-xs">
                ⚡ Admin
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-fog-2">
          {isLogin ? (
            <>
              New to PixelVault?{" "}
              <Link href="/register" className="font-semibold text-purple-brand hover:underline">
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already a member?{" "}
              <Link href="/login" className="font-semibold text-purple-brand hover:underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
}
