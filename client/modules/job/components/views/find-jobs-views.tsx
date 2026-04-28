"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
  ArrowRight,
  Upload,
  ShieldCheck,
  ScanSearch,
  Bot,
  Briefcase,
  Building2,
  Wifi,
  DollarSign,
  Cpu,
} from "lucide-react";
import { Jobs } from "../ui/jobs";
import { SearchBar } from "../ui/search-box";
import { JobCard } from "../ui/job-card";
import { getRecommendedJobs } from "../../server/job-service";
import { Badge } from "@/components/ui/badge";
import {
  IconBriefcase,
  IconMapPin,
  IconTrendingUp,
  IconSparkles,
  IconTarget,
} from "@tabler/icons-react";
import Image from "next/image";

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

/* ─────────────────────────────────────────────
   FEATURE PILLS
───────────────────────────────────────────── */
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
  {
    icon: Bot,
    text: "AI Recommendation System",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: IconTarget,
    text: "Skill Gap Identifier",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
];

/* ─────────────────────────────────────────────
   RECOMMENDED CATEGORIES
───────────────────────────────────────────── */
const CATEGORIES = [
  {
    name: "MNCs",
    desc: "1.1K+ active jobs",
    icon: Building2,
    gradient: "from-blue-500 to-blue-600",
    avatarColors: ["#EF4444", "#F59E0B", "#3B82F6", "#8B5CF6"],
    avatarLabels: ["AN", "AA", "CP", "RC"],
  },
  {
    name: "Internet",
    desc: "600+ openings",
    icon: Wifi,
    gradient: "from-violet-500 to-purple-600",
    avatarColors: ["#F97316", "#06B6D4", "#22C55E", "#A855F7"],
    avatarLabels: ["OA", "TW", "FR", "PC"],
  },
  {
    name: "Finance",
    desc: "153K+ companies",
    icon: DollarSign,
    gradient: "from-emerald-500 to-green-600",
    avatarColors: ["#6366F1", "#EC4899", "#14B8A6", "#F59E0B"],
    avatarLabels: ["CS", "MA", "BD", "GS"],
  },
  {
    name: "Technology",
    desc: "1.5K+ actively hiring",
    icon: Cpu,
    gradient: "from-orange-500 to-amber-600",
    avatarColors: ["#F97316", "#06B6D4", "#8B5CF6", "#10B981"],
    avatarLabels: ["OR", "CC", "MJ", "RI"],
  },
];

/* ═══════════════════════════════════════════
   MAIN VIEW
═══════════════════════════════════════════ */
export const FindJobsViews = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F0FE] via-[#F0F4FF] to-white">
      {/* ── Global Decorative Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(circle, #3B82F6 0.8px, transparent 0.8px)`,
            backgroundSize: "32px 32px",
          }}
        />
        {/* Global Gradient orbs */}
        <div className="absolute top-[15%] -left-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute top-[40%] -right-40 w-[30rem] h-[30rem] bg-indigo-200/15 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-[70%] -left-20 w-80 h-80 bg-sky-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[5%] right-[10%] w-96 h-96 bg-purple-200/15 rounded-full blur-3xl" />
      </div>

      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden">
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

              {/* Description */}
              <p className="text-sm sm:text-[15px] text-[#64748B] leading-relaxed max-w-lg mb-6">
                Discover thousands of top UK jobs with intelligent AI-driven
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

          {/* Feature pills row - Centered below both columns */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            {FEATURE_PILLS.map(({ icon: Icon, text, color, bg }) => (
              <div
                key={text}
                className={`flex items-center gap-2 px-3.5 py-2 ${bg} border border-opacity-20 rounded-xl text-xs font-medium ${color}`}
                style={{ borderColor: "rgba(0,0,0,0.07)" }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SEARCH FILTER BAR
      ══════════════════════════════════════ */}
      <div className="relative -mt-1 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar />
        </div>
      </div>

      {/* ══════════════════════════════════════
          RECOMMENDED JOBS FOR YOU (Category Cards)
      ══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
              Recommended Jobs For You
            </h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-full">
              <IconSparkles size={13} className="text-blue-500" />
              <span className="text-[10px] font-bold text-blue-600">
                Powered by AI
              </span>
            </div>
          </div>
          <button className="flex items-center gap-1 text-sm font-semibold text-[#64748B] hover:text-primary transition-colors">
            View all
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Category cards horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map((cat) => {
            const IconComp = cat.icon;
            return (
              <div
                key={cat.name}
                className="group min-w-[260px] flex-1 bg-white border border-[#E8EDF2] rounded-2xl p-5 hover:border-primary/25 hover:shadow-lg hover:shadow-blue-500/8 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                {/* Icon + Info */}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-sm`}
                  >
                    <IconComp className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[#0F172A] mb-0.5 group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-[#94A3B8]">{cat.desc}</p>
                  </div>
                </div>

                {/* Company avatars row */}
                <div className="flex items-center gap-1">
                  {cat.avatarColors.map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm border-2 border-white -ml-1 first:ml-0"
                      style={{ backgroundColor: color }}
                    >
                      {cat.avatarLabels[i]}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold text-[#94A3B8] bg-[#F1F5F9] border-2 border-white -ml-1">
                    +
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent" />
      </div>

      {/* ══════════════════════════════════════
          TOP COMPANIES HIRING NOW (Job Cards)
      ══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Recommendations Carousel (for logged-in applicants) */}
        <RecommendedJobs />

        {/* Top Companies Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🏆</div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
              Top companies hiring now
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#94A3B8] hidden sm:inline">
              Sort by:
            </span>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#475569] hover:border-primary/30 hover:text-primary transition-all">
              View all
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Job results grid */}
        <Jobs />
      </section>

      {/* Float animation keyframes */}
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
    </div>
  );
};
