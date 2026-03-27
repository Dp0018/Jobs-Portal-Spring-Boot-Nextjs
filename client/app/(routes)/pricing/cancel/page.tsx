"use client";

import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-500">
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-400 rounded-full blur-3xl opacity-10" />

        <div className="relative z-10">
          <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Checkout Cancelled
          </h1>

          <p className="text-slate-600 mb-8 leading-relaxed">
            Your payment was not completed. No charges were made to your account. You can try again whenever you're ready.
          </p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push('/pricing')}
              className="w-full h-12 text-base font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md"
            >
              Try Again
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full h-12 text-base font-semibold text-slate-600 border-slate-200 hover:bg-slate-50 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
