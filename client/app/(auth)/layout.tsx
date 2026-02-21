"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RootState } from "@/modules/redux/store";
import { getItem } from "@/modules/redux/local-storage-service";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const storedUser = getItem("user");
    if (user || storedUser) {
      router.replace("/");
    } else {
      setIsChecking(false);
    }
  }, [user, router]);

  if (isChecking || user) {
    return null;
  }

  return <>{children}</>;
}
