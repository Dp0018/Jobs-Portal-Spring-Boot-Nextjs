import { HeroSearchSection } from "@/modules/landing/components/hero-search-section";
import { PopularRolesSection } from "@/modules/landing/components/popular-roles-section";
import { TopCompaniesSection } from "@/modules/landing/components/top-companies-section";

const HomePage = () => {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#E8F0FE] via-[#F0F4FF] to-white overflow-hidden">
      {/* ── Global Decorative Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(circle, #3B82F6 0.8px, transparent 0.8px)`,
            backgroundSize: "32px 32px",
          }}
        />
        {/* Global Gradient orbs */}
        <div className="absolute top-[15%] -left-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute top-[40%] -right-40 w-[30rem] h-[30rem] bg-indigo-200/15 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-[70%] -left-20 w-80 h-80 bg-sky-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[5%] right-[10%] w-96 h-96 bg-purple-200/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <HeroSearchSection />
        <TopCompaniesSection />
        <PopularRolesSection />
      </div>
    </main>
  );
};

export default HomePage;
