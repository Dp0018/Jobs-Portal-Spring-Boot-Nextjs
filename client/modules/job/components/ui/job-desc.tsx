"use client";

import {
  IconBookmark,
  IconBookmarkFilled,
  IconBriefcase,
  IconClock,
  IconUsers,
  IconMapPin,
  IconCurrencyRupee,
  IconShieldExclamation,
  IconShieldCheck,
  IconBuilding,
  IconEdit,
  IconExternalLink,
  IconArrowRight,
  IconCheck,
  IconAlertTriangle,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { changeProfile } from "@/modules/landing/server/profile-slice";
import { errorNotification, successNotification } from "@/modules/notifications/server/notification-service";
import { timeAgo } from "@/lib/time-ago";
import { postJob } from "@/modules/job/server/job-service";
import { CompanyLogo } from "@/components/ui/company-logo";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/* ─────────────────────────────────────────────
   Stat card config — UNCHANGED
───────────────────────────────────────────── */
const STAT_CARDS = [
  { name: "Location",   id: "location",       icon: IconMapPin,         color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100" },
  { name: "Experience", id: "experience",     icon: IconBriefcase,      color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
  { name: "Salary",     id: "packageOffered", icon: IconCurrencyRupee,  color: "text-emerald-600",bg: "bg-emerald-50",border: "border-emerald-100" },
  { name: "Job Type",   id: "jobType",        icon: IconClock,          color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-100" },
];

/* ─────────────────────────────────────────────
   Section heading component
───────────────────────────────────────────── */
const SectionHeading = ({
  label,
  accent = "bg-primary",
}: {
  label: string;
  accent?: string;
}) => (
  <div className="flex items-center gap-3 mb-5">
    <span className={`w-1 h-6 rounded-full shrink-0 ${accent}`} />
    <h2 className="text-base font-bold text-[#0F172A] tracking-tight">{label}</h2>
  </div>
);

/* ═══════════════════════════════════════════
   JOB DESC COMPONENT
═══════════════════════════════════════════ */
const JobDesc = (props: any) => {
  /* ── All logic UNTOUCHED ── */
  const dispatch = useDispatch();
  const profile = useSelector((state: any) => state.profile);
  const user = useSelector((state: any) => state.user);

  const applied = useMemo(() => {
    return (
      props.applicants?.some(
        (applicant: any) => applicant.applicantId === user?.id,
      ) ?? false
    );
  }, [props.applicants, user?.id]);

  const handleSaveJob = () => {
    let savedJobs: any = [...(profile.savedJobs ?? [])];
    if (savedJobs?.includes(props.id)) {
      savedJobs = savedJobs?.filter((id: any) => id !== props.id);
    } else {
      savedJobs = [...savedJobs, props.id];
    }
    dispatch(changeProfile({ ...profile, savedJobs }));
  };

  const handleClose = () => {
    postJob({ ...props, jobStatus: "CLOSED" })
      .then(() => {
        successNotification("Closed", "Job closed Successfully");
      })
      .catch((err: any) => {
        errorNotification(
          "Error",
          err.response?.data?.errorMessage || "Something went wrong",
        );
      });
  };

  const data = DOMPurify.sanitize(props.description || "");
  /* ──────────────────────── */

  const isSaved = profile.savedJobs?.includes(props.id);
  const fraudHigh = props.fraudRisk === "HIGH";
  const fraudMedium = props.fraudRisk === "MEDIUM";
  const showFraudBanner = fraudHigh || fraudMedium;

  return (
    <div className="w-full space-y-5">
      {/* ════════════════════════════════════
          HERO CARD — company + title + CTAs
      ════════════════════════════════════ */}
      <div
        className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden"
        style={{
          boxShadow:
            "0 1px 4px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)",
        }}
      >
        {/* top accent line */}
        <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-primary/30" />

        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-5">
            {/* ── Left: company logo + job info ── */}
            <div className="flex gap-4 items-start flex-1 min-w-0">
              <div
                className="w-16 h-16 rounded-2xl border border-[#E2E8F0] bg-white flex items-center justify-center shrink-0 overflow-hidden"
                style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.08)" }}
              >
                <CompanyLogo
                  company={props.company}
                  className="h-11 w-11 object-contain"
                  fallbackClassName="h-11 w-11"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-black text-[#0F172A] mb-1.5 capitalize leading-tight tracking-tight">
                  {props.jobTitle}
                </h1>

                {/* meta row */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#64748B]">
                  <span className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
                    <IconBuilding size={14} className="text-[#94A3B8]" />
                    <span className="capitalize">{props.company}</span>
                  </span>

                  <span className="text-[#CBD5E1]">·</span>

                  <span className="flex items-center gap-1">
                    <IconClock size={13} className="text-[#94A3B8]" />
                    {timeAgo(props.postTime)}
                  </span>

                  <span className="text-[#CBD5E1]">·</span>

                  <span className="flex items-center gap-1">
                    <IconUsers size={13} className="text-[#94A3B8]" />
                    {props.applicants?.length ?? 0} applicants
                  </span>

                  {props.endDate && (
                    <>
                      <span className="text-[#CBD5E1]">·</span>
                      <span className="flex items-center gap-1 text-red-500 font-medium">
                        <IconX size={12} />
                        Closes{" "}
                        {new Date(props.endDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </>
                  )}
                </div>

                {/* Verified / fraud badge inline */}
                {!showFraudBanner && props.fraudRisk === "LOW" && (
                  <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-[10px] font-bold text-green-700 uppercase tracking-wide">
                    <IconShieldCheck size={11} />
                    Verified listing
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: action buttons ── */}
            <div className="flex sm:flex-col gap-2 items-start sm:items-end shrink-0">
              {/* Primary CTA */}
              {(props.edit ||
                (!applied && user?.accountType !== "EMPLOYER")) && (
                <Link
                  href={
                    props.edit ? `/pjob/${props.id}` : `/apply-job/${props.id}`
                  }
                >
                  <button
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all duration-200 hover:shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                      boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
                    }}
                  >
                    {props.closed ? (
                      <>
                        <IconArrowRight size={15} /> Reopen Job
                      </>
                    ) : props.edit ? (
                      <>
                        <IconEdit size={15} /> Edit Job
                      </>
                    ) : (
                      <>
                        <IconArrowRight size={15} /> Apply Now
                      </>
                    )}
                  </button>
                </Link>
              )}

              {/* Already applied badge */}
              {!props.edit && applied && (
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-bold">
                  <IconCheck size={15} />
                  Applied
                </div>
              )}

              {/* Close job / Bookmark row */}
              <div className="flex items-center gap-2">
                {props.edit && !props.closed ? (
                  <button
                    onClick={handleClose}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 hover:border-red-300 transition-all duration-150"
                  >
                    <IconX size={14} />
                    Close Job
                  </button>
                ) : (
                  <button
                    onClick={handleSaveJob}
                    aria-label={isSaved ? "Unsave job" : "Save job"}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-150 ${
                      isSaved
                        ? "bg-primary/10 border-primary/25 text-primary"
                        : "bg-[#F8FAFC] border-[#E2E8F0] text-[#94A3B8] hover:bg-primary/8 hover:border-primary/25 hover:text-primary"
                    }`}
                  >
                    {isSaved ? (
                      <IconBookmarkFilled size={18} />
                    ) : (
                      <IconBookmark size={18} />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════
          FRAUD RISK BANNER
      ════════════════════════════════════ */}
      {showFraudBanner && (
        <div
          className={`rounded-2xl p-5 border ${
            fraudHigh
              ? "bg-red-50 border-red-200"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                fraudHigh
                  ? "bg-red-100 text-red-600"
                  : "bg-amber-100 text-amber-600"
              }`}
            >
              <IconShieldExclamation size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <h3
                  className={`text-sm font-bold ${fraudHigh ? "text-red-700" : "text-amber-700"}`}
                >
                  AI Fraud Detection — {fraudHigh ? "High" : "Medium"} Risk
                </h3>
                {props.fraudScore !== undefined && (
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold h-5 px-2 rounded-full border ${
                      fraudHigh
                        ? "border-red-300 text-red-600 bg-red-50"
                        : "border-amber-300 text-amber-600 bg-amber-50"
                    }`}
                  >
                    Score: {props.fraudScore}/100
                  </Badge>
                )}
              </div>
              <p className="text-xs text-[#475569] mb-3 leading-relaxed">
                Our AI classification model has flagged potential issues with
                this posting. Please review carefully before applying.
              </p>
              {props.fraudReasons?.length > 0 && (
                <ul className="space-y-1">
                  {props.fraudReasons.map((reason: string, idx: number) => (
                    <li
                      key={idx}
                      className={`text-xs flex items-start gap-2 ${fraudHigh ? "text-red-600" : "text-amber-700"}`}
                    >
                      <IconAlertTriangle
                        size={12}
                        className="shrink-0 mt-0.5"
                      />
                      {reason}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════
          STAT CARDS — 2×2 grid → 4-col on md
      ════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STAT_CARDS.map(({ name, id, icon: Icon, color, bg, border }) => (
          <div
            key={id}
            className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center hover:border-primary/25 hover:shadow-sm transition-all duration-150 group"
          >
            <div
              className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform`}
            >
              <Icon size={18} className={color} stroke={1.75} />
            </div>
            <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold mb-1">
              {name}
            </p>
            <p className="text-sm font-bold text-[#0F172A] capitalize leading-tight">
              {props[id] ?? "—"}
              {id === "packageOffered" && (
                <span className="text-[10px] font-medium text-[#64748B] ml-0.5">
                  LPA
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════
          REQUIRED SKILLS
      ════════════════════════════════════ */}
      <div
        className="bg-white border border-[#E2E8F0] rounded-2xl p-6"
        style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.04)" }}
      >
        <SectionHeading label="Required Skills" accent="bg-primary" />
        <div className="flex flex-wrap gap-2">
          {props?.skillsRequired?.map((skill: string, idx: number) => (
            <span
              key={idx}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/8 text-primary border border-primary/20 hover:bg-primary/15 transition-colors cursor-default"
            >
              {skill}
            </span>
          ))}
          {(!props?.skillsRequired || props.skillsRequired.length === 0) && (
            <p className="text-sm text-[#94A3B8]">No specific skills listed.</p>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════
          JOB DESCRIPTION
      ════════════════════════════════════ */}
      <div
        className="bg-white border border-[#E2E8F0] rounded-2xl p-6"
        style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.04)" }}
      >
        <SectionHeading label="Job Description" accent="bg-primary" />
        <div
          className="
            text-[#475569] text-sm leading-7
            [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-[#0F172A] [&_h4]:mt-5 [&_h4]:mb-2
            [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#0F172A] [&_h3]:mt-6 [&_h3]:mb-2
            [&_p]:mb-4 [&_p]:text-[#475569]
            [&_li]:mb-1.5 [&_li]:ml-1
            [&_ul]:mb-4 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:marker:text-primary
            [&_ol]:mb-4 [&_ol]:pl-5 [&_ol]:list-decimal
            [&_strong]:text-[#0F172A] [&_strong]:font-semibold
            [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2
          "
          dangerouslySetInnerHTML={{ __html: data }}
        />
      </div>

      {/* ════════════════════════════════════
          ABOUT COMPANY
      ════════════════════════════════════ */}
      <div
        className="bg-white border border-[#E2E8F0] rounded-2xl p-6"
        style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.04)" }}
      >
        <SectionHeading
          label="About Company"
          accent="bg-gradient-to-b from-primary to-primary/40"
        />

        {/* Company card */}
        <div className="flex items-center justify-between gap-4 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl mb-5">
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="w-12 h-12 rounded-xl border border-[#E2E8F0] bg-white flex items-center justify-center shrink-0 overflow-hidden"
              style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
            >
              <CompanyLogo
                company={props.company}
                className="h-9 w-9 object-contain"
                fallbackClassName="h-9 w-9"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#0F172A] capitalize leading-tight">
                {props.company}
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5 flex items-center gap-1">
                <IconUsers size={11} />
                10K+ Employees
              </p>
            </div>
          </div>

          <Link href={`/company/${props.company}`} className="shrink-0">
            <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#475569] font-semibold hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all duration-150">
              <IconExternalLink size={13} />
              Company Page
            </button>
          </Link>
        </div>

        <Separator className="bg-[#F1F5F9] mb-5" />

        {/* Company description */}
        <p className="text-sm text-[#475569] leading-relaxed">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
          accusantium nobis magnam aut laborum commodi natus vero sequi aliquam
          voluptas perspiciatis amet est velit corporis, consequuntur dolores
          dolorum ducimus autem, provident officia, assumenda eos vel voluptatem
          cum. Magnam, excepturi quae?
        </p>
      </div>
    </div>
  );
};;

export default JobDesc;