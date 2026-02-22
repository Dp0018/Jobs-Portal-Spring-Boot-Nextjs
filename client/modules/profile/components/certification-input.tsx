"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fields } from "../Data/PostJob";
import {SelectInput} from "./select-input";
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
    <div className="bg-muted/20 backdrop-blur-sm border border-primary/30 rounded-xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="w-1 h-6 bg-linear-to-b from-primary to-primary/50 rounded-full" />
        <h3 className="text-xl font-bold text-foreground capitalize">Add Certificate</h3>
      </div>

      <div className="space-y-4">
        {/* Title & Issuer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Replaces Mantine TextInput */}
          <div className="space-y-1.5">
            <Label className="text-foreground/80 font-medium">
              Certificate Title <span className="text-primary">*</span>
            </Label>
            <Input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Enter certificate name"
              className="bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground text-foreground"
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <SelectInput
            form={{ getInputProps: () => ({ value: form.issuer, onChange: (v: any) => setField("issuer", v) }) }}
            name="issuer"
            {...select[1]}
            error={errors.issuer}
          />
        </div>

        {/* Issue Date & Certificate ID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Replaces Mantine MonthPickerInput */}
          <div className="space-y-1.5">
            <Label className="text-foreground/80 font-medium">
              Issue Date <span className="text-primary">*</span>
            </Label>
            <Input
              type="month"
              value={form.issueDate}
              max={toMonthValue(new Date())}
              onChange={(e) => setField("issueDate", e.target.value)}
              className="bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary text-foreground"
            />
            {errors.issueDate && <p className="text-xs text-destructive">{errors.issueDate}</p>}
          </div>

          {/* Replaces Mantine TextInput */}
          <div className="space-y-1.5">
            <Label className="text-foreground/80 font-medium">
              Certificate ID <span className="text-primary">*</span>
            </Label>
            <Input
              value={form.certificateId}
              onChange={(e) => setField("certificateId", e.target.value)}
              placeholder="Enter certificate ID"
              className="bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground text-foreground"
            />
            {errors.certificateId && <p className="text-xs text-destructive">{errors.certificateId}</p>}
          </div>
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
