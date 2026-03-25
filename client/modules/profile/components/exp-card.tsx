"use client";

import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeProfile } from "@/modules/landing/server/profile-slice";
import { successNotification } from "@/modules/notifications/server/notification-service";
import { ExpInput } from "./exp-input";
import { formatDate } from "@/lib/format-date";
import { CompanyLogo } from "@/components/ui/company-logo";

export const ExpCard = (props: any) => {
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const profile = useSelector((state: any) => state.profile);

  const handleDelete = () => {
    const exp = [...profile.experiences];
    exp.splice(props.idx, 1);
    dispatch(changeProfile({ ...profile, experiences: exp }));
    successNotification("Success", "Experience deleted successfully");
  };

  if (edit) return <ExpInput {...props} setEdit={setEdit} />;

  return (
    <div className="group relative flex gap-4 bg-stone-50 rounded-2xl p-5 border border-stone-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all duration-200">
      {/* Timeline dot */}
      <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-white shadow-sm hidden" />

      {/* Logo */}
      <div className="shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm border border-stone-100 flex items-center justify-center overflow-hidden">
        <CompanyLogo
          company={props.company}
          className="h-8 w-8"
          fallbackClassName="h-8 w-8 rounded-lg"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3 className="font-semibold text-stone-800 text-[0.9375rem] leading-snug">
              {props.title}
            </h3>
            <div className="flex items-center gap-2 text-stone-500 text-sm mt-0.5 flex-wrap">
              <span className="font-medium text-stone-600">
                {props.company}
              </span>
              {props.location && (
                <>
                  <span className="text-stone-300">·</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" />
                    {props.location}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Date badge */}
          <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-stone-200 text-stone-500 text-xs rounded-lg">
            <Calendar className="w-3 h-3" />
            {formatDate(props.startDate)} —{" "}
            {props.working ? (
              <span className="text-amber-600 font-medium">Present</span>
            ) : (
              formatDate(props.endDate)
            )}
          </span>
        </div>

        {props.description && (
          <p className="mt-2.5 text-stone-500 text-sm leading-relaxed line-clamp-3">
            {props.description}
          </p>
        )}

        {/* Edit / Delete — only visible when parent is in edit mode */}
        {props.edit && (
          <div className="flex gap-2 mt-3">
            <Button
              onClick={() => setEdit(true)}
              variant="ghost"
              size="sm"
              className="h-7 px-3 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg"
            >
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              variant="ghost"
              size="sm"
              className="h-7 px-3 text-xs text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg"
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};