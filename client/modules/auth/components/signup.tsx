"use client";

import {
  IconAt,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconLock,
  IconUser,
  IconX,
  IconMailForward,
  IconShieldCheck,
  IconBriefcase,
  IconBuilding,
} from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { registerUser, sendOtp, verifyEmail } from "../server/user-service";
import { signupSchema, type SignupFormData } from "../validations";

const form = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  accountType: "APPLICANT" as const,
};

export const Signup = () => {
  const [data, setData] = useState<SignupFormData>(form);
  const [formError, setFormError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const router = useRouter();

  // OTP verification state
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement> | string,
  ) => {
    if (typeof event === "string") {
      setData({ ...data, accountType: event as "APPLICANT" | "EMPLOYER" });
    } else {
      const name = event.target.name;
      const value = event.target.value;
      const newData = { ...data, [name]: value };
      setData(newData);

      const result = signupSchema.safeParse(newData);
      if (result.success) {
        setFormError({
          ...formError,
          [name]: "",
          ...(name === "password" ? { confirmPassword: "" } : {}),
        });
      } else {
        const fieldError = result.error.issues.find((i) => i.path[0] === name);
        setFormError({
          ...formError,
          [name]: fieldError ? fieldError.message : "",
          ...(name === "password" || name === "confirmPassword"
            ? {
                confirmPassword:
                  result.error.issues.find(
                    (i) => i.path[0] === "confirmPassword",
                  )?.message || "",
              }
            : {}),
        });
      }
    }
  };

  const handleSubmit = () => {
    if (loading) return;
    const result = signupSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setFormError(fieldErrors);
      return;
    }

    setFormError({});
    setLoading(true);
    registerUser(data)
      .then(() => {
        setRegisteredEmail(data.email);
        setShowOtpStep(true);
        setResendTimer(60);
        setLoading(false);
        toast.success("Account created! Please verify your email.", {
          description: "An OTP has been sent to your email address.",
          icon: <IconMailForward size={18} />,
        });
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Registration failed!", {
          description:
            err.response?.data?.errorMessage ||
            "Something went wrong. Please try again.",
          icon: <IconX size={18} />,
        });
      });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, 6).split("");
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) newOtp[index + i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    if (otpLoading) return;
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setOtpLoading(true);
    verifyEmail(registeredEmail, otpCode)
      .then(() => {
        toast.success("Email verified successfully!", {
          description: "Redirecting to login page...",
          icon: <IconShieldCheck size={18} />,
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      })
      .catch((err) => {
        setOtpLoading(false);
        toast.error("Verification failed!", {
          description:
            err.response?.data?.errorMessage ||
            "Invalid OTP. Please try again.",
          icon: <IconX size={18} />,
        });
      });
  };

  const handleResendOtp = () => {
    if (resendTimer > 0 || otpLoading) return;
    setOtpLoading(true);
    sendOtp(registeredEmail)
      .then(() => {
        setResendTimer(60);
        setOtp(["", "", "", "", "", ""]);
        setOtpLoading(false);
        toast.success("OTP resent successfully!", {
          description: "Check your email for the new OTP.",
          icon: <IconMailForward size={18} />,
        });
      })
      .catch(() => {
        setOtpLoading(false);
        toast.error("Failed to resend OTP. Please try again.");
      });
  };

  // ── OTP Verification Step ──
  if (showOtpStep) {
    return (
      <>
        {otpLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl">
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-1.5 items-end">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-primary rounded-full animate-pulse"
                    style={{
                      height: `${20 + i * 6}px`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-[#475569]">
                Verifying…
              </span>
            </div>
          </div>
        )}

        <div className="w-full h-full px-8 sm:px-10 lg:px-12 py-10 flex flex-col justify-center">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <IconMailForward size={24} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-1.5 tracking-tight">
              Check your inbox
            </h2>
            <p className="text-sm text-[#64748B]">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-[#0F172A]">
                {registeredEmail}
              </span>
            </p>
          </div>

          <div className="space-y-6">
            {/* OTP input boxes */}
            <div className="flex justify-center gap-2.5">
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
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pasteData = e.clipboardData
                      .getData("text")
                      .replace(/\D/g, "")
                      .slice(0, 6);
                    handleOtpChange(index, pasteData);
                  }}
                  className={`w-11 h-13 text-center text-xl font-bold rounded-xl border-2 bg-white text-[#0F172A]
                    outline-none transition-all duration-150
                    focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-sm
                    ${digit ? "border-primary/60 bg-primary/5" : "border-[#E2E8F0] hover:border-[#CBD5E1]"}`}
                  style={{ height: "52px" }}
                />
              ))}
            </div>

            {/* Verify button */}
            <Button
              onClick={handleVerifyOtp}
              disabled={otpLoading || otp.join("").length !== 6}
              className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <IconShieldCheck size={17} className="mr-2" />
              Verify Email
            </Button>

            {/* Resend */}
            <p className="text-center text-sm text-[#64748B]">
              Didn&apos;t receive the code?{" "}
              {resendTimer > 0 ? (
                <span className="text-[#94A3B8]">Resend in {resendTimer}s</span>
              ) : (
                <span
                  onClick={handleResendOtp}
                  className="text-primary font-semibold cursor-pointer hover:underline underline-offset-2"
                >
                  Resend OTP
                </span>
              )}
            </p>

            {/* Security note */}
            <div className="flex items-center justify-center gap-2 py-3 px-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <IconShieldCheck size={15} className="text-[#94A3B8] shrink-0" />
              <p className="text-xs text-[#94A3B8]">
                OTP is valid for 10 minutes. Do not share with anyone.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Signup Form ──
  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl">
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-1.5 items-end">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1.5 bg-primary rounded-full animate-pulse"
                  style={{
                    height: `${20 + i * 6}px`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-[#475569]">
              Creating your account…
            </span>
          </div>
        </div>
      )}

      <div className="w-full h-full px-8 sm:px-10 lg:px-12 py-8 flex flex-col justify-center overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-1 tracking-tight">
            Create your account
          </h2>
          <p className="text-sm text-[#64748B]">
            Join thousands of professionals on Joblify
          </p>
        </div>

        <div className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label className="text-[#374151] text-sm font-medium">
              Full Name
            </Label>
            <div className="relative">
              <IconUser
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
              />
              <Input
                value={data.name}
                onChange={handleChange}
                name="name"
                placeholder="Your full name"
                className={`pl-9 h-10 bg-white border text-[#0F172A] placeholder:text-[#9CA3AF] text-sm
                  focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:border-primary transition-colors
                  ${formError.name ? "border-red-400" : "border-[#E2E8F0] hover:border-[#CBD5E1]"}`}
              />
            </div>
            {formError.name && (
              <p className="text-xs text-red-500 mt-1">{formError.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label className="text-[#374151] text-sm font-medium">
              Email address
            </Label>
            <div className="relative">
              <IconAt
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
              />
              <Input
                value={data.email}
                onChange={handleChange}
                name="email"
                type="email"
                placeholder="you@example.com"
                className={`pl-9 h-10 bg-white border text-[#0F172A] placeholder:text-[#9CA3AF] text-sm
                  focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:border-primary transition-colors
                  ${formError.email ? "border-red-400" : "border-[#E2E8F0] hover:border-[#CBD5E1]"}`}
              />
            </div>
            {formError.email && (
              <p className="text-xs text-red-500 mt-1">{formError.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label className="text-[#374151] text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <IconLock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
              />
              <Input
                value={data.password}
                onChange={handleChange}
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className={`pl-9 pr-10 h-10 bg-white border text-[#0F172A] placeholder:text-[#9CA3AF] text-sm
                  focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:border-primary transition-colors
                  ${formError.password ? "border-red-400" : "border-[#E2E8F0] hover:border-[#CBD5E1]"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#475569] transition-colors"
              >
                {showPassword ? (
                  <IconEyeOff size={16} />
                ) : (
                  <IconEye size={16} />
                )}
              </button>
            </div>
            {formError.password && (
              <p className="text-xs text-red-500 mt-1">{formError.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label className="text-[#374151] text-sm font-medium">
              Confirm Password
            </Label>
            <div className="relative">
              <IconLock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
              />
              <Input
                value={data.confirmPassword}
                onChange={handleChange}
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                className={`pl-9 pr-10 h-10 bg-white border text-[#0F172A] placeholder:text-[#9CA3AF] text-sm
                  focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:border-primary transition-colors
                  ${formError.confirmPassword ? "border-red-400" : "border-[#E2E8F0] hover:border-[#CBD5E1]"}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#475569] transition-colors"
              >
                {showConfirmPassword ? (
                  <IconEyeOff size={16} />
                ) : (
                  <IconEye size={16} />
                )}
              </button>
            </div>
            {formError.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {formError.confirmPassword}
              </p>
            )}
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <Label className="text-[#374151] text-sm font-medium">
              I am a…
            </Label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                {
                  type: "APPLICANT",
                  label: "Job Seeker",
                  icon: <IconBriefcase size={16} />,
                },
                {
                  type: "EMPLOYER",
                  label: "Employer",
                  icon: <IconBuilding size={16} />,
                },
              ].map(({ type, label, icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChange(type)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-150 cursor-pointer
                    ${
                      data.accountType === type
                        ? "border-primary bg-primary/8 text-primary shadow-sm"
                        : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1] hover:text-[#374151]"
                    }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2.5 pt-1">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(!!checked)}
              className="mt-0.5 border-[#CBD5E1] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label
              htmlFor="terms"
              className="text-sm text-[#64748B] cursor-pointer leading-relaxed"
            >
              I agree to the{" "}
              <span className="text-primary font-medium hover:underline underline-offset-2 cursor-pointer transition-colors">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-primary font-medium hover:underline underline-offset-2 cursor-pointer transition-colors">
                Privacy Policy
              </span>
            </label>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={loading || !termsAccepted}
            className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-lg shadow-sm transition-all duration-200 hover:shadow-md mt-1"
          >
            {loading ? "Creating account…" : "Create Account"}
          </Button>

          {/* Login link */}
          <p className="text-center text-sm text-[#64748B]">
            Already have an account?{" "}
            <span
              onClick={() => {
                router.push("/login");
                setFormError(form);
                setData(form);
              }}
              className="text-primary font-semibold cursor-pointer hover:underline underline-offset-2 transition-colors"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </>
  );
};
