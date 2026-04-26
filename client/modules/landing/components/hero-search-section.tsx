"use client";

import { Badge } from "@/components/ui/badge";
import {
  IconSearch,
  IconMapPin,
  IconBriefcase,
  IconChevronRight,
  IconTrendingUp,
  IconBuilding,
  IconUsers,
  IconStar,
  IconCode,
  IconAnalyze,
  IconSchool,
  IconTarget,
  IconBriefcase2,
} from "@tabler/icons-react";
import { 
  Upload, 
  ArrowRight, 
  ScanSearch, 
  ShieldCheck, 
  Bot, 
  Briefcase 
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */

const CATEGORY_CHIPS = [
  { label: "Remote", icon: IconBuilding, href: "/find-jobs?type=remote" },
  { label: "MNC", icon: IconBuilding, href: "/find-jobs?category=mnc" },
  { label: "HR", icon: IconUsers, href: "/find-jobs?role=hr" },
  {
    label: "Project Mgmt",
    icon: IconTarget,
    href: "/find-jobs?role=project-management",
  },
  {
    label: "Data Science",
    icon: IconAnalyze,
    href: "/find-jobs?role=data-science",
  },
  {
    label: "Fortune 500",
    icon: IconStar,
    href: "/find-jobs?category=fortune500",
  },
  {
    label: "Analytics",
    icon: IconTrendingUp,
    href: "/find-jobs?role=analytics",
  },
  {
    label: "Software Eng",
    icon: IconCode,
    href: "/find-jobs?role=software-engineering",
  },
  { label: "Fresher", icon: IconSchool, href: "/find-jobs?experience=0" },
  {
    label: "Internship",
    icon: IconBriefcase2,
    href: "/find-jobs?type=internship",
  },
  { label: "Sales", icon: IconBriefcase, href: "/find-jobs?role=sales" },
];

const LIVE_STATS = [
  { val: "5L+", label: "jobs" },
  { val: "10K+", label: "companies" },
  { val: "200K+", label: "candidates" },
];

const FEATURE_PILLS = [
  {
    icon: ScanSearch,
    text: "Instant Resume Match",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: ShieldCheck,
    text: "Fair & Unbiased Screening",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Bot,
    text: "AI Fraud Detection",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Briefcase,
    text: "60K+ active jobs",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */
export const HeroSearchSection = () => {
  const router = useRouter();

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#EEF4FF] via-[#F0F7FF] to-[#F8FAFC]">
        {/* ── Layered gradient background ── */}
        <div className="absolute inset-0 pointer-events-none">
          {/* subtle dot grid */}
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: `radial-gradient(circle, #3B82F6 0.8px, transparent 0.8px)`,
              backgroundSize: "24px 24px",
            }}
          />
          {/* Gradient orbs */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute top-20 -right-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-sky-200/25 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* ── Left column: Text + CTA ── */}
            <div className="text-left">
              {/* Premium badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 mb-5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-widest">
                    Premium
                  </span>
                </span>
                <span className="w-px h-3 bg-blue-200" />
                <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                  🔥 Updated Daily
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.2rem] font-black text-[#0F172A] tracking-tight leading-[1.1] mb-3">
                Find Your{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Dream Job
                  </span>
                  <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-40" />
                </span>
              </h1>

              {/* Sub-headline */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg text-[#64748B]">✨</span>
                <p className="text-base sm:text-lg text-[#64748B] font-medium">
                  AI-Powered Job Matching
                </p>
                <span className="text-lg text-[#64748B]">✨</span>
              </div>

              {/* Live stats row */}
              <div className="flex items-center gap-4 mb-6">
                {LIVE_STATS.map(({ val, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-[#475569]">
                      <strong className="text-[#0F172A]">{val}</strong> {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Description */}
              <p className="text-sm sm:text-[15px] text-[#64748B] leading-relaxed max-w-lg mb-8">
                Discover from over <span className="text-primary font-bold">5 lakh+</span> jobs with intelligent AI-driven
                matching — upload your CV and let our AI do the rest.
              </p>

              {/* Upload CV CTA Button */}
              <button className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 mb-8">
                <Upload className="w-4 h-4" />
                Upload CV — Get Match Score
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/20 to-emerald-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </button>

              {/* Feature pills row */}
              <div className="flex flex-wrap gap-3">
                {FEATURE_PILLS.map(({ icon: Icon, text, color, bg }) => (
                  <div
                    key={text}
                    className={`flex items-center gap-2 px-3.5 py-2 ${bg} border border-opacity-20 rounded-xl text-xs font-medium ${color}`}
                    style={{ borderColor: "rgba(0,0,0,0.1)" }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right column: Hero Illustration ── */}
            <div className="hidden lg:flex justify-center items-center relative">
              <div className="relative w-full max-w-md">
                {/* Floating glow behind image */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-3xl blur-2xl scale-90" />
                <Image
                  src="/hero-illustration.png"
                  alt="AI-Powered Job Matching"
                  width={500}
                  height={500}
                  className="relative z-10 drop-shadow-2xl animate-float"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── Category chips ── */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-[#0F172A] mb-2">Explore by Category</h2>
            <p className="text-sm text-[#64748B]">Find jobs in your preferred industry and domain</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-5xl mx-auto">
            {CATEGORY_CHIPS.map(({ label, icon: Icon, href }) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                className="group flex items-center gap-2 px-4 py-3 bg-white border border-[#E2E8F0] rounded-2xl text-sm text-[#475569] font-semibold hover:border-primary/40 hover:text-primary hover:bg-primary/5 hover:shadow-sm transition-all duration-200"
              >
                <div className="w-7 h-7 rounded-lg bg-[#F1F5F9] flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                  <Icon
                    size={14}
                    className="text-[#64748B] group-hover:text-primary transition-colors"
                  />
                </div>
                {label}
                <IconChevronRight
                  size={14}
                  className="text-[#CBD5E1] group-hover:text-primary transition-colors"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        :global(.animate-float) {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};
