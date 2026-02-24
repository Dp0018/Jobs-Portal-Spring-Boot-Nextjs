"use client";

import { use } from "react";
import { JobAnalyticsView } from "@/modules/employer/views/job-analytics-view";

export default function JobAnalyticsPage({ params }: { params: Promise<{ jobId: string }> }) {
  const resolvedParams = use(params);
  return <JobAnalyticsView jobId={resolvedParams.jobId} />;
}
