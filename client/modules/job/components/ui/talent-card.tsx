"use client";

import {
  IconCalendarMonth,
  IconHeart,
  IconMapPin,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getProfile } from "@/modules/profile/server/profile-service";
import { changeAppStatus, analyzeResume } from "../../server/job-service";
import {
  errorNotification,
  successNotification,
} from "@/modules/notifications/server/notification-service";
import { formatInterviewTime } from "@/lib/format-interview-time";
import { openBase64PDF } from "@/lib/open-base64-pdf";
import { Briefcase, Sparkles, Scale, RefreshCw } from "lucide-react";

export const TalentCard = (props: any) => {
  const params = useParams();
  const id = (params?.jobId || params?.id || props.jobId) as string;

  const [interviewOpen, setInterviewOpen] = useState(false);
  const [appOpen, setAppOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [profile, setProfile] = useState<any>({});
  const [isLiked, setIsLiked] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [pendingOfferStatus, setPendingOfferStatus] = useState("");
  const [aiResultsOpen, setAiResultsOpen] = useState(false);

  const handleScan = () => {
    setScanning(true);
    analyzeResume(id, props.applicantId)
      .then(() => {
        setScanning(false);
        successNotification(
          "Scan Complete",
          "Resume successfully analyzed by AI ✨",
        );
        window.location.reload();
      })
      .catch(() => {
        setScanning(false);
        errorNotification("Error", "Failed to scan resume with AI");
      });
  };

  useEffect(() => {
    if (props.applicantId) {
      getProfile(props.applicantId)
        .then((res) => setProfile(res))
        .catch((err) => console.log(err));
    } else {
      setProfile(props);
    }
  }, [props.applicantId, props.id, props.name]);

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const todayStr = new Date().toISOString().split("T")[0];

  const handleOfferClick = (status: string) => {
    setPendingOfferStatus(status);
    let defaultMsg = "";
    if (status === "INTERVIEWING")
      defaultMsg = `Congratulations! You have been selected for an interview for the position of ${props.jobTitle || "the given role"} at ${props.company || "our company"}. We will be in touch shortly with more details.`;
    else if (status === "OFFERED")
      defaultMsg = `Congratulations! We are thrilled to offer you the position of ${props.jobTitle || "the given role"} at ${props.company || "our company"}. Welcome to the team!`;
    else if (status === "REJECTED")
      defaultMsg = `Thank you for your interest in ${props.company || "our company"}. Unfortunately, we will not be moving forward with your application for the ${props.jobTitle || "the given role"} position at this time. We wish you the best in your job search.`;

    setEmailMessage(defaultMsg);
    if (status === "INTERVIEWING") setInterviewOpen(true);
    else setEmailDialogOpen(true);
  };

  const handleOfferSubmit = (status: string) => {
    let interview: any = {
      id,
      applicantId: profile?.id,
      applicationStatus: status,
      emailMessage,
    };
    if (status === "INTERVIEWING") {
      const combined = new Date(`${date}T${time}`);
      interview = { ...interview, interviewTime: combined };
    }
    changeAppStatus(interview)
      .then(() => {
        if (status === "INTERVIEWING")
          successNotification(
            "Interview Scheduled",
            "Interview scheduled & email sent 👍",
          );
        else if (status === "OFFERED")
          successNotification("Hired", "Offer & email sent successfully 👏");
        else
          successNotification(
            "Rejected",
            "Application rejected & email sent 🙏",
          );
        window.location.reload();
      })
      .catch((err: any) => {
        errorNotification(
          "Error",
          err?.response?.data?.errorMessage || "An error occurred",
        );
      });
  };

  const matchScoreColor =
    props.matchScore >= 80
      ? {
          bg: "bg-[#ECFDF5]",
          text: "text-emerald-700",
          border: "border-[#A7F3D0]",
          bar: "#10B981",
        }
      : props.matchScore >= 50
        ? {
            bg: "bg-[#FFFBEB]",
            text: "text-[#D97706]",
            border: "border-[#FDE68A]",
            bar: "#F59E0B",
          }
        : {
            bg: "bg-[#FEF2F2]",
            text: "text-[#DC2626]",
            border: "border-[#FECACA]",
            bar: "#EF4444",
          };

  return (
    <>
      {/* ══ Card ══ */}
      <div className="group bg-white border border-[#E2E8F0] rounded-2xl p-5 hover:border-[#BFDBFE] hover:shadow-md transition-all duration-200 flex flex-col">
        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-3 items-center flex-1 min-w-0">
            <Avatar className="h-11 w-11 border-2 border-[#E2E8F0] group-hover:border-[#BFDBFE] transition-colors shrink-0">
              <AvatarImage
                src={
                  profile?.picture
                    ? `data:image/jpeg;base64,${profile.picture}`
                    : undefined
                }
                alt={props.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-[#EFF6FF] text-[#2563EB] font-bold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-[#0F172A] truncate capitalize group-hover:text-[#2563EB] transition-colors">
                {props.name}
              </p>
              <p className="text-xs text-[#475569] truncate capitalize mt-0.5">
                {profile?.jobTitle}
                {profile?.company && (
                  <span className="text-[#CBD5E1]"> · {profile.company}</span>
                )}
              </p>
            </div>
          </div>

          {/* Like button */}
          <button
            onClick={() => setIsLiked((v) => !v)}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#FEF2F2] transition-colors shrink-0"
          >
            <IconHeart
              className={cn(
                "w-4 h-4 transition-all",
                isLiked
                  ? "text-[#EF4444] fill-[#EF4444]"
                  : "text-[#CBD5E1] hover:text-[#EF4444]",
              )}
              stroke={1.8}
            />
          </button>
        </div>

        {/* ── Skills ── */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {profile?.skills?.slice(0, 4).map((skill: string, i: number) => (
            <Badge
              key={i}
              variant="outline"
              className="px-2 py-0.5 text-[10px] font-semibold bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] rounded-lg capitalize hover:bg-[#EFF6FF] hover:text-[#2563EB] hover:border-[#BFDBFE] transition-colors"
            >
              {skill}
            </Badge>
          ))}
        </div>

        {/* ── AI Match Score ── */}
        {props.matchScore !== undefined && props.matchScore !== null && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setAiResultsOpen(true)}
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all hover:-translate-y-0.5",
                matchScoreColor.bg,
                matchScoreColor.text,
                matchScoreColor.border,
              )}
            >
              <Sparkles className="w-3 h-3" strokeWidth={2} />
              AI Match: {props.matchScore}%
            </button>

            {props.fairnessScore !== undefined &&
              props.fairnessScore !== null && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-[#F5F3FF] text-violet-700 border-[#DDD6FE] cursor-help">
                        <Scale className="w-3 h-3" strokeWidth={2} />
                        Fairness: {props.fairnessScore}%
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs bg-white border-[#E2E8F0] text-[#475569]">
                      PII redacted. Candidate evaluated without bias.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleScan}
              disabled={scanning}
              className="h-6 text-[10px] px-2 py-0 border-[#E2E8F0] text-[#475569] hover:text-[#2563EB] hover:border-[#BFDBFE] rounded-lg gap-1"
            >
              <RefreshCw
                className={cn("w-2.5 h-2.5", scanning && "animate-spin")}
                strokeWidth={2.5}
              />
              {scanning ? "Scanning…" : "Rescan"}
            </Button>
          </div>
        )}

        {/* ── About ── */}
        <p className="text-xs text-[#475569] leading-relaxed mb-4 line-clamp-3">
          {profile?.about}
        </p>

        <Separator className="bg-[#F1F5F9] mb-4" />

        {/* ── Experience / Interview ── */}
        <div className="flex justify-between items-center mb-4 text-sm">
          {props.invited ? (
            <div className="flex gap-2 items-center text-[#2563EB] font-medium text-xs">
              <IconCalendarMonth size={15} stroke={1.8} />
              Interview: {formatInterviewTime(props.interviewTime)}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-[#EFF6FF] flex items-center justify-center">
                  <Briefcase
                    className="w-3 h-3 text-[#2563EB]"
                    strokeWidth={2}
                  />
                </div>
                <span className="text-xs font-bold text-[#0F172A]">
                  {props.totalExp ?? 1}{" "}
                  {(props.totalExp ?? 1) > 1 ? "yrs exp" : "yr exp"}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#94A3B8]">
                <IconMapPin className="w-3.5 h-3.5" stroke={1.8} />
                <span className="truncate max-w-[120px]">
                  {profile?.location}
                </span>
              </div>
            </>
          )}
        </div>

        <Separator className="bg-[#F1F5F9] mb-4" />

        {/* ── Action Buttons ── */}
        <div className="flex gap-2.5 mt-auto">
          {props.posted ? (
            <>
              {props.applicationStatus === "APPLIED" &&
              (props.matchScore === undefined ||
                props.matchScore === null ||
                props.matchScore === 0) ? (
                <Button
                  onClick={handleScan}
                  disabled={scanning}
                  className="w-full h-9 text-xs bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] hover:bg-[#DBEAFE] shadow-none font-semibold rounded-xl gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
                  {scanning ? "Scanning…" : "Scan with AI"}
                </Button>
              ) : props.applicationStatus === "APPLIED" ? (
                <>
                  <Button
                    onClick={() => handleOfferClick("INTERVIEWING")}
                    className="flex-1 h-9 text-xs bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] hover:bg-[#DBEAFE] shadow-none font-semibold rounded-xl"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleOfferClick("REJECTED")}
                    className="flex-1 h-9 text-xs bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] hover:bg-red-100 shadow-none font-semibold rounded-xl"
                  >
                    Reject
                  </Button>
                </>
              ) : props.applicationStatus === "INTERVIEWING" ? (
                <>
                  <Button
                    onClick={() => handleOfferClick("OFFERED")}
                    className="flex-1 h-9 text-xs bg-[#ECFDF5] text-emerald-700 border border-[#A7F3D0] hover:bg-emerald-100 shadow-none font-semibold rounded-xl"
                  >
                    Hire
                  </Button>
                  <Button
                    onClick={() => handleOfferClick("REJECTED")}
                    className="flex-1 h-9 text-xs bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] hover:bg-red-100 shadow-none font-semibold rounded-xl"
                  >
                    Reject
                  </Button>
                </>
              ) : props.applicationStatus === "OFFERED" ? (
                <div className="w-full text-center py-2 rounded-xl bg-[#ECFDF5] text-emerald-700 text-xs font-bold border border-[#A7F3D0]">
                  HIRED 🎉
                </div>
              ) : props.applicationStatus === "REJECTED" ? (
                <div className="w-full text-center py-2 rounded-xl bg-[#FEF2F2] text-[#DC2626] text-xs font-bold border border-[#FECACA]">
                  REJECTED
                </div>
              ) : null}
            </>
          ) : (
            <>
              <Link href={`/talent-profile/${profile?.id}`} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full h-9 text-xs border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] hover:border-[#BFDBFE] hover:text-[#2563EB] rounded-xl font-semibold"
                >
                  Profile
                </Button>
              </Link>
              <div className="flex-1">
                <Button className="w-full h-9 text-xs bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/20 rounded-xl font-semibold">
                  Message
                </Button>
              </div>
            </>
          )}
        </div>

        {/* View Application button */}
        {(props.invited || props.posted) && (
          <Button
            onClick={() => setAppOpen(true)}
            className="w-full mt-2.5 h-9 text-xs bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] hover:bg-[#EFF6FF] hover:text-[#2563EB] hover:border-[#BFDBFE] shadow-none rounded-xl font-semibold"
          >
            View Application
          </Button>
        )}
      </div>

      {/* ══ Schedule Interview Dialog ══ */}
      <Dialog open={interviewOpen} onOpenChange={setInterviewOpen}>
        <DialogContent className="bg-white border border-[#E2E8F0] shadow-xl rounded-2xl sm:max-w-md">
          <DialogHeader className="border-b border-[#F1F5F9] pb-4">
            <DialogTitle className="text-[#0F172A] font-bold text-base">
              Schedule Interview
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
                Date
              </Label>
              <Input
                type="date"
                min={todayStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-10 bg-[#F8FAFC] border-[#E2E8F0] rounded-xl text-[#0F172A] focus-visible:ring-1 focus-visible:ring-[#2563EB] focus-visible:border-[#2563EB]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
                Time
              </Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-10 bg-[#F8FAFC] border-[#E2E8F0] rounded-xl text-[#0F172A] focus-visible:ring-1 focus-visible:ring-[#2563EB] focus-visible:border-[#2563EB]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
                Email Message
              </Label>
              <Textarea
                rows={4}
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                className="bg-[#F8FAFC] border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] resize-none focus-visible:ring-1 focus-visible:ring-[#2563EB] focus-visible:border-[#2563EB]"
              />
            </div>
            <Button
              onClick={() => {
                handleOfferSubmit("INTERVIEWING");
                setInterviewOpen(false);
              }}
              disabled={!date || !time}
              className="w-full h-10 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl text-sm disabled:opacity-50 shadow-sm"
            >
              Confirm Interview & Send Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ══ Application Details Dialog ══ */}
      <Dialog open={appOpen} onOpenChange={setAppOpen}>
        <DialogContent className="bg-white border border-[#E2E8F0] shadow-xl rounded-2xl sm:max-w-xl">
          <DialogHeader className="border-b border-[#F1F5F9] pb-4">
            <DialogTitle className="text-[#0F172A] font-bold text-base">
              Application Details
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-2">
            {[
              {
                label: "Email",
                content: (
                  <a
                    href={`mailto:${props.email}`}
                    className="text-[#2563EB] hover:underline text-sm"
                  >
                    {props.email}
                  </a>
                ),
              },
              {
                label: "Website",
                content: (
                  <a
                    href={props.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#2563EB] hover:underline text-sm"
                  >
                    {props.website}
                  </a>
                ),
              },
              {
                label: "Resume",
                content: (
                  <button
                    onClick={() => openBase64PDF(props.resume)}
                    className="text-[#2563EB] hover:underline text-sm text-left"
                  >
                    View Resume — {props.name}
                  </button>
                ),
              },
              {
                label: "Cover Letter",
                content: (
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {props.coverLetter}
                  </p>
                ),
              },
              ...(props.matchScore !== undefined && props.matchScore !== null
                ? [
                    {
                      label: "✨ AI Interview Suitability",
                      content: (
                        <p className="text-sm text-[#475569] leading-relaxed italic">
                          {props.aiExplanation || "Evaluating candidate fit…"}
                        </p>
                      ),
                    },
                  ]
                : []),
            ].map(({ label, content }) => (
              <div
                key={label}
                className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]"
              >
                <div className="text-[10px] text-[#94A3B8] mb-1.5 font-bold uppercase tracking-wider">
                  {label}
                </div>
                {content}
              </div>
            ))}
            {props.matchScore !== undefined && props.matchScore !== null && (
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border self-start",
                  matchScoreColor.bg,
                  matchScoreColor.text,
                  matchScoreColor.border,
                )}
              >
                <Sparkles className="w-3 h-3" strokeWidth={2} />
                AI Match: {props.matchScore}%
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ══ Email Action Dialog ══ */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="bg-white border border-[#E2E8F0] shadow-xl rounded-2xl sm:max-w-xl">
          <DialogHeader className="border-b border-[#F1F5F9] pb-4">
            <DialogTitle className="text-[#0F172A] font-bold text-base">
              Review Email Message
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
                Email Content
              </Label>
              <Textarea
                rows={6}
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                className="bg-[#F8FAFC] border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] resize-none focus-visible:ring-1 focus-visible:ring-[#2563EB] focus-visible:border-[#2563EB]"
              />
              <p className="text-xs text-[#94A3B8]">
                This email will be sent along with an in-app notification
                confirming your decision.
              </p>
            </div>
            <Button
              onClick={() => {
                handleOfferSubmit(pendingOfferStatus);
                setEmailDialogOpen(false);
              }}
              className={cn(
                "w-full h-10 font-semibold rounded-xl text-sm shadow-sm",
                pendingOfferStatus === "REJECTED"
                  ? "bg-[#EF4444] hover:bg-red-600 text-white"
                  : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white",
              )}
            >
              Update Status & Send Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ══ AI Scan Results Dialog ══ */}
      <Dialog open={aiResultsOpen} onOpenChange={setAiResultsOpen}>
        <DialogContent className="bg-white border border-[#E2E8F0] shadow-xl rounded-2xl w-[95vw] sm:max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="border-b border-[#F1F5F9] pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-[#0F172A] font-bold text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2563EB]" strokeWidth={2} />
                AI Resume Analysis
              </DialogTitle>
              {props.matchScore !== undefined && props.matchScore !== null && (
                <div
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-bold border",
                    matchScoreColor.bg,
                    matchScoreColor.text,
                    matchScoreColor.border,
                  )}
                >
                  {props.matchScore}% Match
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-5 pt-4">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-[0.07em]">
                AI Explanation
              </h4>
              <p className="text-sm text-[#475569] leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                {props.aiExplanation || "Evaluating candidate fit…"}
              </p>
            </div>

            {props.fairnessScore !== undefined &&
              props.fairnessScore !== null && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-[0.07em] flex items-center gap-1.5 text-violet-600">
                    <Scale className="w-3.5 h-3.5" strokeWidth={2} />
                    Ethical AI / Fairness Report
                    <span className="bg-[#F5F3FF] text-violet-700 border border-[#DDD6FE] px-2 py-0.5 rounded-md text-[10px]">
                      Score: {props.fairnessScore}%
                    </span>
                  </h4>
                  <div className="text-sm text-[#475569] leading-relaxed bg-[#F5F3FF] p-4 rounded-xl border border-[#DDD6FE]">
                    <p className="mb-2 text-[11px] font-bold text-violet-500">
                      ✅ GDPR Compliant · PII Redacted Before Analysis
                    </p>
                    <p>
                      {props.fairnessExplanation ||
                        "Candidate was evaluated objectively based purely on technical skills and experience without demographic bias."}
                    </p>
                  </div>
                </div>
              )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-[0.07em] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {props.requiredSkills?.length > 0 ? (
                    props.requiredSkills.map((skill: string, idx: number) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-[10px] bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] rounded-lg"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-[#94A3B8] italic">
                      No required skills specified
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-[0.07em] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Candidate Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {props.candidateSkills?.length > 0 ? (
                    props.candidateSkills.map((skill: string, idx: number) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-[10px] bg-[#ECFDF5] text-emerald-700 border-[#A7F3D0] rounded-lg"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-[#94A3B8] italic">
                      No candidate skills found
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};