"use client";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format-date";
import { changeProfile } from "@/modules/landing/server/profile-slice";
import { successNotification } from "@/modules/notifications/server/notification-service";
import {
  IconTrash,
  IconCalendar,
  IconId,
  IconCertificate,
} from "@tabler/icons-react";
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
    <div className="group flex items-center gap-4 bg-stone-50 rounded-2xl p-5 border border-stone-100 hover:border-sky-200 hover:bg-sky-50/30 transition-all duration-200">
      {/* Issuer logo */}
      <div className="shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm border border-stone-100 flex items-center justify-center overflow-hidden">
        <img
          className="h-8 w-8 object-contain"
          src={`/icons/${props.issuer}.png`}
          alt={props.issuer}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            (e.currentTarget.nextSibling as HTMLElement).style.display = "flex";
          }}
        />
        <span className="hidden w-full h-full items-center justify-center">
          <IconCertificate className="w-5 h-5 text-sky-400" />
        </span>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-stone-800 text-[0.9375rem] leading-snug capitalize truncate">
          {props.name}
        </h3>
        <p className="text-stone-500 text-sm capitalize mt-0.5">
          {props.issuer}
        </p>

        {/* Badges row */}
        <div className="flex flex-wrap gap-2 mt-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-stone-200 text-stone-500 text-xs rounded-lg">
            <IconCalendar className="w-3 h-3" />
            {formatDate(props.issueDate)}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 border border-sky-200 text-sky-700 text-xs rounded-lg font-mono">
            <IconId className="w-3 h-3" />
            {props.certificateId}
          </span>
        </div>
      </div>

      {/* Delete */}
      {props.edit && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDelete}
          className="shrink-0 h-8 px-3 gap-1.5 text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <IconTrash className="h-3.5 w-3.5" />
          Delete
        </Button>
      )}
    </div>
  );
};