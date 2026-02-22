"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeProfile } from "@/modules/landing/server/profile-slice";
import { successNotification } from "@/modules/notifications/server/notification-service";
import { fields } from "../Data/PostJob";
import { SelectInput } from "./select-input";

/* Helpers to convert between ISO date string and <input type="month"> value (YYYY-MM) */
const toMonthValue = (date: Date | string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
const fromMonthValue = (val: string) => new Date(`${val}-01`).toISOString();

export const ExpInput = (props: any) => {
  const dispatch = useDispatch();
  const select = fields;
  const profile = useSelector((state: any) => state.profile);

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    startDate: toMonthValue(new Date()),
    endDate: toMonthValue(new Date()),
    working: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!props.add) {
      setForm({
        title: props.title ?? "",
        company: props.company ?? "",
        location: props.location ?? "",
        description: props.description ?? "",
        startDate: toMonthValue(props.startDate ?? new Date()),
        endDate: toMonthValue(props.endDate ?? new Date()),
        working: props.working ?? false,
      });
    }
  }, []);

  const setField = (name: string, value: any) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title) e.title = "Title is required";
    if (!form.company) e.company = "Company is required";
    if (!form.location) e.location = "Location is required";
    if (!form.description) e.description = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const exp = [...profile.experiences];
    const entry = {
      ...form,
      startDate: fromMonthValue(form.startDate),
      endDate: fromMonthValue(form.endDate),
    };
    if (props.add) exp.push(entry);
    else exp[props.idx] = entry;
    props.setEdit(false);
    dispatch(changeProfile({ ...profile, experiences: exp }));
    successNotification(
      "Success",
      `Experience ${props.add ? "added" : "updated"} successfully`,
    );
  };

  return (
    <div className="bg-muted/20 backdrop-blur-sm border border-primary/30 rounded-xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="w-1 h-6 bg-linear-to-b from-primary to-destructive rounded-full" />
        <h3 className="text-xl font-bold text-foreground">
          {props.add ? "Add" : "Edit"} Experience
        </h3>
      </div>

      <div className="space-y-4">
        {/* Title & Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput
            form={{
              getInputProps: () => ({
                value: form.title,
                onChange: (v: any) => setField("title", v),
              }),
            }}
            name="title"
            {...select[0]}
            error={errors.title}
          />
          <SelectInput
            form={{
              getInputProps: () => ({
                value: form.company,
                onChange: (v: any) => setField("company", v),
              }),
            }}
            name="company"
            {...select[1]}
            error={errors.company}
          />
        </div>

        {/* Location */}
        <SelectInput
          form={{
            getInputProps: () => ({
              value: form.location,
              onChange: (v: any) => setField("location", v),
            }),
          }}
          name="location"
          {...select[2]}
          error={errors.location}
        />

        {/* Description — replaces Mantine Textarea */}
        <div className="space-y-1.5">
          <Label className="text-foreground/80 font-medium">
            Job Summary <span className="text-primary">*</span>
          </Label>
          <Textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Describe your role and achievements..."
            rows={3}
            className="bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground text-foreground resize-none"
          />
          {errors.description && (
            <p className="text-xs text-destructive">{errors.description}</p>
          )}
        </div>

        {/* Dates — replaces Mantine MonthPickerInput */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-foreground/80 font-medium">
              Start Date <span className="text-primary">*</span>
            </Label>
            <Input
              type="month"
              value={form.startDate}
              max={form.endDate || undefined}
              onChange={(e) => setField("startDate", e.target.value)}
              className="bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary text-foreground"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-foreground/80 font-medium">
              End Date <span className="text-primary">*</span>
            </Label>
            <Input
              type="month"
              value={form.endDate}
              min={form.startDate || undefined}
              max={toMonthValue(new Date())}
              disabled={form.working}
              onChange={(e) => setField("endDate", e.target.value)}
              className="bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary text-foreground disabled:opacity-50"
            />
          </div>
        </div>

        {/* Currently Working — replaces Mantine Checkbox */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="working"
            checked={form.working}
            onCheckedChange={(checked) => setField("working", !!checked)}
            className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <label
            htmlFor="working"
            className="text-muted-foreground text-sm cursor-pointer select-none"
          >
            Currently working here
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white hover:scale-105 transition-all"
          >
            Save
          </Button>
          <Button
            onClick={() => props.setEdit(false)}
            variant="ghost"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 hover:scale-105 transition-all"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
