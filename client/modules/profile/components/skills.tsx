"use client";

import { Button } from "@/components/ui/button";
import { changeProfile } from "@/modules/landing/server/profile-slice";
import { successNotification } from "@/modules/notifications/server/notification-service";
import { IconCheck, IconPencil, IconX } from "@tabler/icons-react";
import { useRef, useState } from "react";
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
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      skills.length > 0
    ) {
      setSkills((prev) => prev.slice(0, -1));
    }
  };

  const removeSkill = (idx: number) =>
    setSkills((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-stone-800 tracking-tight">
          Skills
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

      {/* Tag Input */}
      {isEditing ? (
        <div
          className="min-h-[48px] flex flex-wrap gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200 focus-within:ring-2 focus-within:ring-amber-300 focus-within:border-amber-400 cursor-text transition-all"
          onClick={() => inputRef.current?.focus()}
        >
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-300 text-amber-800 text-sm rounded-lg font-medium"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(idx)}
                className="text-amber-500 hover:text-amber-700 transition-colors"
              >
                <IconX size={11} />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => inputValue.trim() && addSkill(inputValue)}
            placeholder={
              skills.length === 0
                ? "Add skills — press Enter or comma to add"
                : ""
            }
            className="flex-1 min-w-[200px] bg-transparent outline-none text-sm text-stone-700 placeholder:text-stone-400"
          />
        </div>
      ) : (
        /* View mode */
        <div className="flex flex-wrap gap-2">
          {profile?.skills?.length > 0 ? (
            profile.skills.map((skill: string, id: number) => (
              <span
                key={id}
                className="px-3.5 py-1.5 bg-stone-100 border border-stone-200 text-stone-700 text-sm font-medium rounded-lg hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800 transition-colors duration-200 cursor-default"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-stone-400 italic text-sm">
              No skills added yet.
            </span>
          )}
        </div>
      )}
    </div>
  );
};