"use client";
import { supabase } from "@/lib/createClient";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    whatsapp: "",
    carNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const validatePakistaniNumber = (number) => {
    // Pakistani mobile number format: +92XXXXXXXXXX or 03XXXXXXXXX
    const pakistaniNumberRegex = /^(\+92|0)?3[0-9]{9}$/;
    return pakistaniNumberRegex.test(number.replace(/\s|-/g, ""));
  };

  const validateCarNumber = (carNumber) => {
    // Pakistani car number format: ABC-123 (3 letters, dash, 3 numbers)
    const carNumberRegex = /^[A-Z]{3}-[0-9]{3}$/;
    return carNumberRegex.test(carNumber.toUpperCase());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "carNumber") {
      // Auto-format car number
      let formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (formattedValue.length > 3) {
        formattedValue =
          formattedValue.slice(0, 3) + "-" + formattedValue.slice(3, 6);
      }
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else if (name === "whatsapp") {
      // Auto-format Pakistani number
      let formattedValue = value.replace(/[^0-9+]/g, "");
      if (formattedValue.startsWith("0")) {
        formattedValue = "+92" + formattedValue.slice(1);
      } else if (!formattedValue.startsWith("+92")) {
        formattedValue = "+92" + formattedValue;
      }
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!formData.whatsapp) {
      newErrors.whatsapp = "WhatsApp number is required";
    } else if (!validatePakistaniNumber(formData.whatsapp)) {
      newErrors.whatsapp =
        "Please enter a valid Pakistani mobile number (e.g., +923001234567 or 03001234567)";
    }

    if (!formData.carNumber.trim()) {
      newErrors.carNumber = "Car number is required";
    } else if (!validateCarNumber(formData.carNumber)) {
      newErrors.carNumber =
        "Please enter a valid car number in format: ABC-123 (3 letters, dash, 3 numbers)";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsLoading(false);
      return;
    }

    setTimeout(async () => {
      console.log("User registered:", formData);
      const userData = {
        ...formData,
      };
      console.log("User data to be inserted:", userData.email);
      console.log("User data to be inserted:", userData.carNumber);
      console.log("User data to be inserted:", userData.whatsapp);
      console.log("User data to be inserted:", userData.name);
      console.log("User data to be inserted:", userData.password);

      try {
        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
        });
        if (error) throw error;
        if (data) {
          console.log(data);
          insertData(data, userData);
        }
      } catch (error) {
        console.error("Error signing up:", error.message);
      } finally {
        setIsLoading(false);
      }
      router.push("/user/dashboard");
    }, 1500);
  };

  async function insertData(data, userData) {
    console.log("Inserting user data:", data);
    const lowerEmail = data.user.email.toLowerCase();
    const isAdmin =
      lowerEmail.includes("admin") || lowerEmail.includes("manager");
    try {
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .insert({
          userId: data.user.id,
          email: userData.email,
          role: isAdmin ? "admin" : "user",
          fullName: userData.name,
          carNum: userData.carNumber,
          whatsapp: userData.whatsapp,
        })
        .select();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Join ParkEase and secure your parking spot
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-black dark:text-white mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700 ${
                  errors.name
                    ? "border-red-300"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter your full name"
                required
              />
              {errors.name && (
                <span className="text-red-600 dark:text-red-400 text-sm mt-1">
                  {errors.name}
                </span>
              )}
            </div>

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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700 ${
                  errors.email
                    ? "border-red-300"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter your email"
                required
              />
              {errors.email && (
                <span className="text-red-600 dark:text-red-400 text-sm mt-1">
                  {errors.email}
                </span>
              )}
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700 ${
                  errors.password
                    ? "border-red-300"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Create a password"
                required
              />
              {errors.password && (
                <span className="text-red-600 dark:text-red-400 text-sm mt-1">
                  {errors.password}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="whatsapp"
                className="block text-sm font-medium text-black dark:text-white mb-2"
              >
                WhatsApp Number
              </label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700 ${
                  errors.whatsapp
                    ? "border-red-300"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="+923001234567 or 03001234567"
                required
              />
              {errors.whatsapp && (
                <span className="text-red-600 dark:text-red-400 text-sm mt-1">
                  {errors.whatsapp}
                </span>
              )}
              <small className="text-gray-600 dark:text-gray-400">
                Pakistani mobile number for confirmation
              </small>
            </div>

            <div>
              <label
                htmlFor="carNumber"
                className="block text-sm font-medium text-black dark:text-white mb-2"
              >
                Car Number
              </label>
              <input
                type="text"
                id="carNumber"
                name="carNumber"
                value={formData.carNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700 ${
                  errors.carNumber
                    ? "border-red-300"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="ABC-123 (3 letters, dash, 3 numbers)"
                maxLength={7}
                required
              />
              {errors.carNumber && (
                <span className="text-red-600 dark:text-red-400 text-sm mt-1">
                  {errors.carNumber}
                </span>
              )}
              <small className="text-gray-600 dark:text-gray-400">
                Format: ABC-123 (e.g., KHI-123, LHR-456)
              </small>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-2 px-4 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-black dark:text-white hover:underline font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
