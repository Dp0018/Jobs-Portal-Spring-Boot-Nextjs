"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/modules/auth/server/user-slice";
import axios from "axios";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);

  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setVerifying(false);
      return;
    }
    if (!verified) {
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/verify`, { sessionId })
        .then(() => {
          setVerified(true);
          setVerifying(false);
          if (user && user.subscriptionPlan !== "PREMIUM") {
            const updatedUser = { ...user, subscriptionPlan: "PREMIUM" };
            dispatch(setUser(updatedUser));
          }
        })
        .catch((err) => {
          console.error("Verification failed", err);
          setVerifying(false);
        });
    }
  }, [sessionId, verified, user, dispatch]);

  if (verifying) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-600 font-medium animate-pulse">Verifying your secure payment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-500">
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100 relative overflow-hidden">
        {/* Confetti / background effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-400 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-400 rounded-full blur-3xl opacity-20" />

        <div className="relative z-10">
          <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Payment Successful!
          </h1>

          <p className="text-slate-600 mb-8 leading-relaxed">
            Thank you for upgrading. Your premium features have been unlocked. Jump right back in and explore everything the platform has to offer!
          </p>

          <Button
            onClick={() => router.push('/')}
            className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/20 group"
          >
            Go to Home
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PricingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
