"use client";

import { useState } from "react";
import { supabase } from "@/lib/createClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";

export default function Login() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("user");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  const userEmail = process.env.NEXT_PUBLIC_USER_EMAIL;
  const userPassword = process.env.NEXT_PUBLIC_USER_PASSWORD;

  useEffect(() => {
    handleTabSwitch(activeTab);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleTabSwitch = (tab) => {
    const credentials =
      tab === "user"
        ? { email: userEmail, password: userPassword }
        : { email: adminEmail, password: adminPassword };

    setFormData(credentials);
    setActiveTab(tab);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    setTimeout(async () => {
      if (activeTab === "admin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        router.push("/admin/dashboard");
      } else {
        if (activeTab === "user") {
          const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });
          if (error) throw error;
          router.push("/user/dashboard");
        } else {
          setError("Password must be at least 6 characters long");
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black dark:text-white">

<div className="mt-6 text-left">
  <Link
    href="/"
    className="text-sm text-black dark:text-white hover:underline flex items-center gap-1"
  >
    <FiArrowLeft /> Back
  </Link>
</div>


              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sign in to your account
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "user"
                  ? "bg-white dark:bg-gray-600 text-black dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
              }`}
              onClick={() => handleTabSwitch("user")}
            >
              User Login
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "admin"
                  ? "bg-white dark:bg-gray-600 text-black dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
              }`}
              onClick={() => handleTabSwitch("admin")}
            >
              Admin Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black dark:text-white mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black dark:text-white mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                placeholder="Enter your password"
                required
              />
              <div className="mt-2 text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-2 px-4 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading
                ? "Signing in..."
                : `Sign in as ${activeTab === "admin" ? "Admin" : "User"}`}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-black dark:text-white hover:underline font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
