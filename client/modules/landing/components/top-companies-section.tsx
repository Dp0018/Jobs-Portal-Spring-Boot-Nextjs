"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconChevronLeft,
  IconChevronRight,
  IconStar,
  IconMapPin,
  IconBriefcase,
  IconBuilding,
  IconArrowRight,
  IconUsers,
  IconTrendingUp,
} from "@tabler/icons-react";

/* ─────────────────────────────────────────────
   Data — replace with your API data as needed
───────────────────────────────────────────── */
const COMPANY_CATEGORIES = [
  {
    id: "mnc",
    label: "MNCs",
    count: "2.3K+",
    logos: ["AM", "OC", "MK", "CG"],
    colors: ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"],
  },
  {
    id: "internet",
    label: "Internet",
    count: "254",
    logos: ["AC", "RP", "ME", "BR"],
    colors: ["#EF4444", "#6366F1", "#F59E0B", "#EC4899"],
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    count: "1.1K+",
    logos: ["MK", "BD", "HT", "PC"],
    colors: ["#0F172A", "#1E40AF", "#DC2626", "#15803D"],
  },
  {
    id: "fortune500",
    label: "Fortune 500",
    count: "114",
    logos: ["BP", "AT", "EM", "GM"],
    colors: ["#065F46", "#1D4ED8", "#B91C1C", "#1F2937"],
  },
  {
    id: "product",
    label: "Product",
    count: "1.3K+",
    logos: ["GG", "FB", "AM", "NF"],
    colors: ["#4285F4", "#1877F2", "#FF9900", "#E50914"],
  },
  {
    id: "startup",
    label: "Startup",
    count: "3.5K+",
    logos: ["UP", "RZ", "SW", "CR"],
    colors: ["#7C3AED", "#0EA5E9", "#10B981", "#F97316"],
  },
];

const FEATURED_COMPANIES = [
  {
    id: 1,
    name: "Avalara Technologies",
    initials: "AV",
    bgColor: "#EA580C",
    rating: 2.9,
    reviews: "442",
    tagline: "We're transforming tax through tech.",
    openings: 124,
    location: "Bengaluru",
    tags: ["Fintech", "SaaS"],
  },
  {
    id: 2,
    name: "Capgemini",
    initials: "CG",
    bgColor: "#0070AD",
    rating: 3.7,
    reviews: "52.4K+",
    tagline: "Global leader in technology services.",
    openings: 3200,
    location: "Multiple cities",
    tags: ["IT Services", "Consulting"],
  },
  {
    id: 3,
    name: "Optum",
    initials: "OP",
    bgColor: "#E05A00",
    rating: 4.0,
    reviews: "7.8K+",
    tagline: "Leading digital health tech company in India.",
    openings: 560,
    location: "Hyderabad",
    tags: ["Healthcare", "Tech"],
  },
  {
    id: 4,
    name: "Tata Consultancy",
    initials: "TC",
    bgColor: "#1A1A2E",
    rating: 3.3,
    reviews: "112.6K+",
    tagline: "Explore challenging opportunities at TCS.",
    openings: 8000,
    location: "Pan India",
    tags: ["IT", "Consulting"],
  },
  {
    id: 5,
    name: "Infosys",
    initials: "IN",
    bgColor: "#007CC3",
    rating: 3.5,
    reviews: "89.2K+",
    tagline: "Navigate your next with Infosys.",
    openings: 5500,
    location: "Pan India",
    tags: ["IT Services", "AI"],
  },
  {
    id: 6,
    name: "Flipkart",
    initials: "FK",
    bgColor: "#2874F0",
    rating: 4.1,
    reviews: "14.3K+",
    tagline: "Building India's largest commerce ecosystem.",
    openings: 890,
    location: "Bengaluru",
    tags: ["E-commerce", "Product"],
  },
];

/* ── Star rating renderer ── */
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    <IconStar size={13} className="text-amber-400 fill-amber-400" />
    <span className="text-xs font-bold text-[#0F172A]">
      {rating.toFixed(1)}
    </span>
  </div>
);

/* ── Company logo placeholder ── */
const LogoPlaceholder = ({
  initials,
  bgColor,
  size = "md",
}: {
  initials: string;
  bgColor: string;
  size?: "sm" | "md" | "lg";
}) => {
  const sizes = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-lg",
  };
  return (
    <div
      className={`${sizes[size]} rounded-xl flex items-center justify-center font-black text-white shrink-0`}
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  );
};

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */
export const TopCompaniesSection = () => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: dir === "right" ? amount : -amount,
      behavior: "smooth",
    });
    setTimeout(() => setScrollPos(scrollRef.current?.scrollLeft ?? 0), 350);
  };

  return (
    <section className="bg-transparent py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* ════════════════════════════════════
            SECTION A — Category cards
        ════════════════════════════════════ */}
        <div>
          <div className="flex items-end justify-between mb-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                  Top companies hiring now
                </h2>
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-[10px] font-bold px-2 py-0 h-5">
                  FEATURED
                </Badge>
              </div>
              <p className="text-[15px] text-[#64748B] font-medium">
                Explore openings across top industry segments and MNCs
              </p>
            </div>

            {/* scroll arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-full border border-[#E2E8F0] bg-white flex items-center justify-center text-[#64748B] hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all disabled:opacity-30"
                disabled={scrollPos === 0}
              >
                <IconChevronLeft size={16} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded-full border border-[#E2E8F0] bg-white flex items-center justify-center text-[#64748B] hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
              >
                <IconChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* scrollable row */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-6 -mx-1 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {COMPANY_CATEGORIES.map(({ id, label, count, logos, colors }) => (
              <button
                key={id}
                onClick={() => router.push(`/find-jobs?category=${id}`)}
                className="group flex-shrink-0 w-[280px] bg-white/80 backdrop-blur-sm border border-[#E2E8F0] rounded-2xl p-5 text-left hover:border-primary/40 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300"
              >
                {/* header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex-1">
                    <p className="text-[15px] font-bold text-[#0F172A] group-hover:text-primary transition-colors flex items-center gap-1.5 mb-1">
                      {label}
                      <IconChevronRight
                        size={14}
                        className="text-[#CBD5E1] group-hover:text-primary transition-colors"
                      />
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="font-semibold text-green-700">{count}</span>
                      <span className="opacity-80">hiring now</span>
                    </div>
                  </div>
                </div>

                {/* logo strip */}
                <div className="flex items-center gap-1.5">
                  {logos.map((abbr, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-sm border-2 border-white -ml-2 first:ml-0 group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: colors[i], zIndex: 4 - i }}
                    >
                      {abbr}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-xl border-2 border-white bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400 -ml-2 z-0">
                    +
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════
            SECTION B — Featured companies
        ════════════════════════════════════ */}
        <div>
          <div className="flex flex-col gap-2 mb-8">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                Featured companies hiring
              </h2>
              <IconStar className="text-amber-400 fill-amber-400" size={24} />
            </div>
            <p className="text-[15px] text-[#64748B] font-medium">
              Join top-tier workplaces and verified employers today
            </p>
          </div>

          {/* 3-col grid → 2-col on md → 1-col on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_COMPANIES.map((co) => (
              <div
                key={co.id}
                className="group relative bg-white border border-[#E2E8F0] rounded-[2rem] p-6 flex flex-col hover:border-primary/30 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => router.push(`/find-jobs?company=${co.id}`)}
              >
                {/* Decorative background accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-50 to-transparent -mr-10 -mt-10 rounded-full group-hover:scale-150 transition-transform duration-500" />

                {/* logo + rating row */}
                <div className="flex items-start justify-between mb-6">
                  <div className="p-1 rounded-2xl bg-white shadow-sm border border-[#F1F5F9]">
                    <LogoPlaceholder
                      initials={co.initials}
                      bgColor={co.bgColor}
                      size="lg"
                    />
                  </div>
                  <div className="text-right">
                    <StarRating rating={co.rating} />
                    <p className="text-[11px] text-[#94A3B8] font-semibold mt-0.5 uppercase tracking-wider">
                      {co.reviews} reviews
                    </p>
                  </div>
                </div>

                {/* company info */}
                <div className="flex-1 relative z-10">
                  <h3 className="text-lg font-black text-[#0F172A] mb-1 group-hover:text-primary transition-colors">
                    {co.name}
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed mb-4 line-clamp-2 min-h-[40px]">
                    {co.tagline}
                  </p>

                  {/* meta strip */}
                  <div className="flex items-center gap-4 text-xs font-semibold text-[#64748B] mb-5">
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg">
                      <IconBriefcase size={14} className="text-blue-500" />
                      {co.openings.toLocaleString()} Jobs
                    </span>
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg">
                      <IconMapPin size={14} className="text-rose-500" />
                      {co.location}
                    </span>
                  </div>

                  {/* tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {co.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="bg-white text-[#475569] text-[10px] font-bold px-3 py-1 rounded-full border-[#E8EDF2]"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-[#E2E8F0] text-primary font-bold text-xs hover:bg-primary hover:text-white hover:border-primary transition-all rounded-2xl h-11 group/btn shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/find-jobs?company=${co.id}`);
                  }}
                >
                  Explore Vacancies
                  <IconArrowRight
                    size={14}
                    className="ml-2 group-hover/btn:translate-x-1 transition-transform"
                  />
                </Button>
              </div>
            ))}
          </div>

          {/* View all CTA */}
          <div className="text-center mt-8">
            <Button
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary hover:text-white font-semibold px-8 h-10 rounded-full transition-all hover:shadow-md"
              onClick={() => router.push("/find-jobs")}
            >
              View all companies
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
