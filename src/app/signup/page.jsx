"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/services/productsApi";
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
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const [register, { isLoading }] = useRegisterMutation();

  const [error, setError] = useState("");
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

  if (form.password !== form.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  if (!form.terms) {
    setError("Please agree to the Terms and Privacy Policy.");
    return;
  }

  try {
    const response = await register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
    }).unwrap();

    if (!response?.success || !response?.token) {
      setError("Registration failed. Please try again.");
      return;
    }

    localStorage.setItem("token", response.token);

    if (response.user) {
      localStorage.setItem(
        "authUser",
        JSON.stringify(response.user)
      );
    }

    router.push("/account");
  } catch (err) {
    console.error("Registration error:", err);

    const message =
      err?.data?.message ||
      err?.data?.error ||
      "Unable to create your account.";

    setError(message);
  }
};

  return (
    <main className="min-h-screen bg-white px-0 py-0">
      <Header />
      <div className="mx-auto grid min-h-screen max-w-[1450px] grid-cols-1 lg:grid-cols-2">

        {/* =====================================
            LEFT IMAGE
        ===================================== */}
        <div className="relative hidden min-h-screen overflow-hidden lg:block">

          <img
            src="https://www.cost2costsupplement.com/storage/other-banners/login-img-1.png"
            alt="Cost2Cost Supplement"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/5" />

        </div>

        {/* =====================================
            RIGHT REGISTER PANEL
        ===================================== */}
        <div className="flex min-h-screen items-start justify-center bg-[#f8f9fa] px-6 py-10 sm:px-10 lg:px-16 xl:px-20">

          <div className="w-full max-w-[590px]">

            {/* =================================
                TITLE
            ================================= */}
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
                  Your personal data will be used to support your experience
                  throughout this website, to manage access to your account.
                </p>
              </div>

            </div>

            {/* =================================
                GOOGLE
            ================================= */}
            {/* <div className="mb-8">

              <p className="mb-7 text-center text-sm text-[#555]">
                Login with social networks
              </p>

              <button
                type="button"
                className="flex h-16 w-full items-center gap-5 rounded-xl border border-[#e7e7e7] bg-white px-7 text-left transition hover:border-[#ccc] hover:shadow-sm"
              >
                <span className="text-3xl font-bold text-[#4285F4]">
                  G
                </span>

                <span className="text-base font-medium text-[#333]">
                  Sign in with Google
                </span>
              </button>

            </div> */}

            {/* =================================
                DIVIDER
            ================================= */}
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
            {/* =================================
                FORM
            ================================= */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* FULL NAME */}
              <div>
                <label className="mb-2 block text-base text-[#444]">
                  Full name <span className="text-[#E52323]">*</span>
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
                    className="h-[54px] w-full rounded-xl border border-[#e4dcff] bg-white pl-14 pr-4 text-base outline-none transition focus:border-[#E52323] focus:ring-1 focus:ring-[#E52323]"
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-base text-[#444]">
                  Email <span className="text-[#E52323]">*</span>
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
                    className="h-[54px] w-full rounded-xl border border-[#e4dcff] bg-white pl-14 pr-4 text-base outline-none transition focus:border-[#E52323] focus:ring-1 focus:ring-[#E52323]"
                  />
                </div>


              </div>

              {/* PHONE */}
              <div>
                <label className="mb-2 block text-base text-[#444]">
                  Phone <span className="text-[#E52323]">*</span>
                </label>

                <div className="relative">
                  <Phone
                    size={21}
                    strokeWidth={1.7}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]"
                  />

                  <input
                    name="phone"
                    type="number"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    required
                    className="h-[54px] w-full rounded-xl border border-[#e4dcff] bg-white pl-14 pr-4 text-base outline-none transition focus:border-[#E52323] focus:ring-1 focus:ring-[#E52323]"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="mb-2 block text-base text-[#444]">
                  Password <span className="text-[#E52323]">*</span>
                </label>

                <div className="relative">

                  <Lock
                    size={21}
                    strokeWidth={1.7}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]"
                  />

                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className="h-[54px] w-full rounded-xl border border-[#e4dcff] bg-white pl-14 pr-14 text-base outline-none transition focus:border-[#E52323] focus:ring-1 focus:ring-[#E52323]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-black"
                  >
                    {showPassword ? (
                      <EyeOff size={21} />
                    ) : (
                      <Eye size={21} />
                    )}
                  </button>

                </div>
              </div>

              {/* CONFIRM PASSWORD */}
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
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Password confirmation"
                    required
                    className="h-[54px] w-full rounded-xl border border-[#e4dcff] bg-white pl-14 pr-14 text-base outline-none transition focus:border-[#E52323] focus:ring-1 focus:ring-[#E52323]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-black"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={21} />
                    ) : (
                      <Eye size={21} />
                    )}
                  </button>

                </div>
              </div>

              {/* TERMS */}
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

              {/* REGISTER */}
              <button
                type="submit"
                disabled={isLoading}
                className="group mt-1 flex h-[62px] w-full items-center justify-center gap-2 rounded-xl border border-[#E52323] bg-[#292929] text-base font-medium text-white transition hover:bg-[#E52323] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Registering..." : "Register"}

                {!isLoading && (
                  <ArrowRight
                    size={20}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>

            </form>

            {/* LOGIN */}
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
      <Footer/>
    </main>
  );
}