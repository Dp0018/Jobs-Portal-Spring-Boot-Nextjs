"use client";

import { Button } from "@/components/ui/button";
import { changeProfile } from "@/modules/landing/server/profile-slice";
import { successNotification } from "@/modules/notifications/server/notification-service";
import { IconCheck, IconPencil, IconX } from "@tabler/icons-react";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";

export const Skills = ({ profile, edit }: any) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    if (!isEditing) {
      setIsEditing(true);
      setSkills(profile?.skills ?? []);
    } else {
      setIsEditing(false);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    dispatch(changeProfile({ ...profile, skills }));
    successNotification("Success", "Skills updated Successfully");
  };

  /* Tag input helpers — replicates Mantine TagsInput with splitChars=[',',' ','|'] */
  const addSkill = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === "|") {
      e.preventDefault();
      addSkill(inputValue);
    } else if (e.key === " ") {
      // split on space like Mantine does
      e.preventDefault();
      addSkill(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && skills.length > 0) {
      setSkills((prev) => prev.slice(0, -1));
    }
  };

  const removeSkill = (idx: number) =>
    setSkills((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <span className="w-1 h-8 bg-linear-to-b from-primary to-primary/50 rounded-full" />
          Skills
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

      {/* Tag Input — replaces Mantine TagsInput */}
      {isEditing ? (
        <div
          className="min-h-[48px] flex flex-wrap gap-2 p-3 rounded-lg bg-input/20 border border-border focus-within:ring-1 focus-within:ring-primary focus-within:border-primary cursor-text transition-all"
          onClick={() => inputRef.current?.focus()}
        >
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 border border-primary/30 text-primary text-sm rounded-lg"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(idx)}
                className="text-primary/60 hover:text-primary transition-colors"
              >
                <IconX size={12} />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => inputValue.trim() && addSkill(inputValue)}
            placeholder={skills.length === 0 ? "Add skill (Enter, comma or space)" : ""}
            className="flex-1 min-w-[180px] bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
      ) : (
        /* View mode */
        <div className="flex flex-wrap gap-3">
          {profile?.skills?.length > 0 ? (
            profile.skills.map((skill: string, id: number) => (
              <div
                key={id}
                className="group relative px-4 py-2 bg-linear-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-xl text-primary font-medium text-sm hover:from-primary/30 hover:to-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-default"
              >
                <span className="relative z-10">{skill}</span>
                <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))
          ) : (
            <div className="text-muted-foreground text-sm italic">
              No skills added yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
