"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MultiInput } from "./multi-input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  IconCurrencyRupee,
  IconChevronDown,
  IconX,
  IconAdjustmentsHorizontal,
  IconCheck,
} from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { updateFilter } from "@/modules/redux/filter-slice";
import { dropdownData } from "../data/dropdownData";

const MIN_LPA = 0;
const MAX_LPA = 100;

/* ─────────────────────────────────────────────
   Salary dropdown rendered via React Portal so
   it escapes every stacking context and can never
   slide behind sibling sections regardless of
   z-index, overflow, or box-shadow on parents.
───────────────────────────────────────────── */

export const SearchBar = () => {
  /* ── Logic completely untouched ── */
  const dispatch = useDispatch();
  const [range, setRange] = useState<[number, number]>([MIN_LPA, MAX_LPA]);
  const [salaryOpen, setSalaryOpen] = useState(false);

  const handleRangeChange = (vals: number[]) => {
    const next: [number, number] = [vals[0], vals[1]];
    setRange(next);
    dispatch(updateFilter({ packageOffered: next }));
  };
  /* ──────────────────────────────── */

  /* Portal anchor — tracks trigger button position */
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 288,
  });
  const [mounted, setMounted] = useState(false);

  /* Only run on client */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* Recalculate position whenever the dropdown opens */
  useEffect(() => {
    if (!salaryOpen || !triggerRef.current) return;

    const update = () => {
      const rect = triggerRef.current!.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 8,
        left: Math.max(8, rect.right - 288 + window.scrollX),
        width: 288,
      });
    };

    update();
    /* Close on scroll — dropdown should not trail the page */
    const close = () => setSalaryOpen(false);
    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("scroll", close, { passive: true, capture: true });
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", close, true);
    };
  }, [salaryOpen]);

  const isRangeActive = range[0] !== MIN_LPA || range[1] !== MAX_LPA;

  return (
    <div className="relative">
      {/* ── Filter label ── */}
      <div className="flex items-center gap-2 mb-3">
        <IconAdjustmentsHorizontal size={15} className="text-[#64748B]" />
        <span className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
          Filter results
        </span>
        {isRangeActive && (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-full">
            <span className="text-[10px] text-primary font-bold">
              1 active filter
            </span>
          </div>
        )}
      </div>

      {/* ── Main filter bar ── */}
      <div
        className="bg-white border border-[#E2E8F0] rounded-2xl overflow-visible"
        style={{
          boxShadow:
            "0 1px 4px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)",
        }}
      >
        {/* ── Top accent line ── */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-t-2xl" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0 p-2">
          {/* ── Dropdown filters ── */}
          {dropdownData.map((item, index) => (
            <div key={index} className="relative flex items-stretch">
              {/* Vertical divider between columns */}
              {index > 0 && (
                <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 bg-[#E2E8F0]" />
              )}
              <div className="flex-1 px-1">
                <MultiInput {...item} />
              </div>
            </div>
          ))}

          {/* ── Salary range column ── */}
          <div className="relative flex items-stretch">
            <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 bg-[#E2E8F0]" />

            <div className="flex-1 px-1">
              {/* Trigger row */}
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setSalaryOpen((v) => !v)}
                className={`group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                  salaryOpen || isRangeActive
                    ? "bg-primary/8 border border-primary/20"
                    : "hover:bg-[#F8FAFC] border border-transparent"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isRangeActive
                      ? "bg-primary text-white"
                      : "bg-[#F1F5F9] text-[#64748B] group-hover:bg-primary/10 group-hover:text-primary"
                  }`}
                >
                  <IconCurrencyRupee size={15} />
                </div>

                {/* Label */}
                <div className="flex-1 text-left min-w-0">
                  <p className="text-[10px] text-[#94A3B8] leading-none mb-0.5 uppercase tracking-wider font-semibold">
                    Package (LPA)
                  </p>
                  <p
                    className={`text-sm font-semibold truncate ${
                      isRangeActive ? "text-primary" : "text-[#0F172A]"
                    }`}
                  >
                    {isRangeActive
                      ? `${range[0]} – ${range[1] >= MAX_LPA ? `${MAX_LPA}+` : range[1]} LPA`
                      : "Any salary"}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {isRangeActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRange([MIN_LPA, MAX_LPA]);
                        dispatch(
                          updateFilter({ packageOffered: [MIN_LPA, MAX_LPA] }),
                        );
                      }}
                      className="w-4 h-4 rounded-full bg-[#94A3B8] flex items-center justify-center hover:bg-primary transition-colors"
                    >
                      <IconX size={10} className="text-white" />
                    </button>
                  )}
                  <IconChevronDown
                    size={14}
                    className={`text-[#94A3B8] transition-transform duration-200 ${
                      salaryOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* ── Salary dropdown via React Portal ──
                  Renders at document.body level so it is
                  completely outside any stacking context.
                  position:fixed + getBoundingClientRect()
                  pins it directly below the trigger button. */}
              {salaryOpen &&
                mounted &&
                createPortal(
                  <>
                    {/* Full-screen backdrop — click to close */}
                    <div
                      className="fixed inset-0"
                      style={{ zIndex: 9998 }}
                      onClick={() => setSalaryOpen(false)}
                    />

                    {/* Dropdown panel */}
                    <div
                      className="fixed bg-white border border-[#E2E8F0] rounded-2xl p-5"
                      style={{
                        zIndex: 9999,
                        top: dropdownPos.top,
                        left: dropdownPos.left,
                        width: dropdownPos.width,
                        boxShadow:
                          "0 8px 30px rgba(15,23,42,0.14), 0 2px 8px rgba(15,23,42,0.08)",
                      }}
                    >
                      {/* Panel header */}
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <p className="text-sm font-bold text-[#0F172A]">
                            Salary Range
                          </p>
                          <p className="text-xs text-[#64748B] mt-0.5">
                            Annual CTC in Lakhs Per Annum
                          </p>
                        </div>
                        <button
                          onClick={() => setSalaryOpen(false)}
                          className="w-6 h-6 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
                        >
                          <IconX size={13} />
                        </button>
                      </div>

                      {/* Current value pills */}
                      <div className="flex items-center gap-2 mb-5">
                        <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary/8 border border-primary/20 rounded-xl">
                          <IconCurrencyRupee
                            size={14}
                            className="text-primary"
                          />
                          <span className="text-sm font-bold text-primary">
                            {range[0]}
                          </span>
                          <span className="text-xs text-primary/60">LPA</span>
                        </div>
                        <div className="h-px w-4 bg-[#CBD5E1] shrink-0" />
                        <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary/8 border border-primary/20 rounded-xl">
                          <IconCurrencyRupee
                            size={14}
                            className="text-primary"
                          />
                          <span className="text-sm font-bold text-primary">
                            {range[1] >= MAX_LPA ? `${MAX_LPA}+` : range[1]}
                          </span>
                          <span className="text-xs text-primary/60">LPA</span>
                        </div>
                      </div>

                      {/* Slider */}
                      <div className="px-1 mb-5">
                        <Slider
                          min={MIN_LPA}
                          max={MAX_LPA}
                          step={1}
                          value={range}
                          onValueChange={handleRangeChange}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-[10px] text-[#94A3B8] font-medium">
                          <span>₹0 LPA</span>
                          <span>₹100+ LPA</span>
                        </div>
                      </div>

                      {/* Quick preset chips */}
                      <div className="mb-4">
                        <p className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wider mb-2">
                          Quick select
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            {
                              label: "0–5 LPA",
                              val: [0, 5] as [number, number],
                            },
                            {
                              label: "5–15 LPA",
                              val: [5, 15] as [number, number],
                            },
                            {
                              label: "15–30 LPA",
                              val: [15, 30] as [number, number],
                            },
                            {
                              label: "30+ LPA",
                              val: [30, 100] as [number, number],
                            },
                          ].map(({ label, val }) => {
                            const isSelected =
                              range[0] === val[0] && range[1] === val[1];
                            return (
                              <button
                                key={label}
                                onClick={() => handleRangeChange(val)}
                                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                  isSelected
                                    ? "bg-primary text-white border-primary shadow-sm"
                                    : "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:border-primary/30 hover:text-primary"
                                }`}
                              >
                                {isSelected && <IconCheck size={10} />}
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <Separator className="bg-[#F1F5F9] mb-4" />

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={!isRangeActive}
                          onClick={() => {
                            setRange([MIN_LPA, MAX_LPA]);
                            dispatch(
                              updateFilter({
                                packageOffered: [MIN_LPA, MAX_LPA],
                              }),
                            );
                          }}
                          className="flex-1 py-2 text-xs text-[#64748B] hover:text-[#0F172A] font-semibold border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          onClick={() => setSalaryOpen(false)}
                          className="flex-1 py-2 text-xs text-white font-semibold bg-primary hover:bg-primary/90 rounded-xl transition-colors shadow-sm"
                        >
                          Apply filter
                        </button>
                      </div>
                    </div>
                  </>,
                  document.body,
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
