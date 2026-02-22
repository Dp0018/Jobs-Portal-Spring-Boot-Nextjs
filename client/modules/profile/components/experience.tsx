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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <span className="w-1 h-8 bg-linear-to-b from-primary to-destructive rounded-full" />
          Experience
        </h2>
        <div className="flex gap-2">
          {edit && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setAddExp(true)}
              className="h-9 w-9 text-green-400 hover:text-green-400 hover:bg-green-400/10 hover:scale-110 transition-all"
            >
              <IconPlus className="h-5 w-5" />
            </Button>
          )}
          {edit && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditing((v) => !v)}
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

      {/* Experience List */}
      <div className="space-y-4">
        {profile?.experiences?.map((expItem: any, id: number) => (
          <ExpCard key={id} idx={id} {...expItem} edit={isEditing} />
        ))}
        {addExp && <ExpInput setEdit={setAddExp} add />}
        {!profile?.experiences?.length && !addExp && (
          <div className="text-center py-12 bg-muted/20 rounded-xl border border-border/20">
            <p className="text-muted-foreground text-sm">No experience added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
