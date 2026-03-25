"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { IconUser } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { updateFilter } from "@/modules/redux/filter-slice";
import { MultiInput } from "./multi-input";
import { searchFields } from "../data/find-talent";

const MIN_EXP = 0;
const MAX_EXP = 50;

export const SearchBar = () => {
  const dispatch = useDispatch();
  const [expRange, setExpRange] = useState<[number, number]>([0, MAX_EXP]);
  const [name, setName] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    dispatch(updateFilter({ name: e.target.value }));
  };

  const handleExpChange = (vals: number[]) => {
    const next: [number, number] = [vals[0], vals[1]];
    setExpRange(next);
    dispatch(updateFilter({ exp: next }));
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-5 mb-6">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-[#2563EB] rounded-full" />
          <span className="text-sm font-bold text-[#0F172A]">
            Filter Candidates
          </span>
        </div>
        <span className="text-xs text-[#94A3B8] font-medium">
          Adjust filters to narrow results
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* ── Name input ── */}
        <div className="relative group w-full h-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center px-3 hover:border-[#2563EB]/40 hover:bg-white focus-within:bg-white focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/10 transition-all">
          <div className="w-6 h-6 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0 transition-colors pointer-events-none z-10 mr-2">
            <IconUser className="w-3.5 h-3.5 text-[#2563EB]" stroke={1.8} />
          </div>
          <input
            type="text"
            placeholder="Search by name..."
            value={name}
            onChange={handleNameChange}
            className="flex-1 bg-transparent text-sm text-[#0F172A] placeholder:text-[#CBD5E1] outline-none min-w-0"
          />
        </div>

        {/* ── Dropdown multi-select filters ── */}
        {searchFields.map((item, index) => (
          <div key={index}>
            <MultiInput {...item} />
          </div>
        ))}

        {/* ── Experience Range Slider ── */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/10 transition-all">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-xs font-semibold text-[#475569]">
              Experience
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-[#EFF6FF] text-[#2563EB] rounded-lg border border-[#BFDBFE]">
              {expRange[0]}–
              {expRange[1] >= MAX_EXP ? `${MAX_EXP}+` : expRange[1]} yrs
            </span>
          </div>
          <Slider
            min={MIN_EXP}
            max={MAX_EXP}
            step={1}
            value={expRange}
            onValueChange={handleExpChange}
            className="[&_[role=slider]]:bg-[#2563EB] [&_[role=slider]]:border-[#2563EB] [&_.range]:bg-[#2563EB]"
          />
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-[#CBD5E1]">0 yr</span>
            <span className="text-[10px] text-[#CBD5E1]">50+ yr</span>
          </div>
        </div>
      </div>
    </div>
  );
};