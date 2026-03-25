"use client";

import { IconArrowLeft, IconBriefcase } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getJob } from "@/modules/job/server/job-service";
import JobDesc from "../ui/job-desc";
import RecommendedJobs from "../ui/recommended-jobs";
import { Skeleton } from "@/components/ui/skeleton";
import { use } from "react";

interface JobDescPageProps {
  params: Promise<{ id: string }>;
}

/* ─────────────────────────────────────────────
   Skeleton — shown while job data loads
───────────────────────────────────────────── */
const JobDescSkeleton = () => (
  <div className="w-full lg:w-2/3 space-y-5">
    {/* Header card skeleton */}
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6">
      <div className="flex gap-4 mb-5">
        <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2.5">
          <Skeleton className="h-7 w-2/3 rounded-lg" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
          <Skeleton className="h-4 w-1/3 rounded-lg" />
        </div>
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-28 rounded-xl" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
    </div>

    {/* Stats grid skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <Skeleton className="w-10 h-10 rounded-xl mx-auto mb-3" />
          <Skeleton className="h-3 w-16 rounded mx-auto mb-2" />
          <Skeleton className="h-5 w-20 rounded mx-auto" />
        </div>
      ))}
    </div>

    {/* Skills skeleton */}
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6">
      <Skeleton className="h-6 w-36 rounded-lg mb-4" />
      <div className="flex flex-wrap gap-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>
    </div>

    {/* Description skeleton */}
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-3">
      <Skeleton className="h-6 w-40 rounded-lg mb-4" />
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className={`h-4 rounded ${i === 4 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   PAGE
═══════════════════════════════════════════ */
const JobDescPage = ({ params }: JobDescPageProps) => {
  const { id } = use(params);
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    getJob(id)
      .then((res) => {
        console.log("getJob response:", res);
        setJob(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Sticky breadcrumb bar ── */}
      <div
        className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0]"
        style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.05)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-[#CBD5E1]">/</span>
            <Link
              href="/find-jobs"
              className="hover:text-primary transition-colors"
            >
              Find Jobs
            </Link>
            <span className="text-[#CBD5E1]">/</span>
            <span className="text-[#0F172A] font-medium capitalize truncate max-w-[200px]">
              {job?.jobTitle ?? "Job Details"}
            </span>
          </div>

          {/* Back button */}
          <Link href="/find-jobs">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#475569] text-xs font-semibold hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all duration-150">
              <IconArrowLeft size={14} />
              Back to Jobs
            </button>
          </Link>
        </div>
      </div>

      {/* ── Page body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {job ? <JobDesc {...job} /> : <JobDescSkeleton />}
          <RecommendedJobs />
        </div>
      </div>
    </div>
  );
};

export default JobDescPage;