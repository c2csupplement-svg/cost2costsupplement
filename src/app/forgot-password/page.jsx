"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Mail,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [timer, setTimer] = useState(60);

  const inputRefs = useRef([]);

  const API_Base = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (step !== "otp" || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${API_Base}/auth/forgot-password`,
        {
          email: cleanEmail,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.success === false) {
        setError(
          response?.data?.message ||
            "Unable to send OTP. Please try again."
        );
        return;
      }

      localStorage.setItem(
        "forgotPasswordEmail",
        cleanEmail
      );

      setStep("otp");
      setTimer(60);
      setOtp(["", "", "", "", "", ""]);

      setSuccess(
        response?.data?.message ||
          "OTP has been sent to your email."
      );

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      console.error("Send OTP error:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);

    setOtp(newOtp);
    setError("");
    setSuccess("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedOtp = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedOtp) return;

    const newOtp = ["", "", "", "", "", ""];

    pastedOtp.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);
    setError("");
    setSuccess("");

    const focusIndex = Math.min(
      pastedOtp.length,
      5
    );

    setTimeout(() => {
      inputRefs.current[focusIndex]?.focus();
    }, 50);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail = email.trim();
    const otpValue = otp.join("");

    if (!cleanEmail) {
      setError("Email address is required.");
      return;
    }

    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    if (!newPassword) {
      setError("Please enter your new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${API_Base}/auth/reset-password`,
        {
          email: cleanEmail,
          otp: otpValue,
          newPassword: newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.success === false) {
        setError(
          response?.data?.message ||
            "Unable to reset password."
        );
        return;
      }

      setSuccess(
        response?.data?.message ||
          "Password reset successfully."
      );

      localStorage.removeItem("forgotPasswordEmail");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } catch (err) {
      console.error("Reset password error:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Invalid or expired OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setStep("email");
    setOtp(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    setTimer(60);
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

            <div className="absolute inset-0 bg-black/10" />
          </section>

          <section className="flex min-h-screen flex-col items-center justify-start bg-white px-4 py-6 sm:justify-center sm:px-6 sm:py-8 md:px-10 lg:px-12 xl:px-16">
            <div className="w-full max-w-[570px]">
              <div className="rounded-2xl border border-[#e8e8e8] bg-white p-5 shadow-[0_8px_35px_rgba(0,0,0,0.06)] sm:p-7 md:p-9 lg:border-0 lg:p-0 lg:shadow-none">

                <div className="text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#f6f6f6]">
                    {step === "email" ? (
                      <Mail
                        size={26}
                        strokeWidth={1.8}
                        className="text-[#222]"
                      />
                    ) : (
                      <ShieldCheck
                        size={26}
                        strokeWidth={1.8}
                        className="text-[#222]"
                      />
                    )}
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-[#111] sm:text-3xl md:text-[34px]">
                    {step === "email"
                      ? "Forgot your password?"
                      : "Reset your password"}
                  </h1>

                  <p className="mx-auto mt-3 max-w-[500px] text-sm leading-6 text-[#777] sm:text-[15px]">
                    {step === "email"
                      ? "Enter your email address and we'll send you a verification code."
                      : "Enter the OTP and create a new password for your account."}
                  </p>
                </div>

                <div className="my-7 flex items-center gap-4 sm:my-8">
                  <div className="h-px flex-1 bg-[#dedede]" />

                  <span className="whitespace-nowrap text-xs font-medium text-[#777] sm:text-sm">
                    {step === "email"
                      ? "Password Reset"
                      : "OTP Verification"}
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

                {step === "email" ? (
                  <form
                    onSubmit={handleSendOtp}
                    className="space-y-5"
                  >
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#333] sm:text-[15px]">
                        Email
                      </label>

                      <div className="relative">
                        <Mail
                          size={20}
                          strokeWidth={1.7}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]"
                        />

                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                            setSuccess("");
                          }}
                          placeholder="Email address"
                          required
                          autoComplete="email"
                          className="h-[54px] w-full rounded-xl border border-[#dcdcdc] bg-white pl-12 pr-4 text-sm text-[#111] outline-none transition placeholder:text-[#999] hover:border-[#c8c8c8] focus:border-[#E52323] focus:ring-2 focus:ring-[#E52323]/10 sm:h-[58px] sm:text-[15px]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group flex h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-[#292929] px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#E52323] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:h-[60px] sm:text-base"
                    >
                      {isLoading ? (
                        <>
                          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          Send OTP
                          <ArrowRight
                            size={20}
                            className="transition-transform duration-200 group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form
                    onSubmit={handleResetPassword}
                    className="space-y-5"
                  >
                    <div>
                      <div className="mb-3 text-center">
                        <p className="text-sm text-[#777]">
                          OTP sent to{" "}
                          <span className="font-semibold text-[#333]">
                            {email}
                          </span>
                        </p>

                        <button
                          type="button"
                          onClick={handleChangeEmail}
                          className="mt-1 text-sm font-semibold text-[#222] underline underline-offset-2 transition hover:text-[#E52323]"
                        >
                          Change email
                        </button>
                      </div>

                      <div
                        className="flex justify-center gap-2 sm:gap-3"
                        onPaste={handlePaste}
                      >
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => {
                              inputRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                              handleOtpChange(
                                e.target.value,
                                index
                              )
                            }
                            onKeyDown={(e) =>
                              handleOtpKeyDown(e, index)
                            }
                            className="h-12 w-10 rounded-xl border border-[#dcdcdc] bg-white text-center text-lg font-bold text-[#111] outline-none transition hover:border-[#c8c8c8] focus:border-[#E52323] focus:ring-2 focus:ring-[#E52323]/10 sm:h-14 sm:w-12 sm:text-xl"
                            aria-label={`OTP digit ${
                              index + 1
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <p className="text-sm text-[#777]">
                        {timer > 0 ? (
                          <>
                            OTP expires in{" "}
                            <span className="font-semibold text-[#333]">
                              {timer}s
                            </span>
                          </>
                        ) : (
                          <span className="font-medium text-red-600">
                            OTP expired
                          </span>
                        )}
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#333] sm:text-[15px]">
                        New Password
                      </label>

                      <div className="relative">
                        <Lock
                          size={20}
                          strokeWidth={1.7}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]"
                        />

                        <input
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setError("");
                          }}
                          placeholder="Enter new password"
                          required
                          autoComplete="new-password"
                          className="h-[54px] w-full rounded-xl border border-[#dcdcdc] bg-white pl-12 pr-12 text-sm text-[#111] outline-none transition placeholder:text-[#999] hover:border-[#c8c8c8] focus:border-[#E52323] focus:ring-2 focus:ring-[#E52323]/10 sm:h-[58px] sm:text-[15px]"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              (prev) => !prev
                            )
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] transition hover:text-[#E52323]"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#333] sm:text-[15px]">
                        Confirm Password
                      </label>

                      <div className="relative">
                        <Lock
                          size={20}
                          strokeWidth={1.7}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]"
                        />

                        <input
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(
                              e.target.value
                            );
                            setError("");
                          }}
                          placeholder="Confirm new password"
                          required
                          autoComplete="new-password"
                          className="h-[54px] w-full rounded-xl border border-[#dcdcdc] bg-white pl-12 pr-12 text-sm text-[#111] outline-none transition placeholder:text-[#999] hover:border-[#c8c8c8] focus:border-[#E52323] focus:ring-2 focus:ring-[#E52323]/10 sm:h-[58px] sm:text-[15px]"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              (prev) => !prev
                            )
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] transition hover:text-[#E52323]"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group flex h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-[#292929] px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#E52323] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:h-[60px] sm:text-base"
                    >
                      {isLoading ? (
                        <>
                          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Resetting Password...
                        </>
                      ) : (
                        <>
                          Reset Password
                          <ArrowRight
                            size={20}
                            className="transition-transform duration-200 group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>
                  </form>
                )}

                <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#f8f8f8] px-4 py-3.5">
                  <ShieldCheck
                    size={20}
                    strokeWidth={1.7}
                    className="mt-0.5 shrink-0 text-[#555]"
                  />

                  <p className="text-xs leading-5 text-[#777] sm:text-sm">
                    Never share your OTP or password with anyone.
                    Your account information is kept secure.
                  </p>
                </div>

                <div className="mt-7 text-center">
                  <Link
                    href="/login"
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-[#222] transition hover:text-[#E52323] sm:text-[15px]"
                  >
                    <ArrowLeft
                      size={18}
                      className="transition-transform duration-200 group-hover:-translate-x-1"
                    />
                    Back to Login
                  </Link>
                </div>

              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
