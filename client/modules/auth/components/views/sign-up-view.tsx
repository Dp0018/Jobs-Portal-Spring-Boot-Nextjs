"use client";

import {
  IconArrowNarrowLeft,
  IconBriefcase,
  IconUsers,
  IconStar,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Signup } from "../signup";
import { Login } from "../login";

const PARTICLES = [
  { id: 0, left: 5, top: 68, duration: 12, delay: 3.8 },
  { id: 1, left: 82, top: 56, duration: 8, delay: 3.6 },
  { id: 2, left: 55, top: 98, duration: 11, delay: 4.5 },
  { id: 3, left: 38, top: 7, duration: 12, delay: 0.6 },
  { id: 4, left: 15, top: 6, duration: 7, delay: 3.0 },
  { id: 5, left: 9, top: 5, duration: 12, delay: 4.3 },
  { id: 6, left: 7, top: 61, duration: 11, delay: 3.5 },
  { id: 7, left: 38, top: 2, duration: 15, delay: 4.6 },
  { id: 8, left: 12, top: 8, duration: 10, delay: 0.2 },
  { id: 9, left: 10, top: 19, duration: 7, delay: 1.7 },
  { id: 10, left: 36, top: 99, duration: 9, delay: 1.9 },
  { id: 11, left: 14, top: 44, duration: 14, delay: 0.5 },
  { id: 12, left: 77, top: 20, duration: 10, delay: 5.0 },
  { id: 13, left: 1, top: 79, duration: 6, delay: 2.5 },
  { id: 14, left: 98, top: 64, duration: 12, delay: 3.5 },
];

export const SignUpView = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isSignup = pathname === "/signup";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F0F4FF]">
      {/* Subtle decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-right soft blob */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[80px]" />
        {/* Bottom-left soft blob */}
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/6 blur-[80px]" />
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(circle, #2563EB18 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Back to Home button */}
      <Button
        onClick={() => router.push("/")}
        variant="outline"
        className="absolute left-4 sm:left-6 top-4 sm:top-6 z-20 bg-white/90 border-[#E2E8F0] hover:bg-white hover:border-primary/40 hover:text-primary transition-all duration-200 text-[#475569] shadow-sm text-sm font-medium"
      >
        <IconArrowNarrowLeft size={16} className="mr-1.5" />
        Home
      </Button>

      {/* Main wrapper — centers the auth card */}
      <div className="relative w-full min-h-screen flex items-center justify-center p-4 md:p-8">
        <div
          className="w-full max-w-5xl min-h-[540px] lg:h-[660px] flex flex-col lg:flex-row rounded-2xl overflow-hidden"
          style={{
            boxShadow:
              "0 4px 6px -1px rgba(0,0,0,0.07), 0 20px 50px -10px rgba(37,99,235,0.15), 0 0 0 1px rgba(226,232,240,0.8)",
          }}
        >
          {/* ── MOBILE LAYOUT ── */}
          <div className="lg:hidden w-full flex flex-col">
            {/* Mobile brand header */}
            <div className="bg-primary px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/Logo.svg"
                  alt="Joblify Logo"
                  width={28}
                  height={28}
                />
                <span className="text-xl font-bold text-white tracking-tight">
                  Joblify
                </span>
              </div>
              <span className="text-white/70 text-sm">
                {isSignup ? "Create account" : "Sign in"}
              </span>
            </div>
            {/* Mobile form */}
            <div className="flex-1 bg-white">
              {isSignup ? <Signup /> : <Login />}
            </div>
          </div>

          {/* ── DESKTOP LAYOUT — sliding panels ── */}
          <div
            className={`hidden lg:flex w-full h-full transition-transform duration-700 ease-in-out ${
              isSignup ? "-translate-x-1/2" : "translate-x-0"
            }`}
          >
            {/* Panel 1 — Login Form */}
            <div className="w-1/2 shrink-0 bg-white border-r border-[#E2E8F0]">
              <Login />
            </div>

            {/* Panel 2 — Center Branding (always visible, switches sides) */}
            <div className="relative w-1/2 shrink-0 bg-primary overflow-hidden">
              {/* Decorative shapes */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-black/15 blur-2xl" />
                <div
                  className="absolute inset-0 opacity-[0.07]"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      -45deg,
                      transparent,
                      transparent 18px,
                      rgba(255,255,255,0.6) 18px,
                      rgba(255,255,255,0.6) 19px
                    )`,
                  }}
                />
              </div>

              <div className="relative h-full flex flex-col items-center justify-center gap-7 px-10 py-12 text-white">
                {/* Logo */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/25">
                    <Image
                      src="/Logo.svg"
                      alt="Joblify"
                      width={28}
                      height={28}
                    />
                  </div>
                  <Link
                    href="/"
                    className="text-4xl font-bold tracking-tight hover:opacity-90 transition-opacity"
                  >
                    Joblify
                  </Link>
                </div>

                {/* Headline */}
                <div className="text-center space-y-2.5 max-w-xs">
                  <h2 className="text-3xl font-bold leading-snug">
                    {isSignup ? "Start Your Journey" : "Welcome Back!"}
                  </h2>
                  <p className="text-white/75 text-sm leading-relaxed">
                    {isSignup
                      ? "Join thousands of professionals finding their dream careers"
                      : "Continue your path to amazing opportunities"}
                  </p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs">
                  {[
                    {
                      icon: <IconBriefcase size={20} />,
                      value: "10K+",
                      label: "Active Jobs",
                    },
                    {
                      icon: <IconUsers size={20} />,
                      value: "5K+",
                      label: "Companies",
                    },
                    {
                      icon: <IconStar size={20} />,
                      value: "98%",
                      label: "Success Rate",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white/10 border border-white/20 rounded-xl p-3 text-center hover:bg-white/15 transition-colors duration-200 backdrop-blur-sm"
                    >
                      <div className="flex justify-center mb-1.5 opacity-90">
                        {stat.icon}
                      </div>
                      <div className="text-lg font-bold leading-none">
                        {stat.value}
                      </div>
                      <div className="text-[10px] text-white/70 mt-1 leading-tight">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Toggle CTA */}
                <div className="absolute bottom-7 left-0 right-0 text-center">
                  <p className="text-white/70 text-sm">
                    {isSignup
                      ? "Already have an account?"
                      : "Don't have an account?"}
                    <button
                      onClick={() =>
                        router.push(isSignup ? "/login" : "/signup")
                      }
                      className="ml-2 text-white font-semibold underline underline-offset-2 hover:text-white/90 transition-colors"
                    >
                      {isSignup ? "Login here" : "Sign up now"}
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Panel 3 — Signup Form */}
            <div className="w-1/2 shrink-0 bg-white border-l border-[#E2E8F0]">
              <Signup />
            </div>
          </div>
        </div>
      </div>

      {/* Floating particles — very subtle in light theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `float ${particle.duration}s linear infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.4; }
          50% { transform: translateY(-80px) translateX(30px); opacity: 0.6; }
          90% { opacity: 0.1; }
        }
      `}</style>
    </div>
  );
};
