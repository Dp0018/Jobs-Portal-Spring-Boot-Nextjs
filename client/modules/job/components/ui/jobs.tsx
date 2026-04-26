"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconBriefcase, IconFilter } from "@tabler/icons-react";
import { resetFilter } from "@/modules/redux/filter-slice";
import { getAllJobs } from "../../server/job-service";
import { JobCard } from "./job-card";
import { Sort } from "./sort";
import { resetSort } from "@/modules/redux/sort-slice";

/* ── Skeleton card — Premium shimmer ── */
const SkeletonCard = () => (
  <div className="relative bg-white border border-[#E8EDF4] rounded-2xl p-5 h-80 overflow-hidden">
    {/* Shimmer overlay */}
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-[#F1F5F9]/70 to-transparent" />
    <div className="flex gap-3 mb-4">
      <div className="w-12 h-12 bg-[#F1F5F9] rounded-xl shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-4 bg-[#F1F5F9] rounded-lg w-3/4" />
        <div className="h-3 bg-[#F1F5F9] rounded-lg w-1/2" />
      </div>
      <div className="w-16 h-10 bg-[#F1F5F9] rounded-xl shrink-0" />
    </div>
    <div className="flex gap-2 mb-4">
      <div className="h-6 bg-[#F1F5F9] rounded-lg w-20" />
      <div className="h-6 bg-[#F1F5F9] rounded-lg w-24" />
      <div className="h-6 bg-[#F1F5F9] rounded-lg w-16" />
    </div>
    <div className="space-y-2 mb-6">
      <div className="h-3 bg-[#F1F5F9] rounded-lg w-full" />
      <div className="h-3 bg-[#F1F5F9] rounded-lg w-5/6" />
      <div className="h-3 bg-[#F1F5F9] rounded-lg w-4/6" />
    </div>
    <div className="h-px bg-[#F1F5F9] mb-4" />
    <div className="flex justify-between">
      <div className="h-5 bg-[#F1F5F9] rounded-lg w-20" />
      <div className="h-8 bg-[#F1F5F9] rounded-lg w-24" />
    </div>
  </div>
);

export const Jobs = () => {
  const dispatch = useDispatch();
  const [jobList, setJobList] = useState<any[]>([]);
  const filter = useSelector((state: any) => state.filter);
  const sort = useSelector((state: any) => state.sort);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── Fetch on mount ── */
  useEffect(() => {
    dispatch(resetFilter());
    dispatch(resetSort());
    setLoading(true);
    getAllJobs()
      .then((res: any) => {
        setJobList(res.filter((job: any) => job.jobStatus === "ACTIVE"));
        setLoading(false);
      })
      .catch((err: any) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  /* ── Sort & Filter merged to prevent circular dependency loops ── */
  useEffect(() => {
    let result = [...jobList];

    const currentFilter = filter || {};

    // 1. Apply Filters
    if (currentFilter["Job Title"]?.length) {
      result = result.filter((job) =>
        currentFilter["Job Title"].some((x: string) =>
          job.jobTitle?.toLowerCase().includes(x.toLowerCase()),
        ),
      );
    }
    if (currentFilter.Location?.length) {
      result = result.filter((job) =>
        currentFilter.Location.some((x: string) =>
          job.location?.toLowerCase().includes(x.toLowerCase()),
        ),
      );
    }
    if (currentFilter.Experience?.length) {
      result = result.filter((job) =>
        currentFilter.Experience.some((x: string) =>
          job.experience?.toLowerCase().includes(x.toLowerCase()),
        ),
      );
    }
    if (currentFilter["Job Type"]?.length) {
      result = result.filter((job) =>
        currentFilter["Job Type"].some((x: string) =>
          job.jobType?.toLowerCase().includes(x.toLowerCase()),
        ),
      );
    }
    if (currentFilter.packageOffered?.length === 2) {
      const [minLpa, maxLpa] = currentFilter.packageOffered;
      result = result.filter(
        (job) => job.packageOffered >= minLpa && job.packageOffered <= maxLpa,
      );
    }

    // 2. Apply Sort to the filtered results instead of raw jobList
    if (sort === "most recent") {
      result.sort(
        (a, b) =>
          new Date(b.postTime).getTime() - new Date(a.postTime).getTime(),
      );
    } else if (sort === "salary (low-high)") {
      result.sort((a, b) => a.packageOffered - b.packageOffered);
    } else if (sort === "salary (high-low)") {
      result.sort((a, b) => b.packageOffered - a.packageOffered);
    }

    setFilteredJobs(result);
  }, [filter, sort, jobList]);

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm text-[#64748B]">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary/30 animate-pulse" />
                Loading jobs…
              </span>
            ) : (
              <>
                <span className="font-bold text-[#0F172A] text-base">
                  {filteredJobs.length}
                </span>{" "}
                {filteredJobs.length === 1 ? "job" : "jobs"} found
              </>
            )}
          </p>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-[#94A3B8] text-xs">
            <IconFilter className="w-3.5 h-3.5" />
            <span>Sort by:</span>
          </div>
          <Sort sort="job" />
        </div>
      </div>

      {/* ── Jobs Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job: any, index: number) => (
            <JobCard key={index} {...job} />
          ))}
        </div>
      ) : (
        /* ── Empty state ── */
        <div className="text-center py-20 bg-white border border-[#E8EDF4] rounded-2xl">
          <div className="inline-flex p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl mb-5">
            <IconBriefcase
              size={48}
              className="text-[#CBD5E1]"
              stroke={1.2}
            />
          </div>
          <h3 className="text-xl font-bold text-[#0F172A] mb-2">
            No Jobs Found
          </h3>
          <p className="text-[#94A3B8] max-w-md mx-auto text-sm leading-relaxed">
            Try adjusting your filters or search criteria to find more
            opportunities
          </p>
        </div>
      )}

      {/* Shimmer keyframes */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
};
