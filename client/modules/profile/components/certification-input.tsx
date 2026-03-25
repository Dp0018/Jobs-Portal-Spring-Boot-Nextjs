"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fields } from "../Data/PostJob";
import { SelectInput } from "./select-input";
import { changeProfile } from "@/modules/landing/server/profile-slice";
import { successNotification } from "@/modules/notifications/server/notification-service";

const toMonthValue = (date: Date | string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export const CertificationInput = (props: any) => {
  const dispatch = useDispatch();
  const select = fields;
  const profile = useSelector((state: any) => state.profile);

  const [form, setForm] = useState({
    name: "",
    issuer: "",
    issueDate: toMonthValue(new Date()),
    certificateId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (name: string, value: any) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name) e.name = "Name is required";
    if (!form.issuer) e.issuer = "Issuer is required";
    if (!form.issueDate) e.issueDate = "Issue date is required";
    if (!form.certificateId) e.certificateId = "Certificate ID is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const certi = [...profile.certifications];
    certi.push({
      ...form,
      issueDate: new Date(`${form.issueDate}-01`).toISOString(),
    });
    props.setEdit(false);
    dispatch(changeProfile({ ...profile, certifications: certi }));
    successNotification("Success", "Certificate added successfully!");
  };

  return (
    <div className="bg-sky-50/60 border border-sky-200 rounded-2xl p-6 space-y-5">
      <h3 className="text-sm font-semibold text-sky-800 uppercase tracking-wider">
        Add Certificate
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-stone-600 text-sm font-medium">
              Certificate Title <span className="text-sky-600">*</span>
            </Label>
            <Input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Enter certificate name"
              className="bg-white border-stone-200 focus-visible:ring-sky-300 focus-visible:border-sky-400 placeholder:text-stone-400 text-stone-700"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>
          <SelectInput
            form={{
              getInputProps: () => ({
                value: form.issuer,
                onChange: (v: any) => setField("issuer", v),
              }),
            }}
            name="issuer"
            {...select[1]}
            error={errors.issuer}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-stone-600 text-sm font-medium">
              Issue Date <span className="text-sky-600">*</span>
            </Label>
            <Input
              type="month"
              value={form.issueDate}
              max={toMonthValue(new Date())}
              onChange={(e) => setField("issueDate", e.target.value)}
              className="bg-white border-stone-200 focus-visible:ring-sky-300 focus-visible:border-sky-400 text-stone-700"
            />
            {errors.issueDate && (
              <p className="text-xs text-red-500">{errors.issueDate}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-stone-600 text-sm font-medium">
              Certificate ID <span className="text-sky-600">*</span>
            </Label>
            <Input
              value={form.certificateId}
              onChange={(e) => setField("certificateId", e.target.value)}
              placeholder="Enter certificate ID"
              className="bg-white border-stone-200 focus-visible:ring-sky-300 focus-visible:border-sky-400 placeholder:text-stone-400 text-stone-700"
            />
            {errors.certificateId && (
              <p className="text-xs text-red-500">{errors.certificateId}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            onClick={handleSave}
            size="sm"
            className="bg-sky-500 hover:bg-sky-600 text-white border-0 rounded-lg px-5"
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