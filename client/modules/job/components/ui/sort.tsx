"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { IconAdjustments, IconCheck } from "@tabler/icons-react";
import { ChevronDown } from "lucide-react";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { updateSort } from "@/modules/redux/sort-slice";

const jobSortOptions = [
  "relevance",
  "most recent",
  "salary (low-high)",
  "salary (high-low)",
];

const talentSortOptions = [
  "relevance",
  "experience: low to high",
  "experience: high to low",
];

export const Sort = (props: any) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("relevance");

  const sortOptions = props.sort === "job" ? jobSortOptions : talentSortOptions;

  const filtered = sortOptions.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase().trim()),
  );

  const handleSelect = (val: string) => {
    setSelected(val);
    dispatch(updateSort(val));
    setSearch("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 h-9 px-3.5 rounded-xl border text-sm font-medium transition-all duration-200",
            open
              ? "bg-white border-[#2563EB] text-[#2563EB] ring-2 ring-[#2563EB]/10"
              : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#2563EB]/40 hover:text-[#0F172A]",
          )}
        >
          <IconAdjustments
            className={cn(
              "w-4 h-4 transition-all duration-200",
              open ? "text-[#2563EB] rotate-90" : "text-[#94A3B8]",
            )}
            stroke={1.8}
          />
          <span className="capitalize hidden sm:inline">{selected}</span>
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 transition-transform duration-200",
              open ? "rotate-180 text-[#2563EB]" : "text-[#CBD5E1]",
            )}
            strokeWidth={2}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={6}
        className="p-0 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-lg overflow-hidden"
      >
        <Command className="bg-transparent">
          <div className="border-b border-[#F1F5F9]">
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder="Search options…"
              className="h-9 bg-[#F8FAFC] text-[#0F172A] placeholder:text-[#CBD5E1] text-sm"
            />
          </div>

          <CommandList className="max-h-[200px] py-1.5">
            <CommandEmpty className="py-6 text-center text-xs text-[#94A3B8]">
              No options found
            </CommandEmpty>

            <CommandGroup>
              {filtered.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center justify-between mx-1.5 px-2.5 py-2 rounded-lg cursor-pointer text-xs capitalize text-[#0F172A] hover:bg-[#F8FAFC] aria-selected:bg-[#F8FAFC] transition-colors"
                >
                  <span>{item}</span>
                  {selected === item && (
                    <IconCheck
                      size={13}
                      className="text-[#2563EB] shrink-0"
                      stroke={2.5}
                    />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};