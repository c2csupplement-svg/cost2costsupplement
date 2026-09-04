"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [captcha] = useState({
    a: 5,
    b: 3,
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        {
          email: email.trim(),
          password,
        }
      );

      const data = response?.data;

      if (!data?.success || !data?.token) {
        setError(
          data?.message ||
            data?.error ||
            "Login failed. Please try again."
        );
        return;
      }

      loginUser({
        token: data.token,
        user: data.user ?? null,
      });

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      router.push("/account");
    } catch (err) {
      console.error("Login error:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Invalid email or password.";

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
            src="https://www.cost2costsupplement.com/storage/other-banners/login-img.png"
            alt="Cost2Cost Supplement"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/5" />
        </div>

        <div className="flex min-h-screen items-start justify-center bg-[#f8f9fa] px-6 py-10 sm:px-10 lg:px-16 xl:px-20">
          <div className="w-full max-w-[590px]">
            <div className="mb-10 flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-white">
                <Lock
                  size={28}
                  strokeWidth={1.8}
                  className="text-[#171717]"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[#0b0b0b] sm:text-3xl">
                  Login to your account
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
              Login with Account Credentials
            </p>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#E52323]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-base text-[#444]">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={21}
                    strokeWidth={1.7}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    autoComplete="email"
                    className="h-[54px] w-full rounded-xl border border-[#e4dcff] bg-white pl-14 pr-4 text-base outline-none transition focus:border-[#E52323] focus:ring-1 focus:ring-[#E52323]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-base text-[#444]">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={21}
                    strokeWidth={1.7}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    autoComplete="current-password"
                    className="h-[54px] w-full rounded-xl border border-[#e4dcff] bg-white pl-14 pr-14 text-base outline-none transition focus:border-[#E52323] focus:ring-1 focus:ring-[#E52323]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
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

              <div className="flex items-center justify-between gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-base text-[#444]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                    className="h-[18px] w-[18px] accent-[#222]"
                  />

                  Remember me
                </label>

                <Link
                  href="/forgot-password"
                  className="text-base text-[#222] underline underline-offset-2 transition hover:text-[#E52323]"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group mt-1 flex h-[62px] w-full items-center justify-center gap-2 rounded-xl border border-[#E52323] bg-[#292929] text-base font-medium text-white transition hover:bg-[#E52323] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  "Logging in..."
                ) : (
                  <>
                    Login
                    <ArrowRight
                      size={20}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-base text-[#555]">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-[#222] underline underline-offset-2 hover:text-[#E52323]"
              >
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div> 
    </main>
  );
}