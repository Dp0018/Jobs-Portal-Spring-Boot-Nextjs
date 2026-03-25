"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/modules/profile/server/profile-service";
import { ProfileView } from "@/modules/profile/views/profile-view";
import { IconLoader2 } from "@tabler/icons-react";

interface TalentProfileViewProps {
  profileId: string;
}

const TalentProfileView = ({ profileId }: TalentProfileViewProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileId) return;

    setLoading(true);
    getProfile(profileId)
      .then((res: any) => {
        setProfile(res);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("Error fetching talent profile:", err);
        setError("Failed to load talent profile");
        setLoading(false);
      });
  }, [profileId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F4F0] flex flex-col items-center justify-center space-y-4">
        <IconLoader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-stone-500 font-medium animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#F5F4F0] flex items-center justify-center">
        <p className="text-red-500 font-medium">{error || "Profile not found"}</p>
      </div>
    );
  }

  // Pass the fetched profile data to ProfileView.
  // ProfileView checks `props.id` to determine if it's viewing someone else's profile,
  // preventing it from showing edit buttons or using the Redux userProfile fallback.
  return <ProfileView {...profile} id={profileId} />;
};

export default TalentProfileView;
