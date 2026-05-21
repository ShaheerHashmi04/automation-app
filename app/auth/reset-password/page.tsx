"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleReset = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated successfully! Redirecting...");
      setTimeout(() => router.push("/chat"), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6">

      <Link href="/" className="flex items-center gap-2 mb-8 hover:opacity-70 transition-opacity">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 1L11.5 6.5H17L12.5 10L14.5 16L9 12.5L3.5 16L5.5 10L1 6.5H6.5L9 1Z" fill="white" />
        </svg>
        <span className="text-sm font-medium text-white">AutoConsult</span>
      </Link>

      <div className="bg-white rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-lg font-medium text-gray-900 mb-1">Set a new password</h1>
        <p className="text-xs text-gray-500 mb-6">Enter your new password below</p>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            onClick={handleReset}
            disabled={loading}
            className="w-full bg-gray-900 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-gray-700 disabled:opacity-50 transition-colors mt-1"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </div>
      </div>
    </div>
  );
}