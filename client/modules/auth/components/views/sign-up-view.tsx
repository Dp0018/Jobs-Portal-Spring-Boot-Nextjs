"use client";

import {
  IconArrowNarrowLeft,
  IconBriefcase,
  IconUsers,
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
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Home button */}
      <Button
        onClick={() => router.push("/")}
        variant="outline"
        className="absolute left-4 sm:left-6 top-4 sm:top-6 z-10 bg-card/60 backdrop-blur-md border-border/50 hover:bg-card hover:border-primary/40 transition-all duration-300 text-foreground"
      >
        <IconArrowNarrowLeft size={18} className="mr-1" />
        Home
      </Button>

      {/* Main container */}
      <div className="relative w-full min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-7xl min-h-[500px] lg:h-[680px] flex flex-col lg:flex-row rounded-2xl lg:rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-border/50">
          {/* Mobile Layout */}
          <div className="lg:hidden w-full flex flex-col">
            <div className="bg-linear-to-r from-primary to-primary/80 p-6 text-center">
              <div className="flex gap-2 items-center justify-center mb-2">
                <Image
                  src="/Logo.svg"
                  alt="Joblify Logo"
                  width={32}
                  height={32}
                />
                <span className="text-2xl font-bold font-roboto text-primary-foreground">
                  Joblify
                </span>
              </div>
              <p className="text-primary-foreground/90 text-sm">
                {isSignup ? "Create your account" : "Sign in to continue"}
              </p>
            </div>
            <div className="flex-1 bg-card/40 backdrop-blur-xl">
              {isSignup ? <Signup /> : <Login />}
            </div>
          </div>

          {/* Desktop Layout - Sliding animation */}
          <div
            className={`hidden lg:flex w-full h-full transition-transform duration-1000 ease-in-out ${
              isSignup ? "-translate-x-1/2" : "translate-x-0"
            }`}
          >
            {/* Login Form */}
            <div className="w-1/2 shrink-0 bg-card/40 backdrop-blur-xl border-r border-border/30">
              <Login />
            </div>

            {/* Center Branding Panel */}
            <div className="relative w-1/2 shrink-0 bg-linear-to-br from-primary to-primary/80 transition-all duration-700 ease-in-out overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl bg-white/10 transition-all duration-700" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl bg-black/20 transition-all duration-700" />
              </div>

              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                      45deg, transparent, transparent 20px,
                      rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px
                    )`,
                }}
              />

              <div className="relative h-full flex flex-col items-center justify-center gap-8 p-12 text-primary-foreground">
                {/* Logo */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                  <div className="flex gap-3 items-center hover:scale-105 transition-transform duration-300">
                    <Image
                      src="/Logo.svg"
                      alt="Joblify Logo"
                      width={48}
                      height={48}
                    />
                    <div className="text-5xl font-bold font-roboto tracking-tight drop-shadow-lg">
                      <Link
                        href="/"
                        className="hover:opacity-90 transition-opacity"
                      >
                        Joblify
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Heading */}
                <div className="text-center space-y-3 max-w-md">
                  <h2 className="text-4xl font-bold font-nunito leading-tight">
                    {isSignup ? "Start Your Journey" : "Welcome Back!"}
                  </h2>
                  <p className="text-lg text-primary-foreground/90 leading-relaxed">
                    {isSignup
                      ? "Join thousands of professionals finding their dream careers"
                      : "Continue your path to amazing opportunities"}
                  </p>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-3 w-full max-w-lg mt-2">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 hover:bg-white/15 transition-all hover:scale-105 duration-300">
                    <IconBriefcase className="h-8 w-8 mx-auto mb-2 opacity-90" />
                    <div className="text-2xl font-bold">10K+</div>
                    <div className="text-xs text-primary-foreground/80 mt-1">
                      Active Jobs
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 hover:bg-white/15 transition-all hover:scale-105 duration-300">
                    <IconUsers className="h-8 w-8 mx-auto mb-2 opacity-90" />
                    <div className="text-2xl font-bold">5K+</div>
                    <div className="text-xs text-primary-foreground/80 mt-1">
                      Companies
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 hover:bg-white/15 transition-all hover:scale-105 duration-300">
                    <div className="text-2xl font-bold mb-2">98%</div>
                    <div className="text-xs text-primary-foreground/80">
                      Success Rate
                    </div>
                  </div>
                </div>

                {/* Toggle prompt */}
                <div className="absolute bottom-8 left-0 right-0 text-center">
                  <p className="text-primary-foreground/80 text-sm font-medium">
                    {isSignup
                      ? "Already have an account?"
                      : "Don't have an account?"}
                    <button
                      onClick={() =>
                        router.push(isSignup ? "/login" : "/signup")
                      }
                      className="ml-2 font-bold underline hover:text-primary-foreground transition-colors underline-offset-2"
                    >
                      {isSignup ? "Login here" : "Sign up now"}
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Signup Form */}
            <div className="w-1/2 shrink-0 bg-card/40 backdrop-blur-xl border-l border-border/30">
              <Signup />
            </div>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-foreground/20 rounded-full"
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
            10% { opacity: 0.3; }
            50% { transform: translateY(-100px) translateX(50px); opacity: 0.5; }
            90% { opacity: 0.1; }
          }
        `}</style>
    </div>
  );
};