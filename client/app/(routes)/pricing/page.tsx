"use client";

import { useState } from "react";
import { Check, Crown, Loader2, Sparkles, Zap, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/modules/subscription/server/subscription-service";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [role, setRole] = useState<"APPLICANT" | "EMPLOYER">("APPLICANT");
  const router = useRouter();

  const handleCheckout = async (priceId: string) => {
    try {
      setLoading(priceId);
      const successUrl = `${window.location.origin}/pricing/success`;
      const cancelUrl = `${window.location.origin}/pricing/cancel`;

      const data = await createCheckoutSession(priceId, successUrl, cancelUrl);
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Failed to get checkout URL");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong during checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const plans = {
    APPLICANT: {
      basic: {
        title: "Standard",
        desc: "Essential tools to get started",
        price: 0,
        features: ['Basic job search', 'Up to 5 applications/day', 'Standard profile visibility', 'Community support'],
      },
      pro: {
        title: "Pro Max",
        desc: "Everything you need to succeed",
        price: 119,
        features: ['Unlimited applications', 'Priority profile placement', 'Direct message recruiters', 'AI Resume optimization', 'Advanced analytics insights'],
        priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || "price_1TEv7XPOMd5gUG7Supoybt83"
      }
    },
    EMPLOYER: {
      basic: {
        title: "Free Tier",
        desc: "Basic hiring tools",
        price: 0,
        features: ['Post up to 3 jobs/month', 'Basic candidate search', 'Up to 5 AI resume scans/job', 'Standard company profile'],
      },
      pro: {
        title: "Recruiter Pro",
        desc: "Advanced hiring & AI tools",
        price: 449,
        features: ['Unlimited job postings', 'Unlimited AI Resume Scanning', 'Priority Job Placement', 'Advanced applicant analytics', 'Custom company branding'],
        priceId: process.env.NEXT_PUBLIC_STRIPE_EMPLOYER_PRICE_ID || "price_1TEv8FPOMd5gUG7SbXlk4XmZ"
      }
    }
  };

  const currentPlans = plans[role];

  return (
    <div className="min-h-screen bg-slate-50/50 py-20 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <Badge variant="outline" className="text-[#2563EB] bg-blue-50 border-blue-200 px-3 py-1 mb-2">
            Pricing Plans
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Unlock your full potential
          </h1>
          <p className="text-lg text-slate-600">
            Choose the perfect plan for your career or hiring needs. Experience premium tools designed to give you an edge in the competitive job market.
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex justify-center mb-16">
          <div className="bg-slate-200/60 p-1.5 rounded-2xl inline-flex gap-1 relative shadow-inner">
            <button
              onClick={() => setRole("APPLICANT")}
              className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                role === "APPLICANT" ? "text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <User className="w-4 h-4" />
              Job Seekers
            </button>
            <button
              onClick={() => setRole("EMPLOYER")}
              className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                role === "EMPLOYER" ? "text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Employers
            </button>

            {/* Sliding block */}
            <div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm border border-slate-100 transition-all duration-300 pointer-events-none`}
              style={{ transform: role === "EMPLOYER" ? "translateX(calc(100% + 4px))" : "translateX(0)" }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
          {/* Basic Plan */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-lg relative overflow-hidden flex flex-col h-[500px]">
            <div className="mb-8">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{currentPlans.basic.title}</h3>
              <p className="text-slate-500 mt-2 text-sm">{currentPlans.basic.desc}</p>
              <div className="mt-6 flex items-baseline text-5xl font-extrabold text-slate-900">
                £{currentPlans.basic.price}
                <span className="ml-1 text-xl font-medium text-slate-500">/mo</span>
              </div>
            </div>

            <ul className="space-y-4 flex-1">
              {currentPlans.basic.features.map((feature, i) => (
                <li key={i} className="flex items-center text-sm text-slate-600">
                  <Check className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              variant="outline"
              className="w-full mt-8 rounded-xl h-12 font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
              onClick={() => router.push(role === 'EMPLOYER' ? '/employer/jobs' : '/jobs')}
            >
              Get Started
            </Button>
          </div>

          {/* Premium Plan */}
          <div className="bg-slate-900 rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col h-[540px] border border-slate-800 scale-100 md:scale-105 z-10">
            {/* Background glowing effects */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl opacity-50" />

            <div className="absolute top-6 right-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                Most Popular
              </span>
            </div>

            <div className="mb-8 relative">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/5">
                <Crown className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">{currentPlans.pro.title}</h3>
              <p className="text-slate-400 mt-2 text-sm">{currentPlans.pro.desc}</p>
              <div className="mt-6 flex items-baseline text-5xl font-extrabold text-white">
                £{currentPlans.pro.price}
                <span className="ml-1 text-xl font-medium text-slate-400">/mo</span>
              </div>
            </div>

            <ul className="space-y-4 flex-1 relative">
              {currentPlans.pro.features.map((feature, i) => (
                <li key={i} className="flex items-center text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                    <Check className="w-3 h-3 text-blue-400" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              className="w-full mt-8 rounded-xl h-12 font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 relative overflow-hidden group"
              onClick={() => handleCheckout(currentPlans.pro.priceId)}
              disabled={loading === currentPlans.pro.priceId}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading === currentPlans.pro.priceId ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Upgrade to Pro"
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
