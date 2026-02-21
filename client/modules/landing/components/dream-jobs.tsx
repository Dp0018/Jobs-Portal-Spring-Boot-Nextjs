"use client";

import {
  IconArrowRight,
  IconSparkles,
  IconBriefcase,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DreamJobImg =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop";

const DreamJobs = () => {
  const router = useRouter();

  const stats = [
    { icon: IconBriefcase, value: "10K+", label: "Active Jobs" },
    { icon: IconUsers, value: "50K+", label: "Happy Candidates" },
    { icon: IconTrendingUp, value: "95%", label: "Success Rate" },
  ];

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-background via-card to-background px-6 md:px-12 lg:px-20 py-24 md:py-32 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">

          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-primary/20 to-primary/10 border border-primary/30 backdrop-blur-sm">
              <IconSparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary/80">
                Your Career Journey Starts Here
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Find Your Dream Job{" "}
              <span className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
              Connect with top employers, discover opportunities tailored to your
              skills, and take the next step in your career with confidence.
            </p>

            <div className="space-y-4 text-muted-foreground">
              {[
                "AI-powered job matching that understands your unique strengths",
                "Direct connections with hiring managers and decision makers",
                "Real-time application tracking and interview scheduling",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <p className="text-lg">{text}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => router.push("/signup")}
                className="group bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 transition-all hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 cursor-pointer"
              >
                Get Started Free
                <IconArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="group bg-accent/50 hover:bg-accent text-foreground border border-border hover:border-border/80 px-8 py-4 rounded-xl font-semibold text-lg backdrop-blur-sm transition-all">
                Watch Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full bg-linear-to-br from-accent to-card border-2 border-background flex items-center justify-center text-foreground text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="text-foreground font-semibold">Join 50,000+ professionals</p>
                <p className="text-muted-foreground">who found their dream jobs</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="absolute -inset-8 bg-linear-to-r from-primary/30 to-primary/10 rounded-3xl blur-3xl opacity-60" />

            <div className="relative bg-linear-to-br from-card/80 to-background/80 p-2 rounded-3xl shadow-2xl backdrop-blur-sm border border-border">
              <img
                src={DreamJobImg}
                alt="Professional team collaborating"
                className="w-full h-auto rounded-2xl object-cover shadow-xl"
              />

              {/* Floating success card */}
              <div className="absolute -bottom-6 -left-6 bg-linear-to-br from-card/95 to-background/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center">
                    <IconTrendingUp className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">95%</p>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                  </div>
                </div>
              </div>

              {/* Floating jobs card */}
              <div className="absolute -top-6 -right-6 bg-linear-to-br from-primary/95 to-primary/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                    <IconBriefcase className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary-foreground">10K+</p>
                    <p className="text-xs text-primary-foreground/80">Active Jobs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative bg-linear-to-br from-card/50 to-background/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DreamJobs;