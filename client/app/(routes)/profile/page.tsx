"use client";

import { ProfileView } from "@/modules/profile/views/profile-view";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const user = useSelector((state: any) => state.user);
  const profile = useSelector((state: any) => state.profile);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push("/");
    }
  }, [mounted, user, router]);

  // Prevents SSR Hydration Mismatches by showing a loading screen matching the server template
  if (!mounted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  // Show a sleek loading animation while fetching the profile from the server
  if (!profile?.id) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-xl bg-primary/30 animate-pulse" />
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin relative z-10"></div>
        </div>
        <p className="text-muted-foreground font-medium animate-pulse tracking-wide">
          Loading your profile...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-[0.98] duration-700">
      <ProfileView />
    </div>
  );
};

export default Page;