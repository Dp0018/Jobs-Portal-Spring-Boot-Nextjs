"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IconBriefcase,
  IconBuilding,
  IconCheck,
  IconMapPin,
  IconPencil,
  IconX,
} from "@tabler/icons-react";
import { Crown } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fields } from "../Data/PostJob";
import { SelectInput } from "./select-input";
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
      {/* Name + action buttons */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 leading-tight flex items-center gap-3">
            {profile?.name}
            {profile?.subscriptionPlan && profile.subscriptionPlan !== "FREE" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-linear-to-r from-yellow-300 to-amber-500 text-amber-950 text-xs font-black rounded-lg shadow-sm">
                <Crown className="w-4 h-4" />
                PRO
              </span>
            )}
          </h1>
        </div>

        <div className="flex gap-1.5 shrink-0 mt-1">
          {isEditing && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSave}
              className="h-8 px-3 gap-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-medium"
            >
              <IconCheck className="h-3.5 w-3.5" />
              Save
            </Button>
          )}
          {edit && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEdit}
              className={`h-8 px-3 gap-1.5 rounded-lg text-xs font-medium border ${
                isEditing
                  ? "text-red-600 bg-red-50 hover:bg-red-100 border-red-200"
                  : "text-stone-600 bg-stone-50 hover:bg-stone-100 border-stone-200"
              }`}
            >
              {isEditing ? (
                <>
                  <IconX className="h-3.5 w-3.5" /> Cancel
                </>
              ) : (
                <>
                  <IconPencil className="h-3.5 w-3.5" /> Edit
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Edit mode */}
      {isEditing ? (
        <div className="space-y-4 pt-2">
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
            <div className="space-y-1.5">
              <Label className="text-stone-600 text-sm font-medium">
                Years of Experience
              </Label>
              <Input
                type="number"
                min={0}
                max={50}
                value={form.totalExp}
                onChange={(e) => setField("totalExp", Number(e.target.value))}
                placeholder="Enter experience in years"
                className="bg-stone-50 border-stone-200 focus-visible:ring-amber-400 focus-visible:border-amber-400 text-stone-800 placeholder:text-stone-400"
              />
            </div>
          </div>
        </div>
      ) : (
        /* View mode */
        <div className="flex flex-wrap gap-3 pt-1">
          {/* Job title pill */}
          {profile?.jobTitle && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium rounded-full">
              <IconBriefcase className="w-3.5 h-3.5" />
              {profile.jobTitle}
            </span>
          )}
          {/* Company pill */}
          {profile?.company && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 border border-stone-200 text-stone-700 text-sm font-medium rounded-full">
              <IconBuilding className="w-3.5 h-3.5" />
              {profile.company}
            </span>
          )}
          {/* Experience pill */}
          {profile?.totalExp !== undefined && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-800 text-sm font-medium rounded-full">
              {profile.totalExp} yr{profile.totalExp !== 1 ? "s" : ""} exp
            </span>
          )}
          {/* Location pill */}
          {profile?.location && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium rounded-full">
              <IconMapPin className="w-3.5 h-3.5" />
              {profile.location}
            </span>
          )}
        </div>
      )}
    </div>
  );
};