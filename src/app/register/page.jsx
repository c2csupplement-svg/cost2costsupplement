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
  ShieldCheck,
  Truck,
  Headphones,
  AlertCircle,
  CheckCircle2,
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
      setError(
        "Please agree to the Terms and Privacy Policy."
      );
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
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="mx-auto min-h-screen max-w-[1500px]">
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[42%_58%]">
          <section className="relative hidden overflow-hidden bg-[#111] lg:flex">
            <img
              src="/images/login.webp"
              alt="Cost2Cost Supplement"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/45" />

          </section>

          <section className="flex flex-col gap-2 min-h-screen items-center justify-center bg-white px-4 py-6 sm:px-6 sm:py-8 md:px-10 lg:px-12 xl:px-16">

            <div className="w-full max-w-[570px]">

              <div className="rounded-2xl border border-[#e8e8e8] bg-white p-5 shadow-[0_8px_35px_rgba(0,0,0,0.06)] sm:p-7 md:p-9 lg:border-0 lg:p-0 lg:shadow-none">

                <div className="text-center">

                  <div className="mx-auto mb-4 hidden h-14 w-14 items-center justify-center rounded-xl bg-[#f6f6f6] sm:flex lg:hidden">
                    <UserRoundPlus
                      size={25}
                      strokeWidth={1.8}
                      className="text-[#222]"
                    />
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-[#111] sm:text-3xl md:text-[34px]">
                    Register an account
                  </h1>

                  {/* <p className="mx-auto mt-3 max-w-[500px] text-sm leading-6 text-[#777] sm:text-[15px]">
                    Create your Cost2Cost account to manage your
                    orders, personal information, and shopping
                    experience.
                  </p> */}
                </div>

                <div className="my-7 flex items-center gap-4 sm:my-8">
                  <div className="h-px flex-1 bg-[#dedede]" />

                  <span className="whitespace-nowrap text-xs font-medium text-[#777] sm:text-sm">
                    Register with Account Credentials
                  </span>

                  <div className="h-px flex-1 bg-[#dedede]" />
                </div>

                {error && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-[#D91C1C]">
                    <AlertCircle
                      size={19}
                      className="mt-0.5 shrink-0"
                    />

                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5 text-sm text-green-700">
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0"
                    />

                    <span>{success}</span>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-5"
                >

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#333] sm:text-[15px]">
                      Full name{" "}
                      <span className="text-[#E52323]">
                        *
                      </span>
                    </label>

                    <div className="relative">
                      <User
                        size={20}
                        strokeWidth={1.7}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]"
                      />

                      <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                        autoComplete="name"
                        className="h-[54px] w-full rounded-xl border border-[#dcdcdc] bg-white pl-12 pr-4 text-sm text-[#111] outline-none transition placeholder:text-[#999] hover:border-[#c8c8c8] focus:border-[#E52323] focus:ring-2 focus:ring-[#E52323]/10 sm:h-[58px] sm:text-[15px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#333] sm:text-[15px]">
                      Email{" "}
                      <span className="text-[#E52323]">
                        *
                      </span>
                    </label>

                    <div className="relative">
                      <Mail
                        size={20}
                        strokeWidth={1.7}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]"
                      />

                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Your email address"
                        required
                        autoComplete="email"
                        className="h-[54px] w-full rounded-xl border border-[#dcdcdc] bg-white pl-12 pr-4 text-sm text-[#111] outline-none transition placeholder:text-[#999] hover:border-[#c8c8c8] focus:border-[#E52323] focus:ring-2 focus:ring-[#E52323]/10 sm:h-[58px] sm:text-[15px]"
                      />
                    </div>
                  </div>


                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#333] sm:text-[15px]">
                      Phone{" "}
                      <span className="text-[#E52323]">
                        *
                      </span>
                    </label>

                    <div className="relative">
                      <Phone
                        size={20}
                        strokeWidth={1.7}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]"
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
                        className="h-[54px] w-full rounded-xl border border-[#dcdcdc] bg-white pl-12 pr-4 text-sm text-[#111] outline-none transition placeholder:text-[#999] hover:border-[#c8c8c8] focus:border-[#E52323] focus:ring-2 focus:ring-[#E52323]/10 sm:h-[58px] sm:text-[15px]"
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#333] sm:text-[15px]">
                      Password{" "}
                      <span className="text-[#E52323]">
                        *
                      </span>
                    </label>

                    <div className="relative">
                      <Lock
                        size={20}
                        strokeWidth={1.7}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]"
                      />

                      <input
                        name="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        minLength={6}
                        autoComplete="new-password"
                        className="h-[54px] w-full rounded-xl border border-[#dcdcdc] bg-white pl-12 pr-12 text-sm text-[#111] outline-none transition placeholder:text-[#999] hover:border-[#c8c8c8] focus:border-[#E52323] focus:ring-2 focus:ring-[#E52323]/10 sm:h-[58px] sm:text-[15px]"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (current) => !current
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] transition hover:text-[#E52323]"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#333] sm:text-[15px]">
                      Confirm password{" "}
                      <span className="text-[#E52323]">
                        *
                      </span>
                    </label>

                    <div className="relative">
                      <Lock
                        size={20}
                        strokeWidth={1.7}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]"
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
                        placeholder="Confirm your password"
                        required
                        minLength={6}
                        autoComplete="new-password"
                        className="h-[54px] w-full rounded-xl border border-[#dcdcdc] bg-white pl-12 pr-12 text-sm text-[#111] outline-none transition placeholder:text-[#999] hover:border-[#c8c8c8] focus:border-[#E52323] focus:ring-2 focus:ring-[#E52323]/10 sm:h-[58px] sm:text-[15px]"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (current) => !current
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] transition hover:text-[#E52323]"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password confirmation"
                            : "Show password confirmation"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* TERMS */}
                  <label className="flex cursor-pointer items-start gap-2 pt-1 text-sm leading-5 text-[#444]">
                    <input
                      name="terms"
                      type="checkbox"
                      checked={form.terms}
                      onChange={handleChange}
                      className="mt-0.5 h-[17px] w-[17px] shrink-0 cursor-pointer accent-[#E52323]"
                    />

                    <span>
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="font-medium text-[#222] underline underline-offset-2 transition hover:text-[#E52323]"
                      >
                        Terms
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy-policy"
                        className="font-medium text-[#222] underline underline-offset-2 transition hover:text-[#E52323]"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  {/* REGISTER BUTTON */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group flex h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-[#292929] px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#E52323] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:h-[60px] sm:text-base"
                  >
                    {isLoading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Register
                        <ArrowRight
                          size={20}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-[#666] sm:mt-7 sm:text-[15px]">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-[#222] underline underline-offset-2 transition hover:text-[#E52323]"
                  >
                    Login now
                  </Link>
                </p>
              </div>
            </div>

            {/* <div className="w-full max-w-[570px] mb-6 overflow-hidden rounded-2xl bg-[#171717] shadow-sm lg:hidden">
              <div className="relative px-5 py-5 sm:px-7 sm:py-6">

                <div className="relative z-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">
                    Cost2Cost Supplement
                  </p>

                  <h2 className="mt-1 text-2xl font-black uppercase leading-none text-white sm:text-3xl">
                    Fuel Your{" "}
                    <span className="text-[#E52323]">
                      Goals
                    </span>
                  </h2>

                  <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-4">

                    <div className="flex flex-col items-center text-center">
                      <ShieldCheck
                        size={20}
                        className="mb-1 text-white"
                      />

                      <span className="text-[9px] leading-tight text-white/80 sm:text-[10px]">
                        100% Authentic
                      </span>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <Truck
                        size={20}
                        className="mb-1 text-white"
                      />

                      <span className="text-[9px] leading-tight text-white/80 sm:text-[10px]">
                        Fast & Secure
                      </span>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <Headphones
                        size={20}
                        className="mb-1 text-white"
                      />

                      <span className="text-[9px] leading-tight text-white/80 sm:text-[10px]">
                        Customer Support
                      </span>
                    </div>

                  </div>
                </div>

                <div className="absolute right-[-25px] top-[-50px] h-40 w-40 rounded-full bg-[#E52323]/20 blur-3xl" />
              </div>
            </div> */}
          </section>
        </div>
      </div>
    </main>
  );
}
