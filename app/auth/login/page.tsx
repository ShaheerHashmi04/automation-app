"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage("Check your email to confirm your account!");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push("/chat");
      }
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8 hover:opacity-70 transition-opacity">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 1L11.5 6.5H17L12.5 10L14.5 16L9 12.5L3.5 16L5.5 10L1 6.5H6.5L9 1Z" fill="white" />
        </svg>
        <span className="text-sm font-medium text-white">AutoConsult</span>
      </Link>

      {/* Card */}
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-lg font-medium text-gray-900 mb-1">
          {isSignUp ? "Create an account" : "Welcome back"}
        </h1>
        <p className="text-xs text-gray-500 mb-6">
          {isSignUp ? "Sign up to save your automation plans" : "Sign in to your account"}
        </p>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="you@example.com"
              className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
              className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {message && (
            <p className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
              {message}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gray-900 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-gray-700 disabled:opacity-50 transition-colors mt-1"
          >
            {loading ? "Loading..." : isSignUp ? "Create account" : "Sign in"}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }}
            className="text-gray-900 font-medium hover:underline"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}