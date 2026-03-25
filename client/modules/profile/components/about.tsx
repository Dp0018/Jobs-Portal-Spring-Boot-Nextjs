"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { changeProfile } from "@/modules/landing/server/profile-slice";
import { successNotification } from "@/modules/notifications/server/notification-service";
import { IconCheck, IconPencil, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

export const About = ({ profile, edit }: any) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState("");

  const handleEdit = () => {
    if (!isEditing) {
      setIsEditing(true);
      setAbout(profile?.about);
    } else {
      setIsEditing(false);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    dispatch(changeProfile({ ...profile, about }));
    successNotification("Success", "About updated Successfully");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-stone-800 tracking-tight">
          About
        </h2>
        <div className="flex gap-1.5">
          {isEditing && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSave}
              className="h-8 px-3 gap-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-medium"
            >
              <IconCheck className="h-3.5 w-3.5" /> Save
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

      {/* Content */}
      {isEditing ? (
        <Textarea
          value={about}
          onChange={(e) => setAbout(e.currentTarget.value)}
          placeholder="Tell us about yourself..."
          rows={5}
          className="bg-stone-50 border-stone-200 focus-visible:ring-amber-400 focus-visible:border-amber-400 placeholder:text-stone-400 text-stone-700 resize-none"
        />
      ) : (
        <p className="text-stone-600 text-[0.9375rem] leading-relaxed">
          {profile?.about || (
            <span className="text-stone-400 italic">
              No description added yet.
            </span>
          )}
        </p>
      )}
    </div>
  );
};