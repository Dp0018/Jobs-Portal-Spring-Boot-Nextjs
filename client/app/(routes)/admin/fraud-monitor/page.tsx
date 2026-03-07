"use client";

import { useEffect, useState } from "react";
import {
  ShieldAlert,
  Loader2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
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

/* ═══════════════════════════════════════════════════════════════════
 * Admin — AI Fraud Monitoring Dashboard
 * Shows jobs flagged by the AI fraud detection classifier.
 * Admin can approve (clear fraud flags) or delete suspicious jobs.
 * ═══════════════════════════════════════════════════════════════════ */

export default function FraudMonitorPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchJobs = () => {
    setLoading(true);
    getAllJobsAdmin()
      .then((data: any[]) => {
        // Only show jobs that have been flagged (MEDIUM or HIGH risk)
        const flagged = data.filter(
          (j: any) => j.fraudRisk === "MEDIUM" || j.fraudRisk === "HIGH"
        );
        // Sort by fraud score descending
        flagged.sort(
          (a: any, b: any) => (b.fraudScore ?? 0) - (a.fraudScore ?? 0)
        );
        setJobs(flagged);
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Approve job: clear fraud flags
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
        `"${job.jobTitle}" has been approved and fraud flags cleared.`
      );
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
    } catch {
      errorNotification("Error", "Failed to approve job.");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete job
  const handleDelete = async (job: any) => {
    setActionLoading(job.id);
    try {
      await deleteJobAdmin(job.id);
      successNotification(
        "Deleted",
        `"${job.jobTitle}" has been permanently removed.`
      );
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
    } catch {
      errorNotification("Error", "Failed to delete job.");
    } finally {
      setActionLoading(null);
    }
  };

  const riskColor = (risk: string) =>
    risk === "HIGH"
      ? "text-destructive bg-destructive/10 border-destructive/20"
      : "text-amber-600 bg-amber-500/10 border-amber-500/20";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20">
            <ShieldAlert className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              AI Fraud Monitor
            </h1>
            <p className="text-muted-foreground text-sm">
              Jobs flagged by the AI fraud detection classifier
            </p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-card border border-border text-sm font-medium text-muted-foreground">
          {loading ? "…" : `${jobs.length} flagged`}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-dashed border-border">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-muted-foreground text-sm">
            Scanning job postings...
          </p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-dashed border-border">
          <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-1">
            All Clear
          </h3>
          <p className="text-muted-foreground text-sm">
            No suspicious job postings detected by the AI model.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job: any) => (
            <div
              key={job.id}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-lg font-bold text-foreground capitalize">
                      {job.jobTitle}
                    </h3>
                    {/* Risk Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${riskColor(
                        job.fraudRisk
                      )}`}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      {job.fraudRisk} RISK
                    </span>
                    {/* Score */}
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      Score: {job.fraudScore}/100
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-1">
                    <span className="font-medium text-foreground">
                      Company:
                    </span>{" "}
                    {job.company}
                    <span className="mx-2 text-border">•</span>
                    <span className="font-medium text-foreground">
                      Posted by:
                    </span>{" "}
                    User #{job.postedBy}
                    {job.packageOffered && (
                      <>
                        <span className="mx-2 text-border">•</span>
                        <span className="font-medium text-foreground">
                          Salary:
                        </span>{" "}
                        ₹{job.packageOffered} LPA
                      </>
                    )}
                  </p>

                  {/* Fraud Reasons */}
                  {job.fraudReasons && job.fraudReasons.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Detection Reasons:
                      </p>
                      {job.fraudReasons.map((reason: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="text-destructive mt-0.5">•</span>
                          <span className="text-muted-foreground">
                            {reason}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0 lg:flex-col">
                  <Link href={`/jobs/${job.id}`} target="_blank">
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors w-full justify-center">
                      <ExternalLink className="w-4 h-4" />
                      View
                    </button>
                  </Link>
                  <button
                    onClick={() => handleApprove(job)}
                    disabled={actionLoading === job.id}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-500/10 text-green-600 border border-green-500/20 text-sm font-medium hover:bg-green-500/20 transition-colors disabled:opacity-50 w-full justify-center"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleDelete(job)}
                    disabled={actionLoading === job.id}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 text-sm font-medium hover:bg-destructive/20 transition-colors disabled:opacity-50 w-full justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
