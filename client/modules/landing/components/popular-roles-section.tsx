"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconArrowRight,
  IconChevronRight,
  IconCode,
  IconDatabase,
  IconDeviceDesktop,
  IconBriefcase,
  IconChartBar,
  IconUsers,
  IconCpu,
  IconCloud,
  IconShieldCheck,
  IconPalette,
  IconBulb,
  IconRocket,
  IconSparkles,
} from "@tabler/icons-react";

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const ROLE_PAGES = [
  {
    heading: "Engineering Roles",
    description: "Build products used by millions",
    bg: "from-blue-50 to-indigo-50",
    accent: "#3B82F6",
    roles: [
      { label: "Full Stack Developer", count: "22.4K+", icon: IconCode },
      { label: "Front End Developer", count: "5.3K+", icon: IconDeviceDesktop },
      { label: "Backend Developer", count: "8.1K+", icon: IconDatabase },
      { label: "DevOps Engineer", count: "4.2K+", icon: IconCloud },
      { label: "Mobile Developer", count: "3.7K+", icon: IconCpu },
      { label: "Security Engineer", count: "1.9K+", icon: IconShieldCheck },
    ],
  },
  {
    heading: "Data & Analytics",
    description: "Turn data into decisions",
    bg: "from-purple-50 to-fuchsia-50",
    accent: "#8B5CF6",
    roles: [
      { label: "Data Scientist", count: "12.1K+", icon: IconChartBar },
      { label: "Data Analyst", count: "9.8K+", icon: IconDatabase },
      { label: "ML Engineer", count: "6.3K+", icon: IconCpu },
      { label: "Business Analyst", count: "4.8K+", icon: IconBriefcase },
      { label: "Product Analyst", count: "2.2K+", icon: IconBulb },
      { label: "AI/LLM Engineer", count: "1.5K+", icon: IconSparkles },
    ],
  },
  {
    heading: "Management & Strategy",
    description: "Lead teams, shape products",
    bg: "from-emerald-50 to-teal-50",
    accent: "#10B981",
    roles: [
      { label: "Technical Lead", count: "10.1K+", icon: IconUsers },
      { label: "Engineering Manager", count: "5.9K+", icon: IconBriefcase },
      { label: "Product Manager", count: "7.4K+", icon: IconRocket },
      { label: "Scrum Master", count: "2.1K+", icon: IconShieldCheck },
      { label: "CTO / VP Engineering", count: "980+", icon: IconBulb },
      { label: "Functional Consultant", count: "5K+", icon: IconCode },
    ],
  },
];

/* ─────────────────────────────────────────────
   Promo banner data
───────────────────────────────────────────── */
const PROMO_CHIPS = [
  "Resume Builder",
  "Mock Interviews",
  "Salary Insights",
  "Career Paths",
  "Skill Assessments",
];

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */
export const PopularRolesSection = () => {
  const router = useRouter();
  const [activePage, setActivePage] = useState(0);
  const current = ROLE_PAGES[activePage];

  return (
    <section className="bg-transparent py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* ════════════════════════════════════
            PROMO BANNER — like Naukri Campus
        ════════════════════════════════════ */}
        <div
          className="relative overflow-hidden rounded-[2.5rem] border border-amber-200/50 p-8 md:p-12 shadow-2xl shadow-amber-500/10"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(254, 243, 199, 0.4) 40%, rgba(255, 247, 237, 0.8) 100%)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Animated gradient accent */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-100/30 to-transparent -rotate-12 translate-x-1/4 pointer-events-none" />
          {/* decorative circles */}
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-amber-200/40 pointer-events-none" />
          <div className="absolute right-20 -bottom-8 w-24 h-24 rounded-full bg-orange-200/30 pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-3 flex-1">
              {/* label */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300/60 text-amber-800 text-[10px] font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                Just launched
              </div>

              <h2 className="text-2xl md:text-4xl font-black text-[#0F172A] leading-[1.1] tracking-tight">
                Empower your career with <span className="text-amber-600">Premium Tools</span>
              </h2>
              <p className="text-base text-[#64748B] max-w-xl leading-relaxed font-medium">
                Unlock exclusive resume builders, AI-driven mock interviews, and personalized career roadmaps designed to accelerate your growth.
              </p>

              {/* chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {PROMO_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => router.push("/find-jobs")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-200 rounded-full text-xs font-semibold text-[#0F172A] hover:border-amber-400 hover:shadow-sm transition-all"
                  >
                    {chip}
                    <IconChevronRight size={12} className="text-amber-500" />
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => router.push("/find-jobs")}
              className="shrink-0 h-14 px-10 font-black text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)",
                boxShadow: "0 10px 25px -5px rgba(245,158,11,0.5)",
              }}
            >
              Get Started Now
              <IconArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>

        {/* ════════════════════════════════════
            POPULAR ROLES — paginated panels
        ════════════════════════════════════ */}
        <div>
          <div className="flex flex-col gap-2 mb-10">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                Discover jobs by roles
              </h2>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-100 rounded-full">
                <IconSparkles size={12} className="text-purple-500" />
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-tighter">AI Curated</span>
              </div>
            </div>
            <p className="text-[15px] text-[#64748B] font-medium">
              Find your next career move across our most popular categories
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Left panel — illustration + role category tabs */}
            <div
              className={`relative overflow-hidden rounded-[2rem] border border-[#E2E8F0] p-8 lg:w-72 shrink-0 bg-gradient-to-br ${current.bg} shadow-lg shadow-blue-500/5 flex flex-col justify-between min-h-[320px]`}
            >
              {/* decorative shapes */}
              <div
                className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full opacity-20 blur-2xl"
                style={{ background: current.accent }}
              />

              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 backdrop-blur-md rounded-full border border-white/40 mb-6 shadow-sm">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: current.accent }} />
                  <span className="text-[10px] font-bold text-[#0F172A] uppercase tracking-wider">Top Sector</span>
                </div>

                <h3 className="text-xl font-black text-[#0F172A] mb-2">
                  {current.heading}
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed mb-6 font-medium">
                  {current.description}
                </p>

                {/* page dots */}
                <div className="flex items-center gap-2">
                  {ROLE_PAGES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePage(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === activePage
                          ? "w-8 h-2.5 bg-primary shadow-sm"
                          : "w-2.5 h-2.5 bg-white/80 hover:bg-primary/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right panel — 2×3 role grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
              {current.roles.map(({ label, count, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() =>
                    router.push(
                      `/find-jobs?role=${label.toLowerCase().replace(/\s/g, "-")}`,
                    )
                  }
                  className="group flex items-center justify-between bg-white border border-[#E2E8F0] rounded-2xl px-6 py-5 text-left hover:border-primary/40 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${current.accent}15` }}
                    >
                      <Icon size={20} style={{ color: current.accent }} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-[#0F172A] group-hover:text-primary transition-colors leading-tight mb-1">
                        {label}
                      </p>
                      <p className="text-xs text-[#64748B] font-semibold">
                        <span className="text-primary font-black">
                          {count}
                        </span>{" "}
                        Live Openings
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-[#F1F5F9] flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                    <IconChevronRight
                      size={14}
                      className="text-[#CBD5E1] group-hover:text-white transition-colors"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tab switchers (category nav) */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {ROLE_PAGES.map(({ heading }, i) => (
              <button
                key={heading}
                onClick={() => setActivePage(i)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  i === activePage
                    ? "bg-primary text-white shadow-lg shadow-blue-500/30 -translate-y-0.5"
                    : "bg-white text-[#64748B] border border-[#E2E8F0] hover:border-primary/30 hover:text-primary"
                }`}
              >
                {heading}
              </button>
            ))}
          </div>
        </div>

        {/* ── bottom CTA ── */}
        <div className="text-center py-4">
          <p className="text-sm text-[#64748B] mb-3">
            Can&apos;t find what you&apos;re looking for?
          </p>
          <Button
            onClick={() => router.push("/find-jobs")}
            className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-11 rounded-xl shadow-sm hover:shadow-md transition-all gap-2"
          >
            <IconRocket size={16} />
            Browse all <span className="font-black">50,000+</span> jobs
          </Button>
        </div>
      </div>
    </section>
  );
};
