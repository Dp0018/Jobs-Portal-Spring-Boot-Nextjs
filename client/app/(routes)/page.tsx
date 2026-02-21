import DreamJobs from "@/modules/landing/components/dream-jobs";
import { JobCategories } from "@/modules/landing/components/job-categories";
import { HowItWorks } from "@/modules/landing/components/how-it-work";
import { Testimonial } from "@/modules/landing/components/testionial";

const Page = () => {
  return (
    <>
      <DreamJobs />
      <JobCategories />
      <HowItWorks />
      <Testimonial />
    </>
  );
};

export default Page;