import { HeroSearchSection } from "@/modules/landing/components/hero-search-section";
import { PopularRolesSection } from "@/modules/landing/components/popular-roles-section";
import { TopCompaniesSection } from "@/modules/landing/components/top-companies-section";

/* ═══════════════════════════════════════════
   HOME / LANDING PAGE
   Place this file at: app/page.tsx  (or app/(home)/page.tsx)
═══════════════════════════════════════════ */
const HomePage = () => {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* 1 — Hero + search bar + category chips */}
      <HeroSearchSection />

      {/* 2 — Top company categories + featured company cards */}
      <TopCompaniesSection />

      {/* 3 — Promo banner + popular roles grid */}
      <PopularRolesSection />
    </main>
  );
};

export default HomePage;
