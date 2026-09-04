"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  UserRoundPlus,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterPage() {
  const router = useRouter();
  const { loginUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();

    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!phone) {
      setError("Please enter your phone number.");
      return;
    }

    if (!form.password) {
      setError("Please enter a password.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.terms) {
      setError("Please agree to the Terms and Privacy Policy.");
      return;
    }

    if (!API_BASE_URL) {
      setError("API URL is not configured.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        {
          name,
          email,
          phone,
          password: form.password,
          password_confirmation: form.confirmPassword,
        }
      );

      const data = response?.data;

      if (!data?.success) {
        setError(
          data?.message ||
            data?.error ||
            "Registration failed. Please try again."
        );
        return;
      }

      if (data?.token) {
        loginUser({
          token: data.token,
          user: data.user ?? null,
        });

        router.push("/account");
        return;
      }

      setSuccess(
        data?.message ||
          "Account created successfully. Please login."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        terms: false,
      });

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);

      const responseData = err?.response?.data;

      let message =
        responseData?.message ||
        responseData?.error ||
        err?.message ||
        "Unable to create your account.";

      if (responseData?.errors) {
        const validationErrors = responseData.errors;

        if (
          typeof validationErrors === "object" &&
          validationErrors !== null
        ) {
          const firstError = Object.values(
            validationErrors
          )?.[0];

          if (Array.isArray(firstError)) {
            message = firstError[0];
          } else if (typeof firstError === "string") {
            message = firstError;
          }
        }
      }

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-0 py-0">

      <div className="mx-auto grid min-h-screen max-w-[1450px] grid-cols-1 lg:grid-cols-2">
        <div className="relative hidden min-h-screen overflow-hidden lg:block">
          <img
            src="https://www.cost2costsupplement.com/storage/other-banners/login-img-1.png"
            alt="Cost2Cost Supplement"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/5" />
        </div>

        <div className="flex min-h-screen items-start justify-center bg-[#f8f9fa] px-6 py-10 sm:px-10 lg:px-16 xl:px-20">
          <div className="w-full max-w-[590px]">
            <div className="mb-10 flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-white">
                <UserRoundPlus
                  size={29}
                  strokeWidth={1.8}
                  className="text-[#171717]"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[#0b0b0b] sm:text-3xl">
                  Register an account
                </h1>

                <p className="mt-4 max-w-[500px] text-base leading-7 text-[#666]">
                  Your personal data will be used to support your
                  experience throughout this website, to manage access
                  to your account.
                </p>
              </div>
            </div>

            <div className="mb-10 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#ddd]" />
            </div>

            <p className="mb-8 text-center text-sm text-[#555]">
              Register with Account Credentials
            </p>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#E52323]">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-base text-[#444]">
                  Full name{" "}
                  <span className="text-[#E52323]">*</span>
                </label>

                <div className="relative">
                  <User
                    size={21}
                    strokeWidth={1.7}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]"
                  />

                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    autoComplete="name"
                    className="h-[54px] w-full rounded-xl border border-[#e4dcff] bg-white pl-14 pr-4 text-base outline-none transition focus:border-[#E52323] focus:ring-1 focus:ring-[#E52323]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-base text-[#444]">
                  Email{" "}
                  <span className="text-[#E52323]">*</span>
                </label>

                <div className="relative">
                  <Mail
                    size={21}
                    strokeWidth={1.7}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]"
                  />

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                    required
                    autoComplete="email"
                    className="h-[54px] w-full rounded-xl border border-[#e4dcff] bg-white pl-14 pr-4 text-base outline-none transition focus:border-[#E52323] focus:ring-1 focus:ring-[#E52323]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-base text-[#444]">
                  Phone{" "}
                  <span className="text-[#E52323]">*</span>
                </label>

                <div className="relative">
                  <Phone
                    size={21}
                    strokeWidth={1.7}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]"
                  />

                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    className="h-[54px] w-full rounded-xl border border-[#e4dcff] bg-white pl-14 pr-4 text-base outline-none transition focus:border-[#E52323] focus:ring-1 focus:ring-[#E52323]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-base text-[#444]">
                  Password{" "}
                  <span className="text-[#E52323]">*</span>
                </label>

                <div className="relative">
                  <Lock
                    size={21}
                    strokeWidth={1.7}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]"
                  />

                  <input
                    name="password"
                    type={
                      showPassword ? "text" : "password"
                    }
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="h-[54px] w-full rounded-xl border border-[#e4dcff] bg-white pl-14 pr-14 text-base outline-none transition focus:border-[#E52323] focus:ring-1 focus:ring-[#E52323]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-black"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={21} />
                    ) : (
                      <Eye size={21} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-base text-[#444]">
                  Password confirmation{" "}
                  <span className="text-[#E52323]">*</span>
                </label>

                <div className="relative">
                  <Lock
                    size={21}
                    strokeWidth={1.7}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]"
                  />

                  <input
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Password confirmation"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="h-[54px] w-full rounded-xl border border-[#e4dcff] bg-white pl-14 pr-14 text-base outline-none transition focus:border-[#E52323] focus:ring-1 focus:ring-[#E52323]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-black"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password confirmation"
                        : "Show password confirmation"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={21} />
                    ) : (
                      <Eye size={21} />
                    )}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-2 pt-1 text-sm text-[#444]">
                <input
                  name="terms"
                  type="checkbox"
                  checked={form.terms}
                  onChange={handleChange}
                  className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[#222]"
                />

                <span>
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="underline hover:text-[#E52323]"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="underline hover:text-[#E52323]"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="group mt-1 flex h-[62px] w-full items-center justify-center gap-2 rounded-xl border border-[#E52323] bg-[#292929] text-base font-medium text-white transition hover:bg-[#E52323] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  "Registering..."
                ) : (
                  <>
                    Register
                    <ArrowRight
                      size={20}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-base text-[#555]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-[#222] underline underline-offset-2 hover:text-[#E52323]"
              >
                Login now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}