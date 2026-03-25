"use client";

import { useEffect, useState } from "react";
import {
  ShieldAlert,
  Loader2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import {
  getAllJobsAdmin,
  deleteJobAdmin,
} from "@/modules/admin/server/admin-service";
import { postJob } from "@/modules/job/server/job-service";
import {
  successNotification,
  errorNotification,
} from "@/modules/notifications/server/notification-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function FraudMonitorPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchJobs = () => {
    setLoading(true);
    getAllJobsAdmin()
      .then((data: any[]) => {
        const flagged = data.filter(
          (j: any) => j.fraudRisk === "MEDIUM" || j.fraudRisk === "HIGH",
        );
        flagged.sort(
          (a: any, b: any) => (b.fraudScore ?? 0) - (a.fraudScore ?? 0),
        );
        setJobs(flagged);
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApprove = async (job: any) => {
    setActionLoading(job.id);
    try {
      await postJob({
        ...job,
        fraudScore: 0,
        fraudRisk: "LOW",
        fraudReasons: [],
      });
      successNotification(
        "Approved",
        `"${job.jobTitle}" has been approved and fraud flags cleared.`,
      );
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
    } catch {
      errorNotification("Error", "Failed to approve job.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (job: any) => {
    setActionLoading(job.id);
    try {
      await deleteJobAdmin(job.id);
      successNotification(
        "Deleted",
        `"${job.jobTitle}" has been permanently removed.`,
      );
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
    } catch {
      errorNotification("Error", "Failed to delete job.");
    } finally {
      setActionLoading(null);
    }
  };

  const highCount = jobs.filter((j) => j.fraudRisk === "HIGH").length;
  const mediumCount = jobs.filter((j) => j.fraudRisk === "MEDIUM").length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-[#EF4444]" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              AI Fraud Monitor
            </h1>
            <p className="text-sm text-[#475569] mt-0.5">
              Jobs flagged by the AI fraud detection classifier
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchJobs}
            disabled={loading}
            className="h-8 text-xs border-[#E2E8F0] text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg gap-1.5"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg shadow-sm text-xs font-semibold text-[#475569]">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            {loading ? "—" : `${jobs.length} flagged`}
          </div>
        </div>
      </div>

      {/* ── Summary Chips ── */}
      {!loading && jobs.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-xs font-semibold text-[#DC2626]">
            <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2} />
            {highCount} High Risk
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl text-xs font-semibold text-[#D97706]">
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
            {mediumCount} Medium Risk
          </div>
          <span className="text-xs text-[#94A3B8]">
            Sorted by fraud score (highest first)
          </span>
        </div>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-5"
            >
              <div className="flex gap-4">
                <div className="flex-1 space-y-2.5">
                  <Skeleton className="h-5 w-48 bg-[#F1F5F9]" />
                  <Skeleton className="h-3.5 w-72 bg-[#F1F5F9]" />
                  <Skeleton className="h-3.5 w-56 bg-[#F1F5F9]" />
                </div>
                <div className="flex flex-col gap-2 w-24">
                  <Skeleton className="h-8 w-full bg-[#F1F5F9] rounded-lg" />
                  <Skeleton className="h-8 w-full bg-[#F1F5F9] rounded-lg" />
                  <Skeleton className="h-8 w-full bg-[#F1F5F9] rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center mb-4">
            <CheckCircle2
              className="w-7 h-7 text-emerald-500"
              strokeWidth={1.8}
            />
          </div>
          <h3 className="text-base font-bold text-[#0F172A] mb-1">All Clear</h3>
          <p className="text-sm text-[#94A3B8] text-center max-w-xs">
            No suspicious job postings detected by the AI model. The platform
            looks clean.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job: any) => {
            const isHigh = job.fraudRisk === "HIGH";
            const isActioning = actionLoading === job.id;
            const scoreColor =
              job.fraudScore >= 75
                ? "#EF4444"
                : job.fraudScore >= 50
                  ? "#F97316"
                  : "#EAB308";

            return (
              <div
                key={job.id}
                className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 ${
                  isHigh ? "border-[#FECACA]" : "border-[#FDE68A]"
                }`}
              >
                {/* Left accent stripe */}
                <div className="flex gap-5">
                  <div
                    className={`w-1 rounded-full shrink-0 ${isHigh ? "bg-[#EF4444]" : "bg-[#F59E0B]"}`}
                  />

                  <div className="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      {/* Title row */}
                      <div className="flex items-center gap-2.5 flex-wrap mb-2">
                        <h3 className="text-[15px] font-bold text-[#0F172A] capitalize leading-tight">
                          {job.jobTitle}
                        </h3>
                        {/* Risk badge */}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                            isHigh
                              ? "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]"
                              : "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]"
                          }`}
                        >
                          <AlertTriangle
                            className="w-2.5 h-2.5"
                            strokeWidth={2.5}
                          />
                          {job.fraudRisk} RISK
                        </span>
                        {/* Score pill */}
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]"
                          style={{ color: scoreColor }}
                        >
                          Score: {job.fraudScore}/100
                        </span>
                      </div>

                      {/* Meta row */}
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-[#94A3B8] mb-3">
                        <span>
                          <span className="text-[#475569] font-medium">
                            Company:
                          </span>{" "}
                          {job.company}
                        </span>
                        <span className="text-[#E2E8F0]">•</span>
                        <span>
                          <span className="text-[#475569] font-medium">
                            Posted by:
                          </span>{" "}
                          User #{job.postedBy}
                        </span>
                        {job.packageOffered && (
                          <>
                            <span className="text-[#E2E8F0]">•</span>
                            <span>
                              <span className="text-[#475569] font-medium">
                                Salary:
                              </span>{" "}
                              ₹{job.packageOffered} LPA
                            </span>
                          </>
                        )}
                      </div>

                      {/* Score bar */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 max-w-[200px] h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${job.fraudScore}%`,
                              backgroundColor: scoreColor,
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-[#94A3B8]">
                          Fraud confidence
                        </span>
                      </div>

                      {/* Fraud Reasons */}
                      {job.fraudReasons?.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.07em]">
                            Detection Reasons
                          </p>
                          <div className="space-y-1">
                            {job.fraudReasons.map(
                              (reason: string, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2"
                                >
                                  <div
                                    className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${isHigh ? "bg-[#EF4444]" : "bg-[#F59E0B]"}`}
                                  />
                                  <span className="text-xs text-[#475569] leading-relaxed">
                                    {reason}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 shrink-0">
                      <Link
                        href={`/jobs/${job.id}`}
                        target="_blank"
                        className="flex-1 lg:flex-none"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-8 text-xs border-[#E2E8F0] text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-lg gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Job
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(job)}
                        disabled={isActioning}
                        className="flex-1 lg:flex-none h-8 text-xs bg-[#ECFDF5] text-emerald-700 border border-[#A7F3D0] hover:bg-emerald-100 shadow-none rounded-lg gap-1.5 font-semibold"
                      >
                        {isActioning ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2
                            className="w-3.5 h-3.5"
                            strokeWidth={2}
                          />
                        )}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDelete(job)}
                        disabled={isActioning}
                        className="flex-1 lg:flex-none h-8 text-xs bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] hover:bg-red-100 shadow-none rounded-lg gap-1.5 font-semibold"
                      >
                        {isActioning ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
