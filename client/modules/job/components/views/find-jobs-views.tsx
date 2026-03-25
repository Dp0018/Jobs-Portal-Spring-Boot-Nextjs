"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Sparkles, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Jobs } from "../ui/jobs";
import { SearchBar } from "../ui/search-box";
import { JobCard } from "../ui/job-card";
import { getRecommendedJobs } from "../../server/job-service";
import { Badge } from "@/components/ui/badge";
import { IconBriefcase, IconMapPin, IconTrendingUp } from "@tabler/icons-react";

/* ─────────────────────────────────────────────
   AI Recommended Jobs Carousel — logic UNTOUCHED
───────────────────────────────────────────── */
const RecommendedJobs = () => {
  const user = useSelector((state: any) => state.user);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (user?.id && user?.accountType === "APPLICANT") {
      setLoading(true);
      getRecommendedJobs(user.id)
        .then((res) => {
          setRecommendations(res || []);
          setError(false);
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user?.id || user?.accountType !== "APPLICANT") return null;
  if (error || (!loading && recommendations.length === 0)) return null;

  const scrollContainer = (direction: "left" | "right") => {
    const el = document.getElementById("rec-scroll");
    if (el) {
      const scrollAmount = 380;
      el.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mb-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {/* AI icon badge */}
          <div className="relative w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20" />
            <Sparkles className="w-5 h-5 text-white relative z-10" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#0F172A]">
                Recommended For You
              </h2>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-bold px-2 py-0 h-4 rounded-full border">
                AI
              </Badge>
            </div>
            <p className="text-xs text-[#64748B]">
              Personalised picks based on your skills &amp; profile
            </p>
          </div>
        </div>

        {/* Scroll arrows */}
        {recommendations.length > 3 && (
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scrollContainer("left")}
              className="w-8 h-8 rounded-full border border-[#E2E8F0] bg-white flex items-center justify-center text-[#64748B] hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollContainer("right")}
              className="w-8 h-8 rounded-full border border-[#E2E8F0] bg-white flex items-center justify-center text-[#64748B] hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel / Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-10 bg-white rounded-2xl border border-[#E2E8F0] border-dashed">
          <Loader2 className="w-5 h-5 text-primary animate-spin mr-2.5" />
          <span className="text-sm text-[#64748B]">
            Generating personalised recommendations…
          </span>
        </div>
      ) : (
        <div
          id="rec-scroll"
          className="flex gap-4 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {recommendations.map((job: any, index: number) => (
            <div
              key={index}
              className="min-w-[320px] max-w-[360px] snap-start shrink-0"
            >
              <JobCard {...job} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN VIEW
═══════════════════════════════════════════ */
export const FindJobsViews = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Hero band ── */}
      <div className="relative overflow-hidden bg-white border-b border-[#E2E8F0]">
        {/* Radial gradient bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% -5%, #dbeafe 0%, #eff6ff 40%, #ffffff 100%)",
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: `radial-gradient(circle, #2563EB18 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          {/* Headline */}
          <div className="text-center mb-8">
            {/* live badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-200 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live opportunities updated daily
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight mb-3 leading-tight">
              Find Your{" "}
              <span className="relative inline-block">
                <span className="text-primary">Dream Job</span>
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-primary/25 rounded-full" />
              </span>
            </h1>
            <p className="text-[#64748B] text-base max-w-xl mx-auto">
              Discover thousands of opportunities from top companies — filter by
              role, location, salary, and more.
            </p>

            {/* Quick stat pills */}
            <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
              {[
                { icon: IconBriefcase, text: "50K+ active listings" },
                { icon: IconMapPin, text: "200+ cities" },
                { icon: IconTrendingUp, text: "10K+ new this week" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-full text-xs text-[#475569] font-medium shadow-sm"
                >
                  <Icon size={13} className="text-primary" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations Carousel */}
          <RecommendedJobs />

          {/* Search + filter bar */}
          <SearchBar />
        </div>
      </div>

      {/* ── Job results section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Jobs />
      </div>
    </div>
  );
};
