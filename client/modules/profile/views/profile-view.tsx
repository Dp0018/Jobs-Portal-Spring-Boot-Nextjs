"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconEdit } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { getBase64 } from "@/lib/get-base64";
import { successNotification } from "@/modules/notifications/server/notification-service";
import { Info } from "../components/info";
import { About } from "../components/about";
import { Skills } from "../components/skills";
import { changeProfile } from "@/modules/landing/server/profile-slice";
import { Experience } from "../components/experience";
import { Certificate } from "../components/certificate";
import { ResumeSection } from "../components/resume-section";

/* ─── Accent colour map for left-border stripe ──────────────── */
const accentMap: Record<string, string> = {
  amber:  "before:bg-amber-400",
  orange: "before:bg-orange-500",
  rose:   "before:bg-rose-400",
  sky:    "before:bg-sky-400",
};

const ProfileCard = ({
  children,
  accent = "amber",
}: {
  children: React.ReactNode;
  accent?: string;
}) => (
  <div
    className={`
      relative bg-white rounded-3xl px-8 py-7
      shadow-[0_2px_20px_rgba(0,0,0,0.055)]
      border border-stone-100
      before:absolute before:left-0 before:top-6 before:bottom-6
      before:w-[3px] before:rounded-r-full
      ${accentMap[accent] ?? accentMap.amber}
      overflow-hidden transition-shadow duration-300
      hover:shadow-[0_4px_32px_rgba(0,0,0,0.09)]
    `}
  >
    {children}
  </div>
);

/* ─── Main view ─────────────────────────────────────────────── */
export const ProfileView = (props: any) => {
  const dispatch = useDispatch();
  const userProfile = useSelector((state: any) => state.profile);
  const profile = props.id ? props : userProfile;
  const [fileInputKey, setFileInputKey] = useState(0);
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    if (!image) return;
    if (!profile?.id) {
      console.error("Profile ID is missing. Cannot update profile.");
      return;
    }
    try {
      const picture = (await getBase64(image)) as string;
      const updatedProfile = { ...profile, picture: picture.split(",")[1] };
      dispatch(changeProfile(updatedProfile));
      successNotification("success", "Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    } finally {
      setFileInputKey((prev) => prev + 1);
    }
  };

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-[#F5F4F0] py-10">
      <div className="w-full max-w-5xl mx-auto px-4 space-y-5">
        {/* ── Hero / Banner Card ─────────────────────────────────── */}
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-stone-100">
          {/* Banner */}
          <div className="relative h-48 overflow-hidden select-none">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50/70 to-rose-50" />

            {/* Dot matrix */}
            <div
              className="absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #a8a29e 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            />

            {/* Soft glow orbs */}
            <div
              className="absolute -top-8 right-16 w-64 h-64 rounded-full opacity-25"
              style={{
                background: "radial-gradient(circle, #fb923c, transparent 70%)",
              }}
            />
            <div
              className="absolute top-4 left-1/4 w-80 h-48 rounded-full opacity-15"
              style={{
                background: "radial-gradient(circle, #fbbf24, transparent 70%)",
              }}
            />

            {/* Grid lines */}
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.06]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="pg"
                  width="48"
                  height="48"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 48 0 L 0 0 0 48"
                    fill="none"
                    stroke="#78716c"
                    strokeWidth="0.6"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pg)" />
            </svg>

            {/* Bottom fade into white */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
          </div>

          {/* Avatar row */}
          <div className="px-8 -mt-16 pb-6 flex items-end gap-5">
            <div
              className="relative shrink-0 cursor-pointer"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={() => fileInputRef.current?.click()}
            >
              {/* White border frame */}
              <div className="p-[3px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.13)]">
                <Avatar className="w-28 h-28 rounded-[14px]">
                  <AvatarImage
                    src={
                      profile?.picture
                        ? `data:image/jpeg;base64,${profile.picture}`
                        : undefined
                    }
                    alt="profile img"
                    className="object-cover rounded-[14px]"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-amber-100 to-orange-200 text-amber-700 text-3xl font-bold rounded-[14px] w-full h-full">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {hovered && (
                  <div className="absolute inset-[3px] rounded-[14px] bg-black/55 flex items-center justify-center z-10 pointer-events-none">
                    <IconEdit className="w-7 h-7 text-white" />
                  </div>
                )}
              </div>
              <input
                key={fileInputKey}
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* right-side spacer — Info component fills the card below */}
            <div className="flex-1" />
          </div>

          {/* Info section */}
          <div className="px-8 pb-8 pt-0">
            <Info profile={profile} edit={!props.id} />
          </div>
        </div>

        {/* ── About ─────────────────────────────────────────────── */}
        <ProfileCard accent="amber">
          <About profile={profile} edit={!props.id} />
        </ProfileCard>

        {/* ── Skills ────────────────────────────────────────────── */}
        <ProfileCard accent="orange">
          <Skills profile={profile} edit={!props.id} />
        </ProfileCard>

        {/* ── Resume ────────────────────────────────────────────── */}
        <ProfileCard accent="rose">
          <ResumeSection profile={profile} edit={!props.id} />
        </ProfileCard>

        {/* ── Experience ────────────────────────────────────────── */}
        <ProfileCard accent="amber">
          <Experience profile={profile} edit={!props.id} />
        </ProfileCard>

        {/* ── Certificates ──────────────────────────────────────── */}
        <ProfileCard accent="sky">
          <Certificate profile={profile} edit={!props.id} />
        </ProfileCard>
      </div>
    </div>
  );
};