"use client";

import { useState } from "react";
import {
  Loader2,
  UserPlus,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createAdmin } from "@/modules/admin/server/admin-service";
import {
  successNotification,
  errorNotification,
} from "@/modules/notifications/server/notification-service";

// Password rule checker — UI only, no logic change
const passwordRules = [
  {
    label: "8–15 characters",
    test: (p: string) => p.length >= 8 && p.length <= 15,
  },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Number", test: (p: string) => /\d/.test(p) },
  {
    label: "Special character (@$!%*?&#)",
    test: (p: string) => /[@$!%*?&#]/.test(p),
  },
];

export default function AddAdminPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      errorNotification("Validation Error", "All fields are required.");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,15}$/;
    if (!passwordRegex.test(form.password)) {
      errorNotification(
        "Invalid Password",
        "Password must be 8-15 chars with upper, lower, digit, and special char.",
      );
      return;
    }

    setSubmitting(true);
    createAdmin(form)
      .then(() => {
        successNotification(
          "Admin Created",
          `New admin "${form.name}" has been created successfully.`,
        );
        setForm({ name: "", email: "", password: "" });
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.errorMessage ||
          "Failed to create admin. Email may already exist.";
        errorNotification("Error", msg);
      })
      .finally(() => setSubmitting(false));
  };

  const passedRules = passwordRules.filter((r) => r.test(form.password)).length;
  const strengthPercent = (passedRules / passwordRules.length) * 100;
  const strengthColor =
    passedRules <= 1
      ? "#EF4444"
      : passedRules <= 2
        ? "#F97316"
        : passedRules <= 3
          ? "#EAB308"
          : passedRules === 4
            ? "#3B82F6"
            : "#10B981";
  const strengthLabel =
    passedRules <= 1
      ? "Very Weak"
      : passedRules <= 2
        ? "Weak"
        : passedRules <= 3
          ? "Fair"
          : passedRules === 4
            ? "Good"
            : "Strong";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            Add Administrator
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            Create a new admin account with full platform privileges.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#475569] shadow-sm shrink-0">
          <Shield className="w-3.5 h-3.5 text-[#2563EB]" strokeWidth={2} />
          <span className="font-medium">Privileged Action</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start max-w-4xl">
        {/* ── Main Form Card ── */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
            {/* Card Header */}
            <div className="px-6 py-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-sm shadow-blue-500/20">
                  <UserPlus className="w-5 h-5 text-white" strokeWidth={1.8} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#0F172A] leading-none">
                    New Admin Account
                  </h2>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Fill in all required details below
                  </p>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#475569] uppercase tracking-wider block">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]"
                    strokeWidth={1.8}
                  />
                  <Input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Jane Smith"
                    className="pl-10 h-11 bg-[#F8FAFC] border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#CBD5E1] focus-visible:ring-[#2563EB] focus-visible:ring-1 focus-visible:border-[#2563EB] transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#475569] uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]"
                    strokeWidth={1.8}
                  />
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="admin@company.com"
                    className="pl-10 h-11 bg-[#F8FAFC] border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#CBD5E1] focus-visible:ring-[#2563EB] focus-visible:ring-1 focus-visible:border-[#2563EB] transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#475569] uppercase tracking-wider block">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]"
                    strokeWidth={1.8}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    placeholder="Create a strong password"
                    className="pl-10 pr-11 h-11 bg-[#F8FAFC] border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#CBD5E1] focus-visible:ring-[#2563EB] focus-visible:ring-1 focus-visible:border-[#2563EB] transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors p-0.5"
                  >
                    {showPassword ? (
                      <EyeOff size={15} strokeWidth={1.8} />
                    ) : (
                      <Eye size={15} strokeWidth={1.8} />
                    )}
                  </button>
                </div>

                {/* Strength bar — only shows when password has input */}
                {form.password.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#94A3B8]">
                        Password strength
                      </span>
                      <span
                        className="text-[11px] font-semibold"
                        style={{ color: strengthColor }}
                      >
                        {strengthLabel}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${strengthPercent}%`,
                          backgroundColor: strengthColor,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Password rules checklist */}
                {(passwordFocused || form.password.length > 0) && (
                  <div className="mt-3 p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
                    {passwordRules.map((rule) => {
                      const passed = rule.test(form.password);
                      return (
                        <div
                          key={rule.label}
                          className="flex items-center gap-2.5"
                        >
                          {passed ? (
                            <CheckCircle2
                              className="w-3.5 h-3.5 text-emerald-500 shrink-0"
                              strokeWidth={2}
                            />
                          ) : (
                            <XCircle
                              className="w-3.5 h-3.5 text-[#CBD5E1] shrink-0"
                              strokeWidth={2}
                            />
                          )}
                          <span
                            className={`text-xs transition-colors ${
                              passed
                                ? "text-emerald-600 font-medium"
                                : "text-[#94A3B8]"
                            }`}
                          >
                            {rule.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <Separator className="bg-[#F1F5F9]" />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl text-sm shadow-sm shadow-blue-500/20 transition-all duration-200 hover:shadow-md hover:shadow-blue-500/25 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" strokeWidth={2} />
                    Create Admin Account
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* ── Right Info Panel ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* What this does */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                <Shield
                  className="w-3.5 h-3.5 text-[#2563EB]"
                  strokeWidth={2}
                />
              </div>
              <h3 className="text-sm font-bold text-[#0F172A]">
                Admin Privileges
              </h3>
            </div>
            <ul className="space-y-2.5">
              {[
                "Manage all users & employers",
                "Moderate job listings",
                "Access fraud monitor",
                "Create other admin accounts",
                "View platform analytics",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#EFF6FF] flex items-center justify-center mt-0.5 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                  </div>
                  <span className="text-xs text-[#475569] leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Warning card */}
          <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#FEE2E2] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert
                  className="w-3.5 h-3.5 text-[#EF4444]"
                  strokeWidth={2}
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#991B1B] mb-1.5">
                  Important Notice
                </h3>
                <p className="text-xs text-[#B91C1C] leading-relaxed">
                  This creates a{" "}
                  <span className="font-semibold">brand new account</span> with
                  full admin access. It does not promote an existing user. Share
                  credentials securely with the new admin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
