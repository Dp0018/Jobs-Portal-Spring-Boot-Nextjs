"use client";

import { Talents } from "../ui/talent";
import { SearchBar } from "../ui/talent-search-bar";
import { Users } from "lucide-react";

export const FindTalentsView = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Page Header ── */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
              <Users className="w-4.5 h-4.5 text-[#2563EB]" strokeWidth={1.8} />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              Find Talent
            </h1>
          </div>
          <p className="text-sm text-[#475569] ml-12">
            Discover top professionals and connect with the best candidates.
          </p>
        </div>

        {/* ── Search / Filter Bar ── */}
        <SearchBar />

        {/* ── Results ── */}
        <Talents />
      </div>
    </div>
  );
};
