"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { updateFilter } from "@/modules/redux/filter-slice";

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const EXPERIENCE_LEVELS = [
  { label: "Fresher (0 yrs)", value: "0" },
  { label: "1 year", value: "1" },
  { label: "2 years", value: "2" },
  { label: "3 years", value: "3" },
  { label: "4 years", value: "4" },
  { label: "5 years", value: "5" },
  { label: "6–10 years", value: "6" },
  { label: "10+ years", value: "10" },
];

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

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */
export const HeroSearchSection = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");

  const handleSearch = () => {
    dispatch(
      updateFilter({
        keyword,
        location,
        experience: experience ? Number(experience) : undefined,
      }),
    );
    router.push("/find-jobs");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="relative overflow-hidden">
      {/* ── Layered gradient background ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, #dbeafe 0%, #f0f4ff 45%, #f8fafc 100%)",
        }}
      />
      {/* subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, #2563EB18 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        {/* ── Headline ── */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight mb-3 leading-tight">
            Find your dream job now
          </h1>
          <p className="text-[#64748B] text-lg font-medium">
            <span className="text-primary font-bold">5 lakh+</span> jobs for you
            to explore
          </p>

          {/* live stats row */}
          <div className="flex items-center justify-center gap-6 mt-4">
            {LIVE_STATS.map(({ val, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-[#475569]">
                  <strong className="text-[#0F172A]">{val}</strong> {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Unified pill search bar ── */}
        <div className="max-w-3xl mx-auto mb-8">
          <div
            className="flex items-center bg-white rounded-2xl overflow-hidden"
            style={{
              boxShadow:
                "0 4px 24px rgba(37,99,235,0.12), 0 1px 4px rgba(15,23,42,0.08), 0 0 0 1px rgba(226,232,240,0.9)",
            }}
          >
            {/* Keyword */}
            <div className="flex items-center gap-2.5 flex-1 px-4 py-1 min-w-0">
              <IconSearch size={18} className="text-[#94A3B8] shrink-0" />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter skills / designations / companies"
                className="border-0 shadow-none focus-visible:ring-0 p-0 h-10 text-sm text-[#0F172A] placeholder:text-[#94A3B8] bg-transparent"
              />
            </div>

            {/* Divider */}
            <div className="w-px h-10 bg-[#E2E8F0] shrink-0" />

            {/* Experience */}
            <div className="px-3 py-1 w-44 shrink-0">
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger className="border-0 shadow-none focus:ring-0 h-10 text-sm text-[#475569] bg-transparent gap-2 pl-0">
                  <IconBriefcase
                    size={16}
                    className="text-[#94A3B8] shrink-0"
                  />
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#E2E8F0] rounded-xl shadow-lg">
                  {EXPERIENCE_LEVELS.map(({ label, value }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="text-sm text-[#0F172A] focus:bg-primary/8 focus:text-primary rounded-lg"
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Divider */}
            <div className="w-px h-10 bg-[#E2E8F0] shrink-0" />

            {/* Location */}
            <div className="flex items-center gap-2.5 px-4 py-1 w-44 shrink-0">
              <IconMapPin size={16} className="text-[#94A3B8] shrink-0" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter location"
                className="border-0 shadow-none focus-visible:ring-0 p-0 h-10 text-sm text-[#0F172A] placeholder:text-[#94A3B8] bg-transparent"
              />
            </div>

            {/* Search CTA */}
            <div className="p-1.5 shrink-0">
              <Button
                onClick={handleSearch}
                className="h-10 px-6 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-sm transition-all hover:shadow-md"
                style={{
                  boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
                }}
              >
                Search
              </Button>
            </div>
          </div>

          {/* Quick suggestions */}
          <div className="flex items-center gap-2 mt-3 px-1">
            <span className="text-xs text-[#94A3B8] shrink-0">Trending:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                "React Developer",
                "Data Analyst",
                "Product Manager",
                "DevOps",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setKeyword(s);
                    dispatch(updateFilter({ keyword: s }));
                    router.push("/find-jobs");
                  }}
                  className="text-xs text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Category chips ── */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto">
          {CATEGORY_CHIPS.map(({ label, icon: Icon, href }) => (
            <button
              key={label}
              onClick={() => router.push(href)}
              className="group flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#475569] font-medium hover:border-primary/40 hover:text-primary hover:bg-primary/5 hover:shadow-sm transition-all duration-150"
            >
              <div className="w-6 h-6 rounded-lg bg-[#F1F5F9] flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                <Icon
                  size={13}
                  className="text-[#64748B] group-hover:text-primary transition-colors"
                />
              </div>
              {label}
              <IconChevronRight
                size={13}
                className="text-[#CBD5E1] group-hover:text-primary transition-colors"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
