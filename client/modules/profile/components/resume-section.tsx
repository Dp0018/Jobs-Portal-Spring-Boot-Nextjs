"use client";

import { useState } from "react";
import { IconFileCv, IconTrash, IconUpload, IconFile } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { getBase64 } from "@/lib/get-base64";
import { uploadResume, deleteResume } from "../server/profile-service";
import { changeProfile } from "@/modules/landing/server/profile-slice";
import {
  successNotification,
  errorNotification,
} from "@/modules/notifications/server/notification-service";

interface ResumeItem {
  name: string;
  document: string;
  uploadedAt: string;
}

interface ResumeSectionProps {
  profile: any;
  edit: boolean;
}

export const ResumeSection = ({ profile, edit }: ResumeSectionProps) => {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const resumes: ResumeItem[] = profile?.resumes || [];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      errorNotification("Error", "Only PDF files are accepted.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      errorNotification("Error", "File size must be less than 5MB.");
      return;
    }
    if (resumes.length >= 5) {
      errorNotification("Error", "You can upload a maximum of 5 resumes.");
      return;
    }

    setUploading(true);
    try {
      const base64 = (await getBase64(file)) as string;
      const document = base64.split(",")[1];
      const resumeName = file.name.replace(/\.[^/.]+$/, "");

      const updatedProfile = await uploadResume(profile.id, {
        name: resumeName,
        document,
      });
      dispatch(changeProfile(updatedProfile));
      successNotification("Success", "Resume uploaded successfully.");
    } catch (err: any) {
      errorNotification(
        "Error",
        err.response?.data?.errorMessage || "Failed to upload resume.",
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (resumeName: string) => {
    setDeleting(resumeName);
    try {
      const updatedProfile = await deleteResume(profile.id, resumeName);
      dispatch(changeProfile(updatedProfile));
      successNotification("Success", "Resume deleted successfully.");
    } catch (err: any) {
      errorNotification(
        "Error",
        err.response?.data?.errorMessage || "Failed to delete resume.",
      );
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-stone-800 tracking-tight">
            Resumes
          </h2>
          <span className="px-2 py-0.5 bg-stone-100 border border-stone-200 text-stone-500 text-xs rounded-full font-medium">
            {resumes.length}/5
          </span>
        </div>

        {edit && resumes.length < 5 && (
          <label
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium border cursor-pointer transition-all ${
              uploading
                ? "bg-stone-50 border-stone-200 text-stone-400 cursor-not-allowed"
                : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
            }`}
          >
            {uploading ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-stone-300 border-t-stone-500 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <IconUpload size={14} />
                Upload PDF
              </>
            )}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {/* Empty state */}
      {resumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-center">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-stone-100 flex items-center justify-center mb-3">
            <IconFileCv size={24} className="text-stone-400" />
          </div>
          <p className="text-stone-500 text-sm font-medium">
            No resumes uploaded yet
          </p>
          {edit && (
            <p className="text-stone-400 text-xs mt-1">
              Upload your resume to use when applying for jobs
            </p>
          )}
        </div>
      ) : (
        /* Resume grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {resumes.map((resume) => (
            <div
              key={resume.name}
              className="group flex items-center gap-3 p-4 bg-stone-50 rounded-xl border border-stone-100 hover:border-rose-200 hover:bg-rose-50/30 transition-all duration-200"
            >
              {/* Icon */}
              <div className="shrink-0 w-10 h-10 bg-white rounded-lg shadow-sm border border-stone-100 flex items-center justify-center">
                <IconFile size={18} className="text-rose-500" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-700 truncate">
                  {resume.name}
                </p>
                {resume.uploadedAt && (
                  <p className="text-xs text-stone-400 mt-0.5">
                    {formatDate(resume.uploadedAt)}
                  </p>
                )}
              </div>

              {/* Delete */}
              {edit && (
                <button
                  onClick={() => handleDelete(resume.name)}
                  disabled={deleting === resume.name}
                  className="shrink-0 p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  {deleting === resume.name ? (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-red-200 border-t-red-500 animate-spin" />
                  ) : (
                    <IconTrash size={14} />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};