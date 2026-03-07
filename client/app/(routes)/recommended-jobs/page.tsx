"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Sparkles, Loader2, BrainCircuit, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getRecommendedJobs } from "@/modules/job/server/job-service";
import { JobCard } from "@/modules/job/components/ui/job-card";

/* ═══════════════════════════════════════════════════════════════════
 * AI Recommended Jobs Page
 * Uses Content-Based Filtering + Collaborative Filtering to
 * recommend the most relevant jobs to the logged-in applicant.
 * ═══════════════════════════════════════════════════════════════════ */

export default function RecommendedJobsPage() {
  const user = useSelector((state: any) => state.user);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      getRecommendedJobs(user.id)
        .then((res) => setRecommendations(res || []))
        .catch((err) => console.error("Error fetching recommendations:", err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        {/* Background accents */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/8 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/6 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          {/* Back link */}
          <Link
            href="/find-jobs"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 bg-muted/50 px-3 py-1.5 rounded-md"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Find Jobs
          </Link>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                  Recommended Jobs
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  AI-powered picks personalized for your skills &amp; profile
                </p>
              </div>
            </div>

            {/* Algorithm badges */}
            <div className="flex flex-wrap gap-3 mt-5">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-sm">
                <BrainCircuit className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground">Content-Based Filtering</span>
                <span className="text-muted-foreground">— matches your skills &amp; experience to job requirements</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground">Collaborative Filtering</span>
                <span className="text-muted-foreground">— jobs liked by similar candidates</span>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-card/30 rounded-2xl border border-dashed border-border">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground animate-pulse text-sm">
                Analyzing your profile and generating personalized recommendations...
              </p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {recommendations.map((job: any, index: number) => (
                <JobCard key={index} {...job} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-border rounded-2xl bg-card/30">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-primary/60" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Recommendations Yet</h3>
              <p className="text-muted-foreground max-w-md">
                Complete your profile by adding your skills, job title, and experience.
                The AI needs this information to find the best matches for you.
              </p>
              <Link
                href="/profile"
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Complete Your Profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
