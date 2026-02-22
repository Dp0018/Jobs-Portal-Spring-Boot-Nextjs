"use client";

import { Button } from "@/components/ui/button";
import { IconPencil, IconPlus, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { CertificationCard } from "./certification-card";
import { CertificationInput } from "./certification-input";

export const Certificate = ({ profile, edit }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [addCerti, setAddCerti] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <span className="w-1 h-8 bg-linear-to-b from-primary to-primary/50 rounded-full" />
          Certifications
        </h2>
        <div className="flex gap-2">
          {edit && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setAddCerti(true)}
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

      {/* Certifications List */}
      <div className="space-y-4">
        {profile?.certifications?.map((certify: any, id: number) => (
          <CertificationCard key={id} idx={id} {...certify} edit={isEditing} />
        ))}
        {addCerti && <CertificationInput setEdit={setAddCerti} />}
        {!profile?.certifications?.length && !addCerti && (
          <div className="text-center py-12 bg-muted/20 rounded-xl border border-border/20">
            <p className="text-muted-foreground text-sm">No certifications added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
