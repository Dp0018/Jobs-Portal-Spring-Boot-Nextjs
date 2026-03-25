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
    <section className="bg-[#F8FAFC] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* ════════════════════════════════════
            SECTION A — Category cards
        ════════════════════════════════════ */}
        <div>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
                Top companies hiring now
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                Explore openings across top industry segments
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
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {COMPANY_CATEGORIES.map(({ id, label, count, logos, colors }) => (
              <button
                key={id}
                onClick={() => router.push(`/find-jobs?category=${id}`)}
                className="group flex-shrink-0 w-[240px] bg-white border border-[#E2E8F0] rounded-2xl p-4 text-left hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                {/* header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-[#0F172A] flex items-center gap-1">
                      {label}
                      <IconChevronRight
                        size={14}
                        className="text-[#CBD5E1] group-hover:text-primary transition-colors"
                      />
                    </p>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      <span className="text-green-600 font-semibold">
                        {count}
                      </span>{" "}
                      are actively hiring
                    </p>
                  </div>
                </div>

                {/* logo strip */}
                <div className="flex items-center gap-2 flex-wrap">
                  {logos.map((abbr, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-black text-white"
                      style={{ backgroundColor: colors[i] }}
                    >
                      {abbr}
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════
            SECTION B — Featured companies
        ════════════════════════════════════ */}
        <div>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
                Featured companies actively hiring
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                Verified employers with open positions right now
              </p>
            </div>
          </div>

          {/* 3-col grid → 2-col on md → 1-col on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURED_COMPANIES.map((co) => (
              <div
                key={co.id}
                className="group bg-white border border-[#E2E8F0] rounded-2xl p-5 flex flex-col hover:border-primary/25 hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => router.push(`/find-jobs?company=${co.id}`)}
              >
                {/* logo + rating row */}
                <div className="flex items-start justify-between mb-4">
                  <LogoPlaceholder
                    initials={co.initials}
                    bgColor={co.bgColor}
                    size="lg"
                  />
                  <div className="text-right">
                    <StarRating rating={co.rating} />
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      {co.reviews} reviews
                    </p>
                  </div>
                </div>

                {/* company info */}
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-[#0F172A] mb-1 group-hover:text-primary transition-colors">
                    {co.name}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed mb-3">
                    {co.tagline}
                  </p>

                  {/* meta */}
                  <div className="flex items-center gap-3 text-xs text-[#94A3B8] mb-3">
                    <span className="flex items-center gap-1">
                      <IconBriefcase size={12} />
                      {co.openings.toLocaleString()} openings
                    </span>
                    <span className="flex items-center gap-1">
                      <IconMapPin size={12} />
                      {co.location}
                    </span>
                  </div>

                  {/* tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {co.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] text-[10px] font-medium px-2 py-0.5 rounded-full"
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
                  className="w-full border-[#E2E8F0] text-primary font-semibold text-xs hover:bg-primary hover:text-white hover:border-primary transition-all rounded-xl h-9 group/btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/find-jobs?company=${co.id}`);
                  }}
                >
                  View jobs
                  <IconArrowRight
                    size={13}
                    className="ml-1.5 group-hover/btn:translate-x-0.5 transition-transform"
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
