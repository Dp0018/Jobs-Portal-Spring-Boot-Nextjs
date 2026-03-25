"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  IconAt,
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
  IconRefresh,
  IconShieldCheck,
  IconCircleCheck,
} from "@tabler/icons-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { changePass, sendOtp, verfiyOtp } from "../server/user-service";
import { resetPasswordSchema } from "../validations";
import { toast } from "sonner";

interface ResetPasswordProps {
  opened: boolean;
  close: () => void;
}

function useCountdown(onTick: () => void, ms: number) {
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (intervalId.current) return;
    intervalId.current = setInterval(onTick, ms);
  }, [onTick, ms]);

  const stop = useCallback(() => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { start, stop };
}

// Step indicator sub-component
function StepBubble({
  active,
  done,
  children,
}: {
  active: boolean;
  done: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200 text-xs font-bold
        ${
          done
            ? "border-primary bg-primary text-white"
            : active
              ? "border-primary bg-primary/10 text-primary"
              : "border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8]"
        }`}
    >
      {done ? <IconCircleCheck size={16} /> : children}
    </div>
  );
}

function StepConnector({ active }: { active: boolean }) {
  return (
    <div
      className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${
        active ? "bg-primary" : "bg-[#E2E8F0]"
      }`}
    />
  );
}

export const ResetPassword = ({ opened, close }: ResetPasswordProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passError, setPassError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendLoader, setResendLoader] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [seconds, setSeconds] = useState(60);

  const { start, stop } = useCountdown(() => {
    setSeconds((s) => {
      if (s <= 1) {
        setResendLoader(false);
        stop();
        return 60;
      }
      return s - 1;
    });
  }, 1000);

  const handleSendOtp = () => {
    if (otpSending) return;
    setOtpSending(true);
    sendOtp(email)
      .then(() => {
        setOtpSent(true);
        toast.success("OTP sent successfully", {
          description: "Check your email and enter the OTP.",
        });
        setOtpSending(false);
        setResendLoader(true);
        start();
      })
      .catch((err) => {
        setOtpSending(false);
        toast.error("OTP sending failed", {
          description:
            err.response?.data?.errorMessage ||
            "Something went wrong. Please try again.",
        });
      });
  };

  const handleVerifyOtp = (otp: string) => {
    if (otp.length < 6) return;
    verfiyOtp(email, otp)
      .then(() => {
        toast.success("OTP Verified", {
          description: "Enter your new password.",
        });
        setVerified(true);
      })
      .catch((err) => {
        toast.error("OTP verification failed", {
          description:
            err.response?.data?.errorMessage ||
            "Invalid OTP. Please try again.",
        });
      });
  };

  const resendOtp = () => {
    if (resendLoader) return;
    handleSendOtp();
  };

  const changeEmail = () => {
    setOtpSent(false);
    setResendLoader(false);
    setSeconds(60);
    setVerified(false);
    stop();
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setPassError("");
    setOtpSent(false);
    setOtpSending(false);
    setVerified(false);
    setResendLoader(false);
    setSeconds(60);
    setShowPassword(false);
    stop();
    close();
  };

  const handleResetPassword = () => {
    if (resetLoading) return;
    const result = resetPasswordSchema.safeParse(password);
    if (!result.success) {
      setPassError(result.error.issues[0].message);
      return;
    }
    setResetLoading(true);
    changePass(email, password)
      .then(() => {
        setResetLoading(false);
        toast.success("Password Changed", {
          description: "Login with your new password.",
        });
        handleClose();
      })
      .catch((err) => {
        setResetLoading(false);
        toast.error("Password reset failed", {
          description:
            err.response?.data?.errorMessage ||
            "Something went wrong. Please try again.",
        });
      });
  };

  // Current step
  const step = verified ? 3 : otpSent ? 2 : 1;

  return (
    <Dialog open={opened} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-white border border-[#E2E8F0] text-[#0F172A] sm:max-w-md p-0 overflow-hidden rounded-2xl shadow-xl">
        {/* Dialog header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <IconShieldCheck size={18} className="text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-[#0F172A]">
                Reset Password
              </DialogTitle>
              <p className="text-xs text-[#64748B] mt-0.5">
                {step === 1 &&
                  "Enter your email to receive a verification code"}
                {step === 2 && "Enter the OTP sent to your email"}
                {step === 3 && "Set your new password"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          {/* Step progress bar */}
          <div className="flex items-center gap-1.5 px-2">
            <StepBubble active={step === 1} done={step > 1}>
              <IconMail size={14} />
            </StepBubble>
            <StepConnector active={step >= 2} />
            <StepBubble active={step === 2} done={step > 2}>
              OTP
            </StepBubble>
            <StepConnector active={step >= 3} />
            <StepBubble active={step === 3} done={false}>
              <IconLock size={14} />
            </StepBubble>
          </div>

          {/* Step labels */}
          <div className="flex justify-between px-1">
            {["Email", "Verify", "Password"].map((label, i) => (
              <span
                key={label}
                className={`text-[10px] font-medium ${
                  step === i + 1
                    ? "text-primary"
                    : step > i + 1
                      ? "text-[#475569]"
                      : "text-[#CBD5E1]"
                }`}
              >
                {label}
              </span>
            ))}
          </div>

          {/* ── Step 1: Email ── */}
          {!verified && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-[#374151] text-sm font-medium">
                  Email Address
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <IconAt
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
                    />
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      name="email"
                      placeholder="you@example.com"
                      disabled={otpSent}
                      className="pl-9 h-10 bg-white border-[#E2E8F0] hover:border-[#CBD5E1] focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:border-primary text-[#0F172A] placeholder:text-[#9CA3AF] text-sm disabled:bg-[#F8FAFC] disabled:text-[#94A3B8] transition-colors"
                    />
                  </div>
                  <Button
                    onClick={handleSendOtp}
                    disabled={email === "" || otpSent || otpSending}
                    size="sm"
                    className="h-10 px-4 bg-primary hover:bg-primary/90 text-white font-semibold text-sm shrink-0 shadow-sm transition-all"
                  >
                    {otpSending && !otpSent
                      ? "Sending…"
                      : otpSent
                        ? "Sent ✓"
                        : "Send OTP"}
                  </Button>
                </div>
                {!otpSent && (
                  <p className="text-xs text-[#94A3B8] flex items-center gap-1.5">
                    <IconMail size={13} />
                    We&apos;ll send a 6-digit code to this email
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── Step 2: OTP ── */}
          {otpSent && !verified && (
            <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-5">
              <div className="text-center mb-5">
                <p className="text-sm text-[#64748B]">
                  Code sent to{" "}
                  <span className="font-semibold text-[#0F172A]">{email}</span>
                </p>
              </div>

              <div className="flex justify-center">
                <InputOTP maxLength={6} onComplete={handleVerifyOtp}>
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="w-10 h-11 bg-white border-2 border-[#E2E8F0] focus-within:border-primary text-[#0F172A] font-bold text-base rounded-xl transition-colors"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#0F172A] text-sm font-medium transition-colors"
                  disabled={resendLoader || otpSending}
                  onClick={resendOtp}
                >
                  <IconRefresh size={14} className="mr-1.5" />
                  {resendLoader ? `Resend in ${seconds}s` : "Resend OTP"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#0F172A] text-sm font-medium transition-colors"
                  onClick={changeEmail}
                >
                  Change Email
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 3: New Password ── */}
          {verified && (
            <div className="space-y-4">
              {/* Verified badge */}
              <div className="flex items-center gap-2.5 py-2.5 px-3.5 bg-green-50 border border-green-200 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                  <IconCircleCheck size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-green-700 leading-none mb-0.5">
                    Email Verified
                  </p>
                  <p className="text-[11px] text-green-600">
                    Set a strong new password below
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[#374151] text-sm font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <IconLock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
                  />
                  <Input
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      const result = resetPasswordSchema.safeParse(
                        e.target.value,
                      );
                      setPassError(
                        result.success ? "" : result.error.issues[0].message,
                      );
                    }}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter a strong password"
                    className={`pl-9 pr-10 h-10 bg-white border text-[#0F172A] placeholder:text-[#9CA3AF] text-sm
                      focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:border-primary transition-colors
                      ${passError ? "border-red-400" : "border-[#E2E8F0] hover:border-[#CBD5E1]"}`}
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
                {passError && (
                  <p className="text-xs text-red-500 mt-1">{passError}</p>
                )}
              </div>

              <Button
                onClick={handleResetPassword}
                disabled={resetLoading}
                className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <IconShieldCheck size={16} className="mr-2" />
                {resetLoading ? "Resetting…" : "Reset Password"}
              </Button>
            </div>
          )}

          {/* Footer note */}
          <div className="flex items-center justify-center gap-2 py-2 px-3 bg-[#F8FAFC] rounded-lg border border-[#F1F5F9]">
            <IconShieldCheck size={13} className="text-[#94A3B8] shrink-0" />
            <p className="text-[11px] text-[#94A3B8]">
              OTP is valid for 10 minutes. Never share it with anyone.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
