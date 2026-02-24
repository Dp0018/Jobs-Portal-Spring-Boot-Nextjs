"use client";

import { useEffect, useState } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  IconCalendarMonth,
  IconMapPin,
  IconMail,
  IconLink,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  changeAppStatus,
  analyzeResume,
  getJob,
} from "@/modules/job/server/job-service";
import {
  errorNotification,
  successNotification,
} from "@/modules/notifications/server/notification-service";
import { formatInterviewTime } from "@/lib/format-interview-time";
import { openBase64PDF } from "@/lib/open-base64-pdf";

interface JobAnalyticsViewProps {
  jobId: string;
}

export const JobAnalyticsView = ({ jobId }: JobAnalyticsViewProps) => {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scanningId, setScanningId] = useState<string | null>(null);

  const handleScan = (applicantId: string) => {
    setScanningId(applicantId);
    analyzeResume(jobId, applicantId)
      .then(() => {
        successNotification(
          "Scan Complete",
          "Resume successfully analyzed by AI ✨",
        );
        window.location.reload();
      })
      .catch(() => {
        errorNotification("Error", "Failed to scan resume with AI");
      })
      .finally(() => {
        setScanningId(null);
      });
  };

  const handleStatusChange = (applicantId: string, status: string) => {
    const payload = {
      id: jobId,
      applicantId: applicantId,
      applicationStatus: status,
      emailMessage: `Status updated to ${status}`,
    };

    changeAppStatus(payload)
      .then(() => {
        successNotification("Status Updated", `Applicant marked as ${status}`);
        window.location.reload();
      })
      .catch((err) => {
        errorNotification(
          "Error",
          err?.response?.data?.errorMessage || "Failed to update status",
        );
      });
  };

  useEffect(() => {
    if (jobId) {
      setLoading(true);
      getJob(jobId)
        .then((res) => {
          setJob(res);
        })
        .catch((err) => {
          console.error("Error fetching job analytics:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse">Loading analytics for this job...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-xl text-muted-foreground mb-4">Job data not found.</p>
        <Link href="/employer/jobs" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to My Jobs
        </Link>
      </div>
    );
  }

  const applicants = job.applicants || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Back Navigation */}
      <div className="mb-10 border-b border-border pb-6">
        <Link
          href="/employer/jobs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 bg-muted/50 px-3 py-1.5 rounded-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">
              {job.jobTitle}
            </h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                {job.jobStatus || "Active"}
              </span>
              <span>{job.company}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <IconMapPin size={16} />
                {job.location}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {applicants.length}
            </div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
              Total Applicants
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Pipeline Data Table / Grid */}
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Applicant Review Pipeline</h2>
          <p className="text-muted-foreground text-lg">
            Review full candidate details, analyze resumes with AI, and manage
            application statuses directly.
          </p>
        </div>

        {applicants.length > 0 ? (
          <div className="flex flex-col gap-8">
            {applicants.map((applicant: any, index: number) => {
              const initials = applicant.name
                ? applicant.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "?";
              const isMatchScored =
                applicant.matchScore !== undefined &&
                applicant.matchScore !== null &&
                applicant.matchScore > 0;

              return (
                <div
                  key={index}
                  className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Top Section: Profile Info */}
                  <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
                    {/* Left Col: Avatar & Basic Info */}
                    <div className="flex-1 space-y-6">
                      <div className="flex items-start gap-5">
                        <Avatar className="h-20 w-20 ring-4 ring-muted">
                          <AvatarImage
                            src={
                              applicant.picture
                                ? `data:image/jpeg;base64,${applicant.picture}`
                                : undefined
                            }
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-2xl font-bold text-foreground capitalize">
                            {applicant.name}
                          </h3>
                          <p className="text-lg text-muted-foreground capitalize mb-2">
                            {applicant.jobTitle || "Candidate"}
                          </p>
                          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                            {applicant.email && (
                              <span className="flex items-center gap-1">
                                <IconMail size={16} /> {applicant.email}
                              </span>
                            )}
                            {applicant.website && (
                              <span className="flex items-center gap-1">
                                <IconLink size={16} />{" "}
                                <a
                                  href={applicant.website}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="hover:text-primary hover:underline"
                                >
                                  Portfolio
                                </a>
                              </span>
                            )}
                            {applicant.location && (
                              <span className="flex items-center gap-1">
                                <IconMapPin size={16} /> {applicant.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
                            About Candidate
                          </h4>
                          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                            {applicant.about ||
                              applicant.coverLetter ||
                              "No cover letter or about section provided."}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
                            Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {applicant.candidateSkills?.length > 0 ? (
                              applicant.candidateSkills.map(
                                (s: string, i: number) => (
                                  <Badge
                                    key={i}
                                    variant="secondary"
                                    className="bg-muted px-2.5 py-1 text-sm font-medium"
                                  >
                                    {s}
                                  </Badge>
                                ),
                              )
                            ) : (
                              <span className="text-muted-foreground italic text-sm">
                                No specific skills listed
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="pt-2">
                          <Button
                            variant="link"
                            onClick={() => openBase64PDF(applicant.resume)}
                            className="h-auto p-0 text-primary font-semibold text-base"
                          >
                            View Full Resume PDF Document &rarr;
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Right Col: AI Analysis & Status */}
                    <div className="lg:w-[400px] xl:w-[500px] shrink-0 bg-muted/30 rounded-xl p-6 border border-border/40 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-lg flex items-center gap-2">
                          ✨ AI Resume Analysis
                        </h4>
                        {isMatchScored && (
                          <Badge
                            className={cn(
                              "text-sm px-3 py-1 font-bold",
                              applicant.matchScore >= 80
                                ? "bg-green-500 hover:bg-green-600"
                                : applicant.matchScore >= 50
                                  ? "bg-yellow-500 hover:bg-yellow-600"
                                  : "bg-red-500 hover:bg-red-600",
                            )}
                          >
                            {applicant.matchScore}% Match
                          </Badge>
                        )}
                      </div>

                      {isMatchScored ? (
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed text-foreground/80 mb-4 bg-background border border-border/50 p-4 rounded-lg">
                            {applicant.aiExplanation}
                          </p>
                          {applicant.interviewTime && (
                            <div className="mt-4 flex items-center gap-2 text-primary font-medium bg-primary/10 p-3 rounded-lg border border-primary/20">
                              <IconCalendarMonth size={20} />
                              Interview Scheduled:{" "}
                              {formatInterviewTime(applicant.interviewTime)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-border/50 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-4">
                            This candidate's application has not been analyzed
                            against the job requirements yet.
                          </p>
                          <Button
                            onClick={() => handleScan(applicant.applicantId)}
                            disabled={scanningId === applicant.applicantId}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold"
                          >
                            {scanningId === applicant.applicantId ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                Scanning...
                              </>
                            ) : (
                              "✨ Run AI Match Analysis"
                            )}
                          </Button>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-border/50 flex flex-col gap-2">
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Current Status
                        </div>
                        <div
                          className={cn(
                            "inline-flex justify-center w-full py-2.5 rounded-lg border font-bold text-sm",
                            applicant.applicationStatus === "APPLIED"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              : applicant.applicationStatus === "INTERVIEWING"
                                ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                                : applicant.applicationStatus === "OFFERED" ||
                                    applicant.applicationStatus === "HIRED"
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : "bg-destructive/10 text-destructive border-destructive/20",
                          )}
                        >
                          {applicant.applicationStatus}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section: Action Controls */}
                  <div className="bg-muted px-6 py-4 md:px-8 border-t border-border flex flex-col sm:flex-row items-center justify-end gap-3">
                    {applicant.applicationStatus === "APPLIED" && (
                      <>
                        <Button
                          onClick={() =>
                            handleStatusChange(
                              applicant.applicantId,
                              "REJECTED",
                            )
                          }
                          variant="outline"
                          className="w-full sm:w-auto border-destructive/50 text-destructive hover:bg-destructive/10 font-bold"
                        >
                          Reject Candidacy
                        </Button>
                        <Button
                          onClick={() =>
                            handleStatusChange(
                              applicant.applicantId,
                              "INTERVIEWING",
                            )
                          }
                          className="w-full sm:w-auto font-bold bg-primary hover:bg-primary/90 text-primary-foreground min-w-[200px]"
                        >
                          Schedule Interview
                        </Button>
                      </>
                    )}

                    {applicant.applicationStatus === "INTERVIEWING" && (
                      <>
                        <Button
                          onClick={() =>
                            handleStatusChange(
                              applicant.applicantId,
                              "REJECTED",
                            )
                          }
                          variant="outline"
                          className="w-full sm:w-auto border-destructive/50 text-destructive hover:bg-destructive/10 font-bold"
                        >
                          Reject Candidacy
                        </Button>
                        <Button
                          onClick={() =>
                            handleStatusChange(applicant.applicantId, "OFFERED")
                          }
                          className="w-full sm:w-auto font-bold bg-green-500 hover:bg-green-600 text-white min-w-[200px]"
                        >
                          Hire / Extend Offer
                        </Button>
                      </>
                    )}

                    {(applicant.applicationStatus === "OFFERED" ||
                      applicant.applicationStatus === "HIRED" ||
                      applicant.applicationStatus === "REJECTED") && (
                      <div className="text-sm text-muted-foreground font-medium flex-1 text-right">
                        Decision has been made for this candidate.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center border-2 border-dashed border-border rounded-2xl bg-card">
            <h3 className="text-xl font-bold mb-2">No Applicants Yet</h3>
            <p className="text-muted-foreground">
              Your job posting is active, but no one has applied to this
              position yet. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
