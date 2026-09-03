"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Save,
  ShieldCheck,
  Trash2,
  AlertTriangle,
} from "lucide-react";

export default function AccountSettingsSection({ user }) {
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    newPassword: false,
    confirm: false,
  });

  const [saved, setSaved] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));

    setSaved(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswords((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    // API will be connected here later
    console.log("Profile update:", profile);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirm) {
      alert("New passwords do not match.");
      return;
    }

    if (!passwords.current || !passwords.newPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    // API will be connected here later
    console.log("Password update:", passwords);

    setPasswords({
      current: "",
      newPassword: "",
      confirm: "",
    });

    alert("Password updated successfully.");
  };

  const firstLetter =
    profile.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="space-y-7">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div>
        <p className="oxanium mb-1 text-xs font-bold uppercase tracking-[0.2em] text-[#E52323]">
          Account
        </p>

        <h1 className="bebas text-5xl uppercase tracking-wide">
          Account Settings
        </h1>

        <p className="oxanium mt-2 max-w-xl text-sm leading-6 text-[#777]">
          Manage your personal information, password and account preferences.
        </p>
      </div>

      {/* =========================================
          PROFILE HEADER
      ========================================= */}

      <div className="relative overflow-hidden rounded-2xl bg-[#111] p-6 text-white sm:p-8">

        {/* Decorative circles */}
        <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full border-[35px] border-[#E52323]/15" />

        <div className="absolute -bottom-28 right-32 h-52 w-52 rounded-full border-[25px] border-white/5" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">

          {/* Avatar */}

          <div className="relative w-fit">

            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#E52323] bg-white text-[#111]">
              <span className="bebas text-6xl leading-none">
                {firstLetter}
              </span>
            </div>

            <button
              type="button"
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#111] bg-[#E52323] text-white transition hover:bg-white hover:text-[#111]"
              aria-label="Change profile picture"
            >
              <Camera className="h-4 w-4" />
            </button>

          </div>

          {/* User */}

          <div>
            <p className="oxanium text-xs font-bold uppercase tracking-[0.2em] text-[#E52323]">
              Personal Profile
            </p>

            <h2 className="bebas mt-1 text-4xl uppercase tracking-wide">
              {profile.name || "Your Name"}
            </h2>

            <p className="oxanium mt-1 text-sm text-white/50">
              {profile.email || "your@email.com"}
            </p>
          </div>

        </div>
      </div>

      {/* =========================================
          PERSONAL INFORMATION
      ========================================= */}

      <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">

        <div className="border-b border-black/10 px-6 py-6 sm:px-8">

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#111] text-white">
              <User className="h-5 w-5" />
            </div>

            <div>
              <h2 className="bebas text-3xl uppercase tracking-wide">
                Personal Information
              </h2>

              <p className="oxanium mt-1 text-xs text-[#888]">
                Update your basic account information.
              </p>
            </div>

          </div>

        </div>

        <form
          onSubmit={handleProfileSubmit}
          className="p-6 sm:p-8"
        >

          <div className="grid gap-5 md:grid-cols-2">

            {/* Name */}

            <FormInput
              label="Full Name"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              placeholder="Your full name"
              icon={User}
            />

            {/* Email */}

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleProfileChange}
              placeholder="you@example.com"
              icon={Mail}
            />

            {/* Phone */}

            <FormInput
              label="Phone Number"
              name="phone"
              type="tel"
              value={profile.phone}
              onChange={handleProfileChange}
              placeholder="+91 XXXXX XXXXX"
              icon={Phone}
            />

          </div>

          {/* Save */}

          <div className="mt-7 flex flex-col gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
              {saved && (
                <p className="oxanium text-xs font-semibold text-green-600">
                  Your changes have been saved.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="oxanium inline-flex items-center justify-center gap-2 rounded-lg bg-[#E52323] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#111]"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>

          </div>

        </form>

      </section>

      {/* =========================================
          CHANGE PASSWORD
      ========================================= */}

      <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">

        <div className="border-b border-black/10 px-6 py-6 sm:px-8">

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#111] text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <h2 className="bebas text-3xl uppercase tracking-wide">
                Security
              </h2>

              <p className="oxanium mt-1 text-xs text-[#888]">
                Keep your account secure by using a strong password.
              </p>
            </div>

          </div>

        </div>

        <form
          onSubmit={handlePasswordSubmit}
          className="p-6 sm:p-8"
        >

          <div className="space-y-5">

            <PasswordInput
              label="Current Password"
              name="current"
              value={passwords.current}
              onChange={handlePasswordChange}
              show={showPassword.current}
              onToggle={() =>
                setShowPassword((current) => ({
                  ...current,
                  current: !current.current,
                }))
              }
            />

            <div className="grid gap-5 md:grid-cols-2">

              <PasswordInput
                label="New Password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                show={showPassword.newPassword}
                onToggle={() =>
                  setShowPassword((current) => ({
                    ...current,
                    newPassword: !current.newPassword,
                  }))
                }
              />

              <PasswordInput
                label="Confirm New Password"
                name="confirm"
                value={passwords.confirm}
                onChange={handlePasswordChange}
                show={showPassword.confirm}
                onToggle={() =>
                  setShowPassword((current) => ({
                    ...current,
                    confirm: !current.confirm,
                  }))
                }
              />

            </div>

          </div>

          <div className="mt-7 flex justify-end border-t border-black/10 pt-6">

            <button
              type="submit"
              className="oxanium inline-flex items-center justify-center gap-2 rounded-lg bg-[#111] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#E52323]"
            >
              <Lock className="h-4 w-4" />
              Update Password
            </button>

          </div>

        </form>

      </section>

      {/* =========================================
          DELETE ACCOUNT
      ========================================= */}

      <section className="overflow-hidden rounded-2xl border border-red-200 bg-red-50">

        <div className="p-6 sm:p-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-[#E52323]">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div>

                <h2 className="bebas text-3xl uppercase tracking-wide text-[#111]">
                  Delete Account
                </h2>

                <p className="oxanium mt-1 max-w-xl text-xs leading-5 text-[#777]">
                  Permanently delete your account and associated account
                  information. This action cannot be undone.
                </p>

              </div>

            </div>

            <button
              type="button"
              className="oxanium inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#E52323] px-5 py-3 text-sm font-bold text-[#E52323] transition hover:bg-[#E52323] hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>

          </div>

        </div>

      </section>

    </div>
  );
}


/* =============================================
   FORM INPUT
============================================= */

function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
}) {
  return (
    <div>

      <label className="oxanium mb-2 block text-xs font-bold uppercase tracking-wide text-[#555]">
        {label}
      </label>

      <div className="relative">

        <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" />

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="oxanium h-12 w-full rounded-xl border border-black/10 bg-[#FAFAFA] pl-11 pr-4 text-sm text-[#111] outline-none transition placeholder:text-[#AAA] focus:border-[#E52323] focus:bg-white"
        />

      </div>

    </div>
  );
}


/* =============================================
   PASSWORD INPUT
============================================= */

function PasswordInput({
  label,
  name,
  value,
  onChange,
  show,
  onToggle,
}) {
  return (
    <div>

      <label className="oxanium mb-2 block text-xs font-bold uppercase tracking-wide text-[#555]">
        {label}
      </label>

      <div className="relative">

        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" />

        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className="oxanium h-12 w-full rounded-xl border border-black/10 bg-[#FAFAFA] pl-11 pr-12 text-sm text-[#111] outline-none transition placeholder:text-[#AAA] focus:border-[#E52323] focus:bg-white"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888] transition hover:text-[#E52323]"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>

      </div>

    </div>
  );
}