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
    <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6 space-y-5">
      <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wider">
        {props.add ? "Add Experience" : "Edit Experience"}
      </h3>

      <div className="space-y-4">
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

        <div className="space-y-1.5">
          <Label className="text-stone-600 text-sm font-medium">
            Job Summary <span className="text-amber-600">*</span>
          </Label>
          <Textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Describe your role and achievements..."
            rows={3}
            className="bg-white border-stone-200 focus-visible:ring-amber-300 focus-visible:border-amber-400 placeholder:text-stone-400 text-stone-700 resize-none"
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-stone-600 text-sm font-medium">
              Start Date <span className="text-amber-600">*</span>
            </Label>
            <Input
              type="month"
              value={form.startDate}
              max={form.endDate || undefined}
              onChange={(e) => setField("startDate", e.target.value)}
              className="bg-white border-stone-200 focus-visible:ring-amber-300 focus-visible:border-amber-400 text-stone-700"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-stone-600 text-sm font-medium">
              End Date <span className="text-amber-600">*</span>
            </Label>
            <Input
              type="month"
              value={form.endDate}
              min={form.startDate || undefined}
              max={toMonthValue(new Date())}
              disabled={form.working}
              onChange={(e) => setField("endDate", e.target.value)}
              className="bg-white border-stone-200 focus-visible:ring-amber-300 focus-visible:border-amber-400 text-stone-700 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="working"
            checked={form.working}
            onCheckedChange={(checked) => setField("working", !!checked)}
            className="border-stone-300 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
          />
          <label
            htmlFor="working"
            className="text-stone-600 text-sm cursor-pointer select-none"
          >
            Currently working here
          </label>
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            onClick={handleSave}
            size="sm"
            className="bg-amber-500 hover:bg-amber-600 text-white border-0 rounded-lg px-5"
          >
            Save
          </Button>
          <Button
            onClick={() => props.setEdit(false)}
            variant="ghost"
            size="sm"
            className="text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};