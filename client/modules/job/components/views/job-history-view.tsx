"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IconHistory, IconBriefcase, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { getAllJobsIncludingExpired } from "@/modules/job/server/job-service";
import { JobHistoryCard } from "../ui/job-history-card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Briefcase } from "lucide-react";

export const JobHistoryView = () => {
  const user = useSelector((state: any) => state.user);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);

    getAllJobsIncludingExpired()
      .then((res: any[]) => {
        const history = res.filter((job) =>
          job.applicants?.some(
            (applicant: any) => applicant.applicantId == user.id,
          ),
        );
        history.sort(
          (a, b) =>
            new Date(b.postTime).getTime() - new Date(a.postTime).getTime(),
        );
        setAppliedJobs(history);
        setFilteredJobs(history);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load applied jobs:", err);
        setLoading(false);
      });
  }, [user?.id]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredJobs(appliedJobs);
      return;
    }
    const term = search.toLowerCase();
    setFilteredJobs(
      appliedJobs.filter(
        (job) =>
          job.jobTitle?.toLowerCase().includes(term) ||
          job.company?.toLowerCase().includes(term),
      ),
    );
  }, [search, appliedJobs]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ── Page Header ── */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            {/* Left: title */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
                <IconHistory size={22} className="text-[#2563EB]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#0F172A] tracking-tight leading-none">
                  Application History
                </h1>
                <p className="text-sm text-[#475569] mt-1">
                  Track all the jobs you've applied to
                </p>
              </div>
            </div>

            {/* Right: search + count */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 h-4" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title or company..."
                  className="pl-10 pr-9 h-10 bg-[#F8FAFC] border-[#E2E8F0] rounded-xl text-sm placeholder:text-[#CBD5E1] focus-visible:ring-1 focus-visible:ring-[#2563EB] focus-visible:border-[#2563EB] text-[#0F172A]"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {!loading && (
                <div className="shrink-0 flex items-center gap-2 px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#475569] whitespace-nowrap">
                  <Briefcase
                    className="w-3.5 h-3.5 text-[#2563EB]"
                    strokeWidth={2}
                  />
                  {appliedJobs.length} applied
                </div>
              )}
            </div>
          </div>

          {/* Active search indicator */}
          {search && !loading && (
            <div className="mt-4 pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
              <p className="text-xs text-[#94A3B8]">
                Showing{" "}
                <span className="font-semibold text-[#475569]">
                  {filteredJobs.length}
                </span>{" "}
                result{filteredJobs.length !== 1 ? "s" : ""} for{" "}
                <span className="font-semibold text-[#0F172A]">"{search}"</span>
              </p>
              <button
                onClick={() => setSearch("")}
                className="text-xs text-[#2563EB] font-semibold hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex gap-4"
              >
                <Skeleton className="w-14 h-14 rounded-xl shrink-0 bg-[#F1F5F9]" />
                <div className="flex-1 space-y-2.5">
                  <Skeleton className="h-5 w-52 bg-[#F1F5F9]" />
                  <Skeleton className="h-3.5 w-36 bg-[#F1F5F9]" />
                  <div className="flex gap-4 pt-1">
                    <Skeleton className="h-3 w-24 bg-[#F1F5F9]" />
                    <Skeleton className="h-3 w-20 bg-[#F1F5F9]" />
                    <Skeleton className="h-3 w-28 bg-[#F1F5F9]" />
                  </div>
                </div>
                <Skeleton className="w-24 h-9 rounded-lg shrink-0 bg-[#F1F5F9]" />
              </div>
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="space-y-3">
            {filteredJobs.map((job) => {
              const applicantProfile = job.applicants.find(
                (a: any) => a.applicantId == user.id,
              );
              return (
                <JobHistoryCard
                  key={job.id}
                  job={job}
                  applicant={applicantProfile}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm py-20 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mb-5">
              <IconBriefcase size={30} className="text-[#94A3B8]" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-2">
              {search ? "No matches found" : "No Applications Yet"}
            </h3>
            <p className="text-sm text-[#94A3B8] max-w-sm mx-auto mb-7 leading-relaxed">
              {search
                ? `No applied jobs match "${search}". Try a different search term.`
                : "You haven't applied to any jobs yet. Start exploring opportunities and track them all here."}
            </p>
            {!search && (
              <Link href="/find-jobs">
                <button className="px-5 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-500/20 hover:bg-[#1D4ED8] hover:shadow-md hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-200">
                  Browse Jobs
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
