"use client";

import { useState } from "react";
import { supabase } from "@/lib/createClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SweetAlertProvider, {
  showSuccess,
  showError,
  showWarning,
} from "@/components/SweetAlert";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError("");

    if (!email) {
      setError("Email is required");
      setIsSending(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsSending(false);
      return;
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`, // Adjust if using custom reset page
    });

    if (error) {
      setError(error.message);
    } else {
      showSuccess("Password reset link sent. Please check your email.");
    }

    setIsSending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <SweetAlertProvider />
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
          Forgot Password
        </h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSending}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-50"
          >
            {isSending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-black dark:text-white hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
