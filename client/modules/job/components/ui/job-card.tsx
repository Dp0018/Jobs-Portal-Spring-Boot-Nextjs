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
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { changeProfile } from "@/modules/landing/server/profile-slice";
import { timeAgo } from "@/lib/time-ago";
import { CompanyLogo } from "@/components/ui/company-logo";

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
        }
      : props.fraudRisk === "MEDIUM"
        ? {
            bg: "bg-amber-50",
            border: "border-amber-200",
            text: "text-amber-700",
            label: "Medium Risk",
          }
        : null;

  return (
    <div
      className="group relative bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden flex flex-col
        hover:border-primary/25 hover:shadow-[0_4px_20px_rgba(37,99,235,0.10)] hover:-translate-y-0.5
        transition-all duration-200 cursor-pointer"
    >
      {/* Top accent line — primary on hover */}
      <div className="h-[2px] w-full bg-[#F1F5F9] group-hover:bg-primary transition-colors duration-300" />

      <div className="p-5 flex flex-col flex-1">
        {/* ── Header row ── */}
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Logo + company info */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-xl border border-[#E2E8F0] bg-white flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
              <CompanyLogo
                company={props.company}
                className="h-9 w-9 object-contain"
                fallbackClassName="h-9 w-9"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-[0.95rem] font-bold text-[#0F172A] leading-tight mb-0.5 capitalize truncate group-hover:text-primary transition-colors duration-200">
                {props.jobTitle}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <span className="font-medium capitalize truncate">
                  {props.company}
                </span>
                <span className="text-[#CBD5E1]">·</span>
                <IconUsers size={11} className="shrink-0 text-[#94A3B8]" />
                <span>{props.applicants?.length ?? 0} applicants</span>
              </div>
            </div>
          </div>

          {/* Bookmark */}
          <button
            onClick={handleSaveJob}
            aria-label={isSaved ? "Unsave job" : "Save job"}
            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-150 shrink-0 ${
              isSaved
                ? "bg-primary/10 border-primary/25 text-primary"
                : "bg-[#F8FAFC] border-[#E2E8F0] text-[#94A3B8] hover:bg-primary/8 hover:border-primary/25 hover:text-primary"
            }`}
          >
            {isSaved ? (
              <IconBookmarkFilled size={15} />
            ) : (
              <IconBookmark size={15} />
            )}
          </button>
        </div>

        {/* ── Badge row ── */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {/* Experience */}
          <Badge className="bg-primary/8 text-primary border border-primary/20 text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize h-auto">
            <IconBriefcase size={10} className="mr-1" />
            {props.experience}
          </Badge>

          {/* Job type */}
          <Badge
            variant="outline"
            className="border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize h-auto"
          >
            {props.jobType}
          </Badge>

          {/* Location */}
          <Badge
            variant="outline"
            className="border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize h-auto"
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
            ⚠️ {fraudConfig.label} — AI Fraud Detection
          </div>
        )}

        {/* Verified badge for LOW risk */}
        {props.fraudRisk === "LOW" && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold mb-3 border border-green-200 bg-green-50 text-green-700 w-fit">
            <IconShieldCheck size={11} />
            Verified listing
          </div>
        )}

        {/* ── Job description ── */}
        <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3 flex-1 mb-4">
          {props.about}
        </p>

        <Separator className="bg-[#F1F5F9] mb-4" />

        {/* ── Footer meta row ── */}
        <div className="flex items-center justify-between mb-4">
          {/* Salary */}
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
              <IconCurrencyRupee size={13} className="text-primary" />
            </div>
            <span className="text-sm font-bold text-[#0F172A]">
              {props.packageOffered} LPA
            </span>
          </div>

          {/* Posted time */}
          <div className="flex items-center gap-1 text-[#94A3B8] text-xs">
            <IconClock size={12} />
            <span>{timeAgo(props.postTime)}</span>
          </div>
        </div>

        {/* ── CTA ── */}
        <Link href={`/jobs/${props.id}`}>
          <Button
            className="w-full h-9 bg-primary hover:bg-primary/90 text-white font-semibold text-xs rounded-xl shadow-sm
              hover:shadow-[0_4px_12px_rgba(37,99,235,0.3)] transition-all duration-200 group/btn"
          >
            View Details
            <IconArrowRight
              size={13}
              className="ml-1.5 group-hover/btn:translate-x-0.5 transition-transform"
            />
          </Button>
        </Link>
      </div>
    </div>
  );
};
