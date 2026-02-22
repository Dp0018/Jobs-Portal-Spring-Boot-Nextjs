"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconBriefcase, IconCheck, IconMapPin, IconPencil, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fields } from "../Data/PostJob";
import {SelectInput} from "./select-input";
import { changeProfile } from "@/modules/landing/server/profile-slice";
import { successNotification } from "@/modules/notifications/server/notification-service";

export const Info = ({ profile, edit }: any) => {
  const select = fields;
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    jobTitle: "",
    company: "",
    location: "",
    totalExp: 0,
  });

  const setField = (name: string, value: any) =>
    setForm((f) => ({ ...f, [name]: value }));

  const handleEdit = () => {
    if (!isEditing) {
      setIsEditing(true);
      setForm({
        jobTitle: profile.jobTitle ?? "",
        company: profile.company ?? "",
        location: profile.location ?? "",
        totalExp: profile.totalExp ?? 0,
      });
    } else {
      setIsEditing(false);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    dispatch(changeProfile({ ...profile, ...form }));
    successNotification("Success", "Profile updated Successfully");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <h1 className="text-4xl font-bold text-foreground">{profile?.name}</h1>
        <div className="flex gap-2">
          {isEditing && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSave}
              className="h-10 w-10 text-green-400 hover:text-green-400 hover:bg-green-400/10 hover:scale-110 transition-all"
            >
              <IconCheck className="h-5 w-5" />
            </Button>
          )}
          {edit && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleEdit}
              className={`h-10 w-10 hover:scale-110 transition-all ${
                isEditing
                  ? "text-destructive hover:text-destructive hover:bg-destructive/10"
                  : "text-primary hover:text-primary hover:bg-primary/10"
              }`}
            >
              {isEditing ? <IconX className="h-5 w-5" /> : <IconPencil className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>

      {/* Edit Mode */}
      {isEditing ? (
        <div className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectInput
              form={{
                getInputProps: () => ({
                  value: form.jobTitle,
                  onChange: (v: any) => setField("jobTitle", v),
                }),
              }}
              name="jobTitle"
              {...select[0]}
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
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectInput
              form={{
                getInputProps: () => ({
                  value: form.location,
                  onChange: (v: any) => setField("location", v),
                }),
              }}
              name="location"
              {...select[2]}
            />
            {/* Replaces Mantine NumberInput */}
            <div className="space-y-1.5">
              <Label className="text-foreground/80 font-medium">Years of Experience</Label>
              <Input
                type="number"
                min={0}
                max={50}
                value={form.totalExp}
                onChange={(e) => setField("totalExp", Number(e.target.value))}
                placeholder="Enter experience in years"
                className="bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      ) : (
        /* View Mode */
        <div className="space-y-3 mt-6">
          {/* Job Title & Experience */}
          <div className="flex flex-wrap items-center gap-3 text-lg text-foreground">
            <div className="p-2 rounded-lg bg-primary/10">
              <IconBriefcase className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium">{profile?.jobTitle}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{profile?.totalExp} Year(s) Experience</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{profile?.company}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 text-lg text-foreground">
            <div className="p-2 rounded-lg bg-destructive/10">
              <IconMapPin className="w-5 h-5 text-destructive" />
            </div>
            <span className="text-muted-foreground">{profile?.location}</span>
          </div>
        </div>
      )}
    </div>
  );
};
