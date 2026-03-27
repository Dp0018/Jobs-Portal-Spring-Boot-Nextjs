"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  IconMenu2,
  IconSettings,
  IconX,
  IconBriefcase,
  IconUsers,
  IconInfoCircle,
  IconHome,
  IconSparkles,
  IconArrowRight,
  IconBell,
  IconCrown,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import NavLink from "./nav-link";
import { ProfileMenu } from "./profile-menu";
import Image from "next/image";
import Logo from "@/public/Logo.svg";
import { RootState } from "@/modules/redux/store";
import { getProfile } from "../server/profile-service";
import { setProfile } from "../server/profile-slice";
import { NotificationMenu } from "./notification-menu";

/* ─── nav items — used for mobile drawer ─── */
const NAV_ITEMS = [
  { label: "Home", href: "/", icon: IconHome, show: "all" },
  { label: "Find Jobs", href: "/find-jobs", icon: IconBriefcase, show: "all" },
  {
    label: "Find Talent",
    href: "/find-talent",
    icon: IconUsers,
    show: "employer_only",
  },
  {
    label: "Post a Job",
    href: "/post-job",
    icon: IconBriefcase,
    show: "employer_only",
  },
  { label: "Pricing", href: "/pricing", icon: IconCrown, show: "all" },
  { label: "About Us", href: "/about", icon: IconInfoCircle, show: "all" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [announceClosed, setAnnounceClosed] = useState(false);
  const dispatch = useDispatch();
  const pathname = usePathname();

  const user = useSelector((state: RootState) => state.user);
  const profileId = useSelector((state: RootState) => state.user?.id);

  /* hydration guard */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close mobile on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isLoggedIn = mounted && user;

  /* profile fetch — LOGIC UNTOUCHED */
  useEffect(() => {
    if (!profileId) return;
    const controller = new AbortController();
    const fetchProfile = async () => {
      try {
        const data = await getProfile(profileId);
        dispatch(setProfile(data));
      } catch (error: any) {
        if (error?.name !== "AbortError")
          console.error("Profile fetch error:", error);
      }
    };
    fetchProfile();
    return () => controller.abort();
  }, [profileId, dispatch]);

  /* hide on auth pages */
  if (pathname === "/signup" || pathname === "/login") return null;

  /* filtered mobile nav */
  const visibleNav = NAV_ITEMS.filter(({ show }) => {
    if (show === "all") return true;
    if (show === "employer_only") return user?.accountType === "EMPLOYER";
    return false;
  });

  /* active check */
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ══════════════════════════════════════════
          ANNOUNCEMENT BAR
      ══════════════════════════════════════════ */}
      {!announceClosed && (
        <div className="relative z-50 bg-primary text-white text-xs font-medium py-2 px-4 text-center overflow-hidden">
          {/* shimmer sweep */}
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
              animation: "shimmer 3s infinite",
            }}
          />
          <span className="relative inline-flex items-center gap-2 flex-wrap justify-center">
            <IconSparkles size={13} className="opacity-80 shrink-0" />
            <span className="opacity-90">
              🎉 We&apos;ve crossed{" "}
              <strong className="text-white">200,000 active job seekers</strong>{" "}
              — join the fastest-growing job platform in India
            </span>
            <Link
              href="/find-jobs"
              className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 border border-white/30 rounded-full px-2.5 py-0.5 text-white font-semibold transition-colors shrink-0"
            >
              Explore now <IconArrowRight size={11} />
            </Link>
          </span>
          <button
            onClick={() => setAnnounceClosed(true)}
            aria-label="Dismiss"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1"
          >
            <IconX size={14} />
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MAIN HEADER
      ══════════════════════════════════════════ */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_1px_12px_rgba(15,23,42,0.08)] border-b border-[#E2E8F0]/80"
            : "bg-white border-b border-[#E2E8F0]"
        }`}
      >
        {/* thin primary accent line at very top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between gap-6 transition-all duration-300 ${
              scrolled ? "h-14" : "h-16"
            }`}
          >
            {/* ── LOGO ── */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              {/* gradient icon container */}
              <div className="relative w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-200">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20" />
                <Image
                  src={Logo}
                  alt="Joblify"
                  width={18}
                  height={18}
                  className="relative z-10 brightness-200"
                />
              </div>

              {/* wordmark */}
              <span className="text-[1.2rem] font-black text-[#0F172A] tracking-tight group-hover:text-primary transition-colors duration-200">
                Joblify
              </span>
              {/* beta badge */}
              <Badge className="hidden sm:inline-flex bg-primary/10 text-primary border-primary/20 text-[9px] font-bold px-1.5 py-0 h-4 rounded-full">
                BETA
              </Badge>
            </Link>

            {/* ── DESKTOP NAV ── */}
            <nav className="hidden lg:flex h-full items-center flex-1 ml-2">
              <NavLink />
            </nav>

            {/* ── DESKTOP ACTIONS ── */}
            <div className="hidden md:flex items-center gap-2.5 shrink-0">
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <NotificationMenu />
                  <Separator
                    orientation="vertical"
                    className="h-6 bg-[#E2E8F0]"
                  />
                  <ProfileMenu />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] font-medium px-4 h-9"
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup">
                    {/* gradient CTA button */}
                    <Button
                      size="sm"
                      className="relative h-9 px-4 font-semibold text-white overflow-hidden group/btn"
                      style={{
                        background:
                          "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                        boxShadow:
                          "0 2px 8px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                      }}
                    >
                      {/* hover shimmer */}
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500" />
                      <span className="relative flex items-center gap-1.5">
                        Get started free
                        <IconArrowRight
                          size={14}
                          className="group-hover/btn:translate-x-0.5 transition-transform"
                        />
                      </span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* ── MOBILE TOGGLE ── */}
            <button
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Toggle menu"
              className={`md:hidden relative w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-200 ${
                mobileOpen
                  ? "bg-primary border-primary text-white"
                  : "bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1] hover:bg-white"
              }`}
            >
              <span
                className={`absolute transition-all duration-200 ${
                  mobileOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
                }`}
              >
                <IconX size={17} stroke={2.5} />
              </span>
              <span
                className={`absolute transition-all duration-200 ${
                  mobileOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"
                }`}
              >
                <IconMenu2 size={17} stroke={2} />
              </span>
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            MOBILE MENU DRAWER
        ══════════════════════════════════════════ */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-[#E2E8F0] bg-white">
            {/* Nav links */}
            <div className="px-4 pt-3 pb-2 space-y-0.5">
              <p className="px-3 pb-1.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
                Navigation
              </p>
              {visibleNav.map(({ label, href, icon: Icon }, i) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      active
                        ? "bg-primary/8 text-primary"
                        : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                    }`}
                    style={{ transitionDelay: `${i * 30}ms` }}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        active
                          ? "bg-primary/15 text-primary"
                          : "bg-[#F1F5F9] text-[#94A3B8]"
                      }`}
                    >
                      <Icon size={14} />
                    </div>
                    {label}
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="mx-4 border-t border-[#F1F5F9]" />

            {/* Auth section */}
            <div className="px-4 py-3">
              {isLoggedIn ? (
                <div className="flex items-center justify-between">
                  <ProfileMenu />
                  <div className="flex items-center gap-2">
                    <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:bg-white hover:text-[#0F172A] transition-colors">
                      <IconSettings size={16} stroke={1.5} />
                    </button>
                    <NotificationMenu />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="px-1 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-2">
                    Account
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full h-10 border-[#E2E8F0] text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] font-medium"
                      >
                        Log in
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)}>
                      <Button
                        className="w-full h-10 font-semibold text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                          boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                        }}
                      >
                        Get started
                      </Button>
                    </Link>
                  </div>

                  {/* quick stats strip */}
                  <div className="flex items-center justify-around py-3 mt-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                    {[
                      { val: "50K+", label: "Jobs" },
                      { val: "200K+", label: "Talent" },
                      { val: "5K+", label: "Companies" },
                    ].map(({ val, label }) => (
                      <div key={label} className="text-center">
                        <p className="text-sm font-bold text-primary leading-none">
                          {val}
                        </p>
                        <p className="text-[10px] text-[#94A3B8] mt-0.5">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
};

export default Header;
