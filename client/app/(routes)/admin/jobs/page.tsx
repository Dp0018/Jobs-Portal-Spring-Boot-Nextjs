"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Search,
  Trash2,
  FileText,
  MapPin,
  Users,
  Briefcase,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAllJobsAdmin,
  deleteJobAdmin,
} from "@/modules/admin/server/admin-service";
import {
  successNotification,
  errorNotification,
} from "@/modules/notifications/server/notification-service";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchJobs = () => {
    setLoading(true);
    getAllJobsAdmin()
      .then((res) => setJobs(res || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = (id: number, title: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${title}"? This cannot be undone.`,
      )
    )
      return;
    deleteJobAdmin(id)
      .then(() => {
        successNotification("Job Deleted", `"${title}" has been removed.`);
        fetchJobs();
      })
      .catch(() => errorNotification("Error", "Failed to delete job."));
  };

  const filtered = jobs.filter(
    (j) =>
      (j.jobTitle || "").toLowerCase().includes(search.toLowerCase()) ||
      (j.company || "").toLowerCase().includes(search.toLowerCase()),
  );

  const statusStyle = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-[#ECFDF5] text-emerald-700 border-[#A7F3D0]";
      case "CLOSED":
        return "bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]";
      case "DRAFT":
        return "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]";
      default:
        return "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            Platform Jobs
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            View and moderate all job postings on the platform.
          </p>
        </div>
        {!loading && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg shadow-sm text-xs font-semibold text-[#475569]">
            <Briefcase className="w-3.5 h-3.5 text-[#2563EB]" strokeWidth={2} />
            {jobs.length} total jobs
          </div>
        )}
      </div>

      {/* ── Search Bar ── */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]"
          strokeWidth={1.8}
        />
        <Input
          type="text"
          placeholder="Search by title or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-9 h-10 bg-white border-[#E2E8F0] rounded-xl text-sm placeholder:text-[#CBD5E1] focus-visible:ring-1 focus-visible:ring-[#2563EB] focus-visible:border-[#2563EB] text-[#0F172A]"
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

      {/* ── Table ── */}
      {loading ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <Skeleton className="h-3.5 w-64 bg-[#E2E8F0]" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="px-6 py-4 border-b border-[#F1F5F9] flex items-center gap-4"
            >
              <Skeleton className="h-4 w-36 bg-[#F1F5F9]" />
              <Skeleton className="h-4 w-28 bg-[#F1F5F9]" />
              <Skeleton className="h-4 w-24 bg-[#F1F5F9]" />
              <Skeleton className="h-4 w-12 bg-[#F1F5F9] ml-auto" />
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
          {/* Table header */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <th className="text-left px-5 py-3.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.07em] whitespace-nowrap">
                    Job Title
                  </th>
                  <th className="text-left px-5 py-3.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.07em] whitespace-nowrap">
                    Company
                  </th>
                  <th className="text-left px-5 py-3.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.07em] whitespace-nowrap">
                    Location
                  </th>
                  <th className="text-center px-5 py-3.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.07em] whitespace-nowrap">
                    Applicants
                  </th>
                  <th className="text-left px-5 py-3.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.07em] whitespace-nowrap">
                    Status
                  </th>
                  <th className="text-right px-5 py-3.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.07em] whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job, idx) => (
                  <tr
                    key={job.id}
                    className={`border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors group ${
                      idx === filtered.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-[#0F172A] text-sm">
                        {job.jobTitle}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#475569]">
                      {job.company}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 text-sm text-[#475569]">
                        <MapPin
                          className="w-3.5 h-3.5 text-[#94A3B8] shrink-0"
                          strokeWidth={1.8}
                        />
                        {job.location || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-[#0F172A]">
                        <Users
                          className="w-3.5 h-3.5 text-[#94A3B8]"
                          strokeWidth={1.8}
                        />
                        {job.applicants?.length || 0}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${statusStyle(job.jobStatus)}`}
                      >
                        {job.jobStatus || "ACTIVE"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(job.id, job.jobTitle)}
                        className="h-7 px-3 text-xs text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-5 py-3 border-t border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
            <span className="text-xs text-[#94A3B8]">
              Showing{" "}
              <span className="font-semibold text-[#475569]">
                {filtered.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#475569]">
                {jobs.length}
              </span>{" "}
              jobs
            </span>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs text-[#2563EB] font-medium hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mb-4">
            <FileText className="w-7 h-7 text-[#94A3B8]" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-bold text-[#0F172A] mb-1">
            No Jobs Found
          </h3>
          <p className="text-sm text-[#94A3B8]">
            {search
              ? `No jobs match "${search}".`
              : "No jobs have been posted on the platform yet."}
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-3 text-xs text-[#2563EB] font-medium hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
}
