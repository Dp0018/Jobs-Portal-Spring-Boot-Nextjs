"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users } from "lucide-react";
import { IconMoodSad } from "@tabler/icons-react";
import { getAllProfiles } from "@/modules/profile/server/profile-service";
import { resetFilter } from "@/modules/redux/filter-slice";
import { Sort } from "./sort";
import { TalentCard } from "./talent-card";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => (
  <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-4">
    <div className="flex gap-3 items-center">
      <Skeleton className="w-11 h-11 rounded-full bg-[#F1F5F9]" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/5 bg-[#F1F5F9]" />
        <Skeleton className="h-3 w-2/5 bg-[#F1F5F9]" />
      </div>
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16 rounded-lg bg-[#F1F5F9]" />
      <Skeleton className="h-6 w-20 rounded-lg bg-[#F1F5F9]" />
      <Skeleton className="h-6 w-14 rounded-lg bg-[#F1F5F9]" />
    </div>
    <div className="space-y-1.5">
      <Skeleton className="h-3 w-full bg-[#F1F5F9]" />
      <Skeleton className="h-3 w-5/6 bg-[#F1F5F9]" />
      <Skeleton className="h-3 w-4/6 bg-[#F1F5F9]" />
    </div>
    <div className="h-px bg-[#F1F5F9]" />
    <div className="flex justify-between">
      <Skeleton className="h-4 w-20 bg-[#F1F5F9]" />
      <Skeleton className="h-4 w-24 bg-[#F1F5F9]" />
    </div>
    <div className="h-px bg-[#F1F5F9]" />
    <div className="flex gap-3">
      <Skeleton className="h-9 flex-1 rounded-xl bg-[#F1F5F9]" />
      <Skeleton className="h-9 flex-1 rounded-xl bg-[#F1F5F9]" />
    </div>
  </div>
);

export const Talents = () => {
  const dispatch = useDispatch();
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const filter = useSelector((state: any) => state.filter);
  const sort = useSelector((state: any) => state.sort);
  const [filteredTalent, setFilteredTalent] = useState<any[]>([]);

  useEffect(() => {
    dispatch(resetFilter());
    getAllProfiles()
      .then((res: any) => {
        setTalents(res);
        setLoading(false);
      })
      .catch((err: any) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = [...talents];
    const f = filter || {};

    if (f.name)
      result = result.filter((t) =>
        t.name?.toLowerCase().includes(f.name.toLowerCase()),
      );
    if (f["Job Title"]?.length)
      result = result.filter((t) =>
        f["Job Title"].some((title: string) =>
          t.jobTitle?.toLowerCase().includes(title.toLowerCase()),
        ),
      );
    if (f.Location?.length)
      result = result.filter((t) =>
        f.Location.some((loc: string) =>
          t.location?.toLowerCase().includes(loc.toLowerCase()),
        ),
      );
    if (f.Skills?.length)
      result = result.filter((t) =>
        f.Skills.some((skill: string) =>
          t.skills?.some((s: string) =>
            s.toLowerCase().includes(skill.toLowerCase()),
          ),
        ),
      );
    if (f.exp?.length === 2)
      result = result.filter(
        (t) => t.totalExp >= f.exp[0] && t.totalExp <= f.exp[1],
      );

    if (sort === "experience: low to high")
      result.sort((a, b) => a.totalExp - b.totalExp);
    else if (sort === "experience: high to low")
      result.sort((a, b) => b.totalExp - a.totalExp);

    setFilteredTalent(result);
  }, [filter, sort, talents]);

  return (
    <div className="pb-10">
      {/* ── Results header ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#EFF6FF] flex items-center justify-center">
            <Users className="w-3 h-3 text-[#2563EB]" strokeWidth={2} />
          </div>
          <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-[0.07em]">
            {loading
              ? "Loading…"
              : `${filteredTalent.length} talent${filteredTalent.length !== 1 ? "s" : ""} found`}
          </span>
        </div>
        <Sort sort="talent" />
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredTalent.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTalent.map((talent: any, idx: number) => (
            <TalentCard key={idx} {...talent} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mb-4">
            <IconMoodSad className="w-7 h-7 text-[#94A3B8]" stroke={1.5} />
          </div>
          <h3 className="text-base font-bold text-[#0F172A] mb-1">
            No Talents Found
          </h3>
          <p className="text-sm text-[#94A3B8] text-center max-w-xs leading-relaxed">
            We couldn't find any talents matching your criteria. Try adjusting
            your filters.
          </p>
        </div>
      )}
    </div>
  );
};