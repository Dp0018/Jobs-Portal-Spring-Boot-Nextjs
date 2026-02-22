"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { changeProfile } from "@/modules/landing/server/profile-slice";
import { successNotification } from "@/modules/notifications/server/notification-service";
import { IconCheck, IconPencil, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <span className="w-1 h-8 bg-linear-to-b from-primary to-primary/50 rounded-full" />
          About
        </h2>
        <div className="flex gap-2">
          {isEditing && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSave}
              className="h-9 w-9 text-green-400 hover:text-green-400 hover:bg-green-400/10 hover:scale-110 transition-all"
            >
              <IconCheck className="h-5 w-5" />
            </Button>
          )}
          {edit && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleEdit}
              className={`h-9 w-9 hover:scale-110 transition-all ${
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

      {/* Content */}
      {isEditing ? (
        <Textarea
          value={about}
          onChange={(e) => setAbout(e.currentTarget.value)}
          placeholder="Tell us about yourself..."
          rows={4}
          className="bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground text-foreground resize-none min-h-[120px]"
        />
      ) : (
        <div className="text-muted-foreground text-base leading-relaxed text-justify bg-muted/20 p-6 rounded-xl border border-border/20">
          {profile?.about || "No description added yet."}
        </div>
      )}
    </div>
  );
};
