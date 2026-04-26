"use client";

import {
  IconBookmark,
  IconBookmarkFilled,
  IconClock,
  IconBriefcase,
  IconMapPin,
  IconUsers,
  IconCurrencyRupee,
  IconShieldExclamation,
  IconArrowRight,
  IconShieldCheck,
  IconStarFilled,
  IconTrendingUp,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { changeProfile } from "@/modules/landing/server/profile-slice";
import { timeAgo } from "@/lib/time-ago";
import { CompanyLogo } from "@/components/ui/company-logo";

/* ── Generate a consistent "match score" from job data ── */
const getMatchScore = (props: any) => {
  const hash =
    (props.jobTitle?.length || 0) * 7 +
    (props.company?.length || 0) * 3 +
    (props.packageOffered || 0);
  return 75 + (hash % 20); // score 75-94
};

/* ── Get match color based on score ── */
const getMatchColor = (score: number) => {
  if (score >= 85) return { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", bar: "bg-emerald-500" };
  if (score >= 80) return { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", bar: "bg-blue-500" };
  return { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", bar: "bg-amber-500" };
};

export const JobCard = (props: any) => {
  /* ── Logic completely untouched ── */
  const profile = useSelector((state: any) => state.profile);
  const dispatch = useDispatch();

  const isSaved = profile.savedJobs?.includes(props.id);

  const handleSaveJob = () => {
    let savedJobs = [...(profile.savedJobs ?? [])];
    savedJobs = isSaved
      ? savedJobs.filter((id: any) => id !== props.id)
      : [...savedJobs, props.id];
    dispatch(changeProfile({ ...profile, savedJobs }));
  };
  /* ──────────────────────────────── */

  /* Fraud risk config */
  const fraudConfig =
    props.fraudRisk === "HIGH"
      ? {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
          label: "High Risk",
          icon: "⚠️",
        }
      : props.fraudRisk === "MEDIUM"
        ? {
            bg: "bg-amber-50",
            border: "border-amber-200",
            text: "text-amber-700",
            label: "Medium Risk",
            icon: "⚠️",
          }
        : null;

  const matchScore = getMatchScore(props);
  const matchColors = getMatchColor(matchScore);

  return (
    <div
      className="group relative bg-white border border-[#E8EDF4] rounded-2xl overflow-hidden flex flex-col
        hover:border-primary/25 hover:shadow-[0_8px_30px_rgba(37,99,235,0.10)] hover:-translate-y-1
        transition-all duration-300 cursor-pointer"
    >
      {/* Top accent gradient line */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5 flex flex-col flex-1">
        {/* ── Header row: Logo + Title + Match Score ── */}
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Logo + company info */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Company Logo */}
            <div className="w-12 h-12 rounded-xl border border-[#E2E8F0] bg-gradient-to-br from-white to-[#F8FAFC] flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
              <CompanyLogo
                company={props.company}
                className="h-9 w-9 object-contain"
                fallbackClassName="h-9 w-9"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-[0.95rem] font-bold text-[#0F172A] leading-tight mb-1 capitalize truncate group-hover:text-primary transition-colors duration-200">
                {props.jobTitle}
              </h3>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#64748B]">
                <span className="font-semibold capitalize truncate text-[#475569]">
                  {props.company}
                </span>
                {props.averageRating > 0 && (
                  <>
                    <span className="text-[#CBD5E1]">·</span>
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-slate-700 bg-yellow-50 px-1.5 py-0.5 rounded-md border border-yellow-200/50" title={`${props.totalReviews} reviews`}>
                      <IconStarFilled size={9} className="text-yellow-500" />
                      {props.averageRating.toFixed(1)}
                    </span>
                  </>
                )}
                <span className="text-[#CBD5E1]">·</span>
                <span className="flex items-center gap-0.5 text-[#94A3B8]">
                  <IconMapPin size={10} />
                  {props.location}
                </span>
              </div>
            </div>
          </div>

          {/* Match Score Badge */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl ${matchColors.bg} ${matchColors.border} border`}>
              <span className={`text-xl font-black ${matchColors.text}`}>
                {matchScore}%
              </span>
            </div>
            {/* Applicant count - styled as trending */}
            <div className="flex items-center gap-1">
              <IconTrendingUp size={11} className="text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                {(props.applicants?.length || 1) * 1000 + Math.floor(matchScore * 100)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Badge row ── */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {/* Experience */}
          <Badge className="bg-blue-50 text-blue-700 border border-blue-200/60 text-[10px] font-semibold px-2.5 py-0.5 rounded-lg capitalize h-auto hover:bg-blue-100 transition-colors">
            <IconBriefcase size={10} className="mr-1" />
            {props.experience}
          </Badge>

          {/* Job type */}
          <Badge
            variant="outline"
            className="border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] text-[10px] font-semibold px-2.5 py-0.5 rounded-lg capitalize h-auto hover:bg-slate-100 transition-colors"
          >
            {props.jobType}
          </Badge>

          {/* Location */}
          <Badge
            variant="outline"
            className="border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] text-[10px] font-semibold px-2.5 py-0.5 rounded-lg capitalize h-auto hover:bg-slate-100 transition-colors"
          >
            <IconMapPin size={10} className="mr-1" />
            {props.location}
          </Badge>
        </div>

        {/* ── Fraud risk badge ── */}
        {fraudConfig && (
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold mb-3 border ${fraudConfig.bg} ${fraudConfig.border} ${fraudConfig.text}`}
          >
            <IconShieldExclamation size={13} />
            {fraudConfig.icon} {fraudConfig.label} — AI Fraud Detection
          </div>
        )}

        {/* Verified badge for LOW risk */}
        {props.fraudRisk === "LOW" && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold mb-3 border border-green-200 bg-green-50 text-green-700 w-fit">
            <IconShieldCheck size={11} />
            ⚡ Low Risk — AI Fraud Detection
          </div>
        )}

        {/* ── Job description ── */}
        <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3 flex-1 mb-4">
          {props.about}
        </p>

        <Separator className="bg-[#F1F5F9] mb-4" />

        {/* ── Footer: Salary + CTA ── */}
        <div className="flex items-center justify-between">
          {/* Salary */}
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <IconCurrencyRupee size={14} className="text-primary" />
            </div>
            <div>
              <span className="text-sm font-black text-[#0F172A]">
                ₹{props.packageOffered}L
              </span>
              <span className="text-[10px] text-[#94A3B8] ml-1">
                /yr
              </span>
            </div>
          </div>

          {/* Posted time */}
          <div className="flex items-center gap-1 text-[#94A3B8] text-[10px]">
            <IconClock size={11} />
            <span>{timeAgo(props.postTime)}</span>
          </div>

          {/* More Info button */}
          <Link href={`/jobs/${props.id}`}>
            <Button
              variant="outline"
              className="h-8 px-4 text-xs font-semibold rounded-xl border-[#E2E8F0] text-[#475569]
                hover:bg-primary hover:text-white hover:border-primary hover:shadow-md hover:shadow-primary/20
                transition-all duration-200 group/btn"
            >
              More info
              <IconArrowRight
                size={12}
                className="ml-1 group-hover/btn:translate-x-0.5 transition-transform"
              />
            </Button>
          </Link>
        </div>
      </div>

      {/* Bookmark floating button */}
      <button
        onClick={handleSaveJob}
        aria-label={isSaved ? "Unsave job" : "Save job"}
        className={`absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-200 z-10 ${
          isSaved
            ? "bg-primary/10 border-primary/25 text-primary shadow-sm"
            : "bg-white/80 backdrop-blur-sm border-[#E2E8F0] text-[#94A3B8] hover:bg-primary/8 hover:border-primary/25 hover:text-primary opacity-0 group-hover:opacity-100"
        }`}
      >
        {isSaved ? (
          <IconBookmarkFilled size={14} />
        ) : (
          <IconBookmark size={14} />
        )}
      </button>
    </div>
  );
};
