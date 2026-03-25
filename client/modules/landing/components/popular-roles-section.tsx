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
    <section className="bg-white border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* ════════════════════════════════════
            PROMO BANNER — like Naukri Campus
        ════════════════════════════════════ */}
        <div
          className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] p-6 md:p-8"
          style={{
            background:
              "linear-gradient(135deg, #fffbeb 0%, #fef3c7 40%, #fff7ed 100%)",
          }}
        >
          {/* decorative circles */}
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-amber-200/40 pointer-events-none" />
          <div className="absolute right-20 -bottom-8 w-24 h-24 rounded-full bg-orange-200/30 pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-3 flex-1">
              {/* label */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300/60 text-amber-800 text-[10px] font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Just launched
              </div>

              <h3 className="text-xl md:text-2xl font-black text-[#0F172A] leading-tight">
                Introducing career tools for job seekers &amp; fresh grads
              </h3>
              <p className="text-sm text-[#64748B] max-w-lg leading-relaxed">
                Explore resume builder, mock interviews, salary insights, and
                career paths designed to help you land the right role faster.
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
              className="shrink-0 h-11 px-6 font-bold text-white rounded-xl shadow-md hover:shadow-lg transition-all"
              style={{
                background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                boxShadow: "0 4px 14px rgba(245,158,11,0.4)",
              }}
            >
              Explore now
              <IconArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>

        {/* ════════════════════════════════════
            POPULAR ROLES — paginated panels
        ════════════════════════════════════ */}
        <div>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
                Discover jobs across popular roles
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                Select a role and we&apos;ll show you relevant jobs for it
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Left panel — illustration + role category tabs */}
            <div
              className={`relative overflow-hidden rounded-2xl border border-[#E2E8F0] p-6 lg:w-64 shrink-0 bg-gradient-to-br ${current.bg} flex flex-col justify-between min-h-[280px]`}
            >
              {/* decorative shapes */}
              <div
                className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full opacity-30"
                style={{ background: current.accent }}
              />
              <div
                className="absolute -left-4 top-4 w-20 h-20 rounded-full opacity-15"
                style={{ background: current.accent }}
              />

              {/* abstract SVG person shape */}
              <div className="relative mb-4">
                <svg
                  viewBox="0 0 120 120"
                  className="w-24 h-24 opacity-80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="60"
                    cy="30"
                    r="18"
                    fill={current.accent}
                    fillOpacity="0.25"
                  />
                  <circle
                    cx="60"
                    cy="28"
                    r="14"
                    fill={current.accent}
                    fillOpacity="0.4"
                  />
                  <rect
                    x="38"
                    y="52"
                    width="44"
                    height="38"
                    rx="22"
                    fill={current.accent}
                    fillOpacity="0.3"
                  />
                  <rect
                    x="30"
                    y="60"
                    width="18"
                    height="8"
                    rx="4"
                    fill={current.accent}
                    fillOpacity="0.4"
                    transform="rotate(-20 30 60)"
                  />
                  <rect
                    x="72"
                    y="60"
                    width="18"
                    height="8"
                    rx="4"
                    fill={current.accent}
                    fillOpacity="0.4"
                    transform="rotate(20 72 60)"
                  />
                  <rect
                    x="46"
                    y="86"
                    width="12"
                    height="22"
                    rx="6"
                    fill={current.accent}
                    fillOpacity="0.35"
                  />
                  <rect
                    x="62"
                    y="86"
                    width="12"
                    height="22"
                    rx="6"
                    fill={current.accent}
                    fillOpacity="0.35"
                  />
                </svg>
              </div>

              <div className="relative">
                <h3 className="text-base font-black text-[#0F172A] mb-1">
                  {current.heading}
                </h3>
                <p className="text-xs text-[#64748B] mb-4">
                  {current.description}
                </p>

                {/* page dots */}
                <div className="flex items-center gap-1.5">
                  {ROLE_PAGES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePage(i)}
                      className={`rounded-full transition-all duration-200 ${
                        i === activePage
                          ? "w-5 h-2 bg-primary"
                          : "w-2 h-2 bg-[#CBD5E1] hover:bg-primary/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right panel — 2×3 role grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
              {current.roles.map(({ label, count, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() =>
                    router.push(
                      `/find-jobs?role=${label.toLowerCase().replace(/\s/g, "-")}`,
                    )
                  }
                  className="group flex items-center justify-between bg-white border border-[#E2E8F0] rounded-xl px-4 py-3.5 text-left hover:border-primary/30 hover:shadow-md transition-all duration-150"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors group-hover:opacity-90"
                      style={{ backgroundColor: `${current.accent}18` }}
                    >
                      <Icon size={15} style={{ color: current.accent }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A] group-hover:text-primary transition-colors leading-tight">
                        {label}
                      </p>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        <span className="font-semibold text-[#475569]">
                          {count}
                        </span>{" "}
                        Jobs
                        <span className="ml-1">›</span>
                      </p>
                    </div>
                  </div>
                  <IconChevronRight
                    size={15}
                    className="text-[#CBD5E1] group-hover:text-primary group-hover:translate-x-0.5 transition-all"
                  />
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
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  i === activePage
                    ? "bg-primary text-white shadow-sm"
                    : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]"
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
