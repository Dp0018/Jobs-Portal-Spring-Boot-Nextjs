"use client";

import {
  IconAt,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconLock,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { loginUser } from "../server/user-service";
import { setUser } from "../server/user-slice";
import { ResetPassword } from "./reset-password";
import { loginSchema, type LoginFormData } from "../validations";

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const dispatch = useDispatch();

  const form = { email: "", password: "" };
  const [data, setData] = useState<LoginFormData>(form);
  const [formError, setFormError] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormError({ ...formError, [event.target.name]: "" });
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSubmit = () => {
    if (loading) return;
    const result = loginSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setFormError(fieldErrors);
      return;
    }

    setFormError(form);
    setLoading(true);
    loginUser(data)
      .then((res) => {
        toast.success("Login Success!", {
          description: "Redirecting to Home page...",
          icon: <IconCheck size={18} />,
        });
        setTimeout(() => {
          setLoading(false);
          dispatch(setUser(res));
          router.push("/");
        }, 4000);
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Login failed!", {
          description:
            err.response?.data?.errorMessage ||
            "Something went wrong. Please try again.",
          icon: <IconX size={18} />,
        });
      });
  };

  return (
    <>
      {/* Loading overlay */}
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
              Signing you in…
            </span>
          </div>
        </div>
      )}

      <div className="w-full h-full px-8 sm:px-10 lg:px-12 py-10 flex flex-col justify-center">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-1 tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-[#64748B]">
            Sign in to continue to your account
          </p>
        </div>

        {/* Form fields */}
        <div className="space-y-5">
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
                  ${formError.email ? "border-red-400 focus-visible:ring-red-200" : "border-[#E2E8F0] hover:border-[#CBD5E1]"}`}
              />
            </div>
            {formError.email && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
                {formError.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-[#374151] text-sm font-medium">
                Password
              </Label>
              <button
                onClick={() => setResetOpen(true)}
                className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>
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
                placeholder="Enter your password"
                className={`pl-9 pr-10 h-10 bg-white border text-[#0F172A] placeholder:text-[#9CA3AF] text-sm
                  focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:border-primary transition-colors
                  ${formError.password ? "border-red-400 focus-visible:ring-red-200" : "border-[#E2E8F0] hover:border-[#CBD5E1]"}`}
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
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
                {formError.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-lg shadow-sm transition-all duration-200 hover:shadow-md mt-2"
          >
            {loading ? "Signing in…" : "Sign In"}
          </Button>

          {/* Sign up redirect */}
          <p className="text-center text-sm text-[#64748B] pt-1">
            Don&apos;t have an account?{" "}
            <span
              onClick={() => {
                router.push("/signup");
                setFormError(form);
                setData(form);
              }}
              className="text-primary font-semibold cursor-pointer hover:underline underline-offset-2 transition-colors"
            >
              Create one free
            </span>
          </p>
        </div>

        {/* Divider */}
        <div className="relative my-7">
          <Separator className="bg-[#E2E8F0]" />
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 bg-white text-xs text-[#94A3B8] font-medium whitespace-nowrap">
            Trusted by professionals
          </span>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-[#94A3B8] leading-none mb-0.5">
                Trusted by
              </p>
              <p className="text-sm font-bold text-[#0F172A] leading-none">
                10K+ Users
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
              <svg
                className="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-[#94A3B8] leading-none mb-0.5">
                Security
              </p>
              <p className="text-sm font-bold text-green-600 leading-none">
                100% Safe
              </p>
            </div>
          </div>
        </div>
      </div>

      <ResetPassword opened={resetOpen} close={() => setResetOpen(false)} />
    </>
  );
};
