"use client";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format-date";
import { changeProfile } from "@/modules/landing/server/profile-slice";
import { successNotification } from "@/modules/notifications/server/notification-service";
import { IconTrash, IconCalendar, IconId } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";

export const CertificationCard = (props: any) => {
  const dispatch = useDispatch();
  const profile = useSelector((state: any) => state.profile);

  const handleDelete = () => {
    const certis = [...profile.certifications];
    certis.splice(props.idx, 1);
    dispatch(changeProfile({ ...profile, certifications: certis }));
    successNotification("Success", "Certificate deleted successfully");
  };

  return (
    <div className="group relative bg-linear-to-br from-muted/30 to-muted/20 backdrop-blur-sm border border-border/20 rounded-xl p-5 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-center justify-between">

        {/* Certificate Info */}
        <div className="flex items-center gap-4 flex-1">
          {/* Issuer Logo */}
          <div className="p-3 bg-white rounded-xl shadow-lg shrink-0">
            <img
              className="h-10 w-10 object-contain"
              src={`/icons/${props.issuer}.png`}
              alt={props.issuer}
              onError={(e) => { e.currentTarget.src = "/icons/default.png"; }}
            />
          </div>

          {/* Certificate Details */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-1 capitalize">
              {props.name}
            </h3>
            <p className="text-muted-foreground text-sm capitalize">{props.issuer}</p>
          </div>
        </div>

        {/* Date, ID & Delete */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end gap-2">
            {/* Issue Date */}
            <div className="flex items-center gap-2 text-muted-foreground text-sm bg-muted/30 px-3 py-1.5 rounded-lg border border-border/20">
              <IconCalendar className="w-4 h-4" />
              <span>{formatDate(props.issueDate)}</span>
            </div>

            {/* Certificate ID */}
            <div className="flex items-center gap-2 text-primary text-xs bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
              <IconId className="w-3.5 h-3.5" />
              <span className="font-mono">ID: {props.certificateId}</span>
            </div>
          </div>

          {/* Delete — replaces Mantine ActionIcon color="red" */}
          {props.edit && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDelete}
              className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10 hover:scale-110 transition-all"
            >
              <IconTrash className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
    </div>
  );
};
