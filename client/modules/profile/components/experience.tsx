"use client";

import { Button } from "@/components/ui/button";
import { IconPencil, IconPlus, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { ExpInput } from "./exp-input";
import { ExpCard } from "./exp-card";

export const Experience = ({ profile, edit }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [addExp, setAddExp] = useState(false);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-stone-800 tracking-tight">
          Experience
        </h2>
        <div className="flex gap-1.5">
          {edit && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setAddExp(true)}
              className="h-8 px-3 gap-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-medium"
            >
              <IconPlus className="h-3.5 w-3.5" /> Add
            </Button>
          )}
          {edit && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing((v) => !v)}
              className={`h-8 px-3 gap-1.5 rounded-lg text-xs font-medium border ${
                isEditing
                  ? "text-red-600 bg-red-50 hover:bg-red-100 border-red-200"
                  : "text-stone-600 bg-stone-50 hover:bg-stone-100 border-stone-200"
              }`}
            >
              {isEditing ? (
                <>
                  <IconX className="h-3.5 w-3.5" /> Done
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

      {/* List */}
      <div className="space-y-3">
        {profile?.experiences?.map((expItem: any, id: number) => (
          <ExpCard key={id} idx={id} {...expItem} edit={isEditing} />
        ))}
        {addExp && <ExpInput setEdit={setAddExp} add />}
        {!profile?.experiences?.length && !addExp && (
          <div className="text-center py-10 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
            <p className="text-stone-400 text-sm">No experience added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};