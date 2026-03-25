"use client";

import { useState, useEffect, useRef } from "react";
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
import { IconSelector, IconX, IconCheck } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { updateFilter } from "@/modules/redux/filter-slice";

interface MultiInputProps {
  title: string;
  icon: React.ComponentType<any>;
  options: string[];
}

export const MultiInput: React.FC<MultiInputProps> = (props) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<string[]>(props.options || []);
  const [value, setValue] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const Icon = props.icon;

  useEffect(() => {
    setData(props.options);
  }, [props.options]);

  const lastDispatchedValue = useRef<string[]>([]);
  useEffect(() => {
    if (JSON.stringify(lastDispatchedValue.current) !== JSON.stringify(value)) {
      lastDispatchedValue.current = value;
      dispatch(updateFilter({ [props.title]: value }));
    }
  }, [value, props.title, dispatch]);

  const exactMatch = data.some(
    (item) => item.toLowerCase() === search.toLowerCase(),
  );

  const filtered = data.filter((item) =>
    item.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const toggle = (val: string) =>
    setValue((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
    );

  const remove = (val: string) =>
    setValue((prev) => prev.filter((v) => v !== val));

  const handleSelect = (val: string) => {
    if (val === "__create__") {
      const trimmed = search.trim();
      setData((prev) => [...prev, trimmed]);
      setValue((prev) => [...prev, trimmed]);
    } else {
      toggle(val);
    }
    setSearch("");
  };

  const firstSelected = value[0];
  const overflow = value.length - 1;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "group w-full h-10 flex items-center gap-2 px-3 rounded-xl border text-sm transition-all duration-200",
            open
              ? "bg-white border-[#2563EB] ring-2 ring-[#2563EB]/10"
              : "bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#2563EB]/40 hover:bg-white",
          )}
        >
          {/* Icon */}
          <div className="w-6 h-6 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0">
            <Icon className="w-3.5 h-3.5 text-[#2563EB]" stroke={1.8} />
          </div>

          {/* Pills / placeholder */}
          <div className="flex-1 flex items-center gap-1.5 min-w-0 text-left overflow-hidden">
            {value.length === 0 ? (
              <span className="text-[#CBD5E1] text-sm truncate">
                {props.title}
              </span>
            ) : (
              <>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg text-[#2563EB] text-[11px] font-semibold max-w-[90px] truncate">
                  <span className="truncate">{firstSelected}</span>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      remove(firstSelected);
                    }}
                    className="text-[#93C5FD] hover:text-[#2563EB] shrink-0 ml-0.5"
                  >
                    <IconX size={9} strokeWidth={2.5} />
                  </button>
                </span>
                {overflow > 0 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded-md text-[#94A3B8] text-[10px] font-semibold shrink-0">
                    +{overflow}
                  </span>
                )}
              </>
            )}
          </div>

          <IconSelector
            size={14}
            className={cn(
              "text-[#CBD5E1] shrink-0 transition-transform duration-200",
              open && "rotate-180 text-[#2563EB]",
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0 w-60 bg-white border border-[#E2E8F0] rounded-xl shadow-lg overflow-hidden"
        align="start"
        sideOffset={6}
      >
        <Command className="bg-transparent">
          {/* Search input */}
          <div className="border-b border-[#F1F5F9]">
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder={`Search ${props.title}…`}
              className="h-9 bg-[#F8FAFC] text-[#0F172A] placeholder:text-[#CBD5E1] text-sm"
            />
          </div>

          <CommandList className="max-h-[200px] py-1.5">
            <CommandEmpty className="py-6 text-center text-xs text-[#94A3B8]">
              {search.trim() ? "No match found." : `Search ${props.title}`}
            </CommandEmpty>

            <CommandGroup>
              {filtered.map((item) => {
                const checked = value.includes(item);
                return (
                  <CommandItem
                    key={item}
                    value={item}
                    onSelect={() => handleSelect(item)}
                    className="flex items-center gap-2.5 mx-1.5 px-2.5 py-2 rounded-lg cursor-pointer text-sm text-[#0F172A] hover:bg-[#F8FAFC] aria-selected:bg-[#F8FAFC] transition-colors"
                  >
                    {/* Checkbox */}
                    <div
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all",
                        checked
                          ? "bg-[#2563EB] border-[#2563EB]"
                          : "border-[#E2E8F0] bg-white",
                      )}
                    >
                      {checked && (
                        <IconCheck
                          size={10}
                          className="text-white"
                          stroke={3}
                        />
                      )}
                    </div>
                    <span className="truncate text-xs">{item}</span>
                  </CommandItem>
                );
              })}

              {/* Creatable option */}
              {!exactMatch && search.trim().length > 0 && (
                <CommandItem
                  value="__create__"
                  onSelect={() => handleSelect("__create__")}
                  className="mx-1.5 px-2.5 py-2 rounded-lg cursor-pointer text-xs text-[#2563EB] font-semibold hover:bg-[#EFF6FF] aria-selected:bg-[#EFF6FF] transition-colors"
                >
                  + Add &ldquo;{search.trim()}&rdquo;
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>

          {/* Footer */}
          {value.length > 0 && (
            <div className="border-t border-[#F1F5F9] px-3 py-2 flex items-center justify-between">
              <span className="text-[11px] text-[#94A3B8]">
                {value.length} selected
              </span>
              <button
                type="button"
                onClick={() => setValue([])}
                className="text-[11px] text-[#EF4444] hover:text-red-600 font-semibold transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};