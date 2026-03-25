"use client";

import TalentProfileView from "@/modules/talent-profile/components/views/talent-profile-view";
import { use } from "react";

interface TalentProfilePageProps {
  params: Promise<{ id: string }>;
}

const TalentProfilePage = ({ params }: TalentProfilePageProps) => {
  const { id } = use(params);

  return <TalentProfileView profileId={id} />;
};

export default TalentProfilePage;
