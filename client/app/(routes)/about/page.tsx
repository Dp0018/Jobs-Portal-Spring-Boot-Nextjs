"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  IconBriefcase,
  IconUsers,
  IconBuildingSkyscraper,
  IconRocket,
  IconShieldCheck,
  IconHeart,
  IconSparkles,
  IconArrowRight,
  IconStar,
  IconWorld,
  IconCode,
  IconTargetArrow,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Intersection observer hook — UNCHANGED
───────────────────────────────────────────── */
const useInView = (threshold = 0.2) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
};

/* ─────────────────────────────────────────────
   Value card — redesigned for light theme
───────────────────────────────────────────── */
const ValueCard = ({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) => (
  <div className="group p-5 rounded-xl border border-[#E2E8F0] bg-white hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-default">
    <div className="flex items-start gap-4">
      <div className="shrink-0 w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
        <Icon size={17} className="text-primary" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[#0F172A] mb-1.5">{title}</h3>
        <p className="text-xs text-[#64748B] leading-relaxed">{desc}</p>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Timeline item — redesigned for light theme
───────────────────────────────────────────── */
const TimelineItem = ({
  year,
  title,
  desc,
  align,
}: {
  year: string;
  title: string;
  desc: string;
  align: "left" | "right";
}) => (
  <div
    className={cn(
      "flex gap-0 items-start",
      align === "right" && "flex-row-reverse",
    )}
  >
    {/* Content side */}
    <div
      className={cn(
        "flex-1 pb-10 px-8",
        align === "right" ? "text-left" : "text-right",
      )}
    >
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest mb-2">
        {year}
      </span>
      <h4 className="text-sm font-semibold text-[#0F172A] mb-1">{title}</h4>
      <p className="text-xs text-[#64748B] leading-relaxed">{desc}</p>
    </div>

    {/* Dot + line */}
    <div className="flex flex-col items-center shrink-0 w-5">
      <div className="w-3 h-3 rounded-full bg-primary border-[3px] border-white ring-2 ring-primary/25 z-10 mt-1.5" />
      <div className="w-px flex-1 bg-[#E2E8F0] mt-1" />
    </div>

    {/* Empty side */}
    <div className="flex-1" />
  </div>
);

/* ─────────────────────────────────────────────
   DATA — UNCHANGED
───────────────────────────────────────────── */
const VALUES = [
  {
    icon: IconTargetArrow,
    title: "Precision Matching",
    desc: "Our intelligent matching surfaces the right opportunity for every candidate's unique profile and ambition.",
  },
  {
    icon: IconShieldCheck,
    title: "Verified Listings",
    desc: "Every employer and job posting is manually reviewed. Zero-tolerance on fake listings and misleading roles.",
  },
  {
    icon: IconHeart,
    title: "Candidate First",
    desc: "Transparent salaries, employer ratings — the job seeker is at the center of everything we build.",
  },
  {
    icon: IconWorld,
    title: "Opportunity for All",
    desc: "Geography or background should never be a barrier. We actively surface opportunities for emerging talent.",
  },
  {
    icon: IconCode,
    title: "Built in Public",
    desc: "We share our roadmap, our mistakes, and our wins openly. Our community shapes what Joblify becomes.",
  },
  {
    icon: IconRocket,
    title: "Always Iterating",
    desc: "Every week we ship improvements driven by real user feedback. The best Joblify hasn't been built yet.",
  },
];

const TIMELINE = [
  {
    year: "2021",
    title: "The Idea",
    desc: "Frustrated by outdated job boards, Arjun and Priya sketched Joblify on a whiteboard in a Bengaluru café.",
  },
  {
    year: "2022",
    title: "First Launch",
    desc: "Beta launched with 200 hand-curated listings and 1,000 early users. Waitlist hit 10,000 in a week.",
  },
  {
    year: "2023",
    title: "Seed Funding",
    desc: "Raised ₹4Cr seed round. Expanded to 12 people and launched employer dashboard with ATS integrations.",
  },
  {
    year: "2024",
    title: "100K Milestone",
    desc: "Crossed 100,000 active candidates and 5,000 verified employers. Launched AI-powered resume feedback.",
  },
  {
    year: "2025",
    title: "Series A",
    desc: "Raised $3M Series A. Launched Find Talent for recruiters and expanded to 15 cities plus remote-first roles.",
  },
];

const HERO_STATS = [
  { icon: IconBriefcase, label: "Verified Jobs", val: "50K+" },
  { icon: IconUsers, label: "Active Talent", val: "200K+" },
  { icon: IconBuildingSkyscraper, label: "Companies", val: "5K+" },
  { icon: IconStar, label: "Avg. Rating", val: "4.8★" },
];

/* ═══════════════════════════════════════════
   ABOUT PAGE
═══════════════════════════════════════════ */
const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden">
      {/* ════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════ */}
      <section className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — copy */}
            <div className="space-y-6">
              <div>
                <Badge
                  variant="outline"
                  className="mb-4 border-primary/30 bg-primary/8 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full gap-1.5"
                >
                  <IconSparkles size={11} />
                  Our Story
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-black text-[#0F172A] leading-[1.05] tracking-tight">
                  We&apos;re{" "}
                  <span className="relative">
                    <span className="text-primary">Joblify.</span>
                    <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-primary/30 rounded-full" />
                  </span>
                </h1>
              </div>

              <p className="text-base text-[#475569] leading-relaxed max-w-md">
                We&apos;re on a mission to make finding the right job and the
                right talent feel{" "}
                <strong className="text-[#0F172A] font-semibold">
                  effortless
                </strong>
                . Not exhausting. Not overwhelming. Just clear, human, and fast.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link href="/find-jobs">
                  <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-5 h-10 shadow-sm hover:shadow-md transition-all gap-2">
                    Explore Jobs
                    <IconArrowRight size={15} />
                  </Button>
                </Link>
                <Link href="/find-talent">
                  <Button
                    variant="outline"
                    className="border-[#E2E8F0] text-[#475569] hover:text-primary hover:border-primary/30 hover:bg-primary/5 font-medium px-5 h-10 transition-all gap-2"
                  >
                    Hire Talent
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right — stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {HERO_STATS.map(({ icon: Icon, label, val }, i) => (
                <div
                  key={label}
                  className="p-5 rounded-xl border border-[#E2E8F0] bg-white hover:border-primary/30 hover:shadow-md transition-all duration-200 group"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-3 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                    <Icon
                      size={17}
                      className="text-[#64748B] group-hover:text-primary transition-colors"
                    />
                  </div>
                  <div className="text-2xl font-black text-[#0F172A] tracking-tight leading-none">
                    {val}
                  </div>
                  <div className="text-xs text-[#64748B] font-medium mt-1.5">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          MISSION STATEMENT
      ════════════════════════════════════ */}
      <section className="py-14 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 mb-4">
            Our Mission
          </p>
          <blockquote className="text-2xl md:text-3xl font-bold text-white leading-snug">
            "To{" "}
            <span className="text-white/70 italic">eliminate the friction</span>{" "}
            between great people and great opportunities for everyone,
            everywhere."
          </blockquote>
        </div>
      </section>

      {/* ════════════════════════════════════
          VALUES
      ════════════════════════════════════ */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-2">
              What drives us
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] leading-tight">
              Our values,
              <br />
              <span className="text-[#475569] font-semibold">
                not just words.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {VALUES.map((v) => (
              <ValueCard key={v.title} {...v} />
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-[#E2E8F0]" />

      {/* ════════════════════════════════════
          TIMELINE
      ════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-2">
              How we got here
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A]">
              Our journey
            </h2>
          </div>

          {/* Mobile timeline */}
          <div className="md:hidden space-y-0">
            {TIMELINE.map(({ year, title, desc }, i) => (
              <div key={year} className="flex gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/15 mt-1.5 shrink-0" />
                  {i < TIMELINE.length - 1 && (
                    <div className="w-px flex-1 bg-[#E2E8F0] mt-1" />
                  )}
                </div>
                <div className="pb-7">
                  <Badge
                    variant="outline"
                    className="mb-1.5 border-primary/25 bg-primary/8 text-primary text-[10px] font-bold tracking-widest rounded-full px-2.5 py-0.5"
                  >
                    {year}
                  </Badge>
                  <h4 className="text-sm font-semibold text-[#0F172A] mb-1">
                    {title}
                  </h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop alternating timeline */}
          <div className="hidden md:block relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-[#E2E8F0]" />
            {TIMELINE.map(({ year, title, desc }, i) => (
              <TimelineItem
                key={year}
                year={year}
                title={title}
                desc={desc}
                align={i % 2 === 0 ? "left" : "right"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          WE'RE HIRING BANNER
      ════════════════════════════════════ */}
      <section className="py-12 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-8 md:p-10">
            {/* Decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-2xl" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3">
                {/* "We're hiring" badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-200 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  We&apos;re hiring
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-[#0F172A] leading-tight">
                  Join us and build
                  <br />
                  <span className="text-primary">the future of work.</span>
                </h2>

                <p className="text-sm text-[#64748B] max-w-sm leading-relaxed">
                  We&apos;re a remote-first team that values autonomy, craft,
                  and deep focus. If you care about meaningful work and real
                  impact, let&apos;s talk.
                </p>

                {/* Perks row */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    "Remote-first",
                    "Competitive pay",
                    "Equity",
                    "Great team",
                  ].map((perk) => (
                    <Badge
                      key={perk}
                      variant="outline"
                      className="border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] text-xs font-medium px-2.5 py-0.5 rounded-full"
                    >
                      {perk}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="shrink-0">
                <Link href="/find-jobs">
                  <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 h-11 shadow-sm hover:shadow-md transition-all gap-2 text-sm">
                    View Open Roles
                    <IconArrowRight size={15} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
