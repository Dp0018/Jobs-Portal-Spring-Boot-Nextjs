"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Sparkles, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Jobs } from "../ui/jobs";
import { SearchBar } from "../ui/search-box";
import { JobCard } from "../ui/job-card";
import { getRecommendedJobs } from "../../server/job-service";

/* ── AI Recommended Jobs Carousel ── */
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

  // Don't render anything for non-applicant or logged-out users
  if (!user?.id || user?.accountType !== "APPLICANT") return null;
  // Don't render if error or no recommendations
  if (error || (!loading && recommendations.length === 0)) return null;

  // Horizontal scroll handler
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
    <div className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Recommended For You
            </h2>
            <p className="text-muted-foreground text-sm">
              AI-powered picks based on your skills &amp; profile
            </p>
          </div>
        </div>

        {/* Scroll Arrows */}
        {recommendations.length > 3 && (
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scrollContainer("left")}
              className="p-2 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollContainer("right")}
              className="p-2 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel */}
      {loading ? (
        <div className="flex items-center justify-center py-12 bg-card/30 rounded-xl border border-dashed border-border">
          <Loader2 className="w-6 h-6 text-primary animate-spin mr-3" />
          <span className="text-muted-foreground text-sm">
            Generating personalized recommendations...
          </span>
        </div>
      ) : (
        <div
          id="rec-scroll"
          className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {recommendations.map((job: any, index: number) => (
            <div
              key={index}
              className="min-w-[340px] max-w-[380px] snap-start shrink-0"
            >
              <JobCard {...job} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const FindJobsViews = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/8 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/6 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent mb-4 bg-linear-to-r from-foreground via-primary/80 to-foreground bg-clip-text">
              Find Your Dream Job
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Discover thousands of opportunities from top companies around the
              world
            </p>
          </div>

          {/* AI Recommendations Carousel (only for logged-in applicants) */}
          <RecommendedJobs />

          {/* Search Bar + Jobs */}
          <SearchBar />
          <Jobs />
        </div>
      </div>
    </div>
  );
};
