import {
  IconMapPin,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandGithub,
  IconBriefcase,
  IconMail,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/Logo.svg";
import { Separator } from "@/components/ui/separator";

const FOOTER_LINKS = {
  "For Job Seekers": [
    { name: "Browse Jobs", href: "/find-jobs" },
    { name: "Create Profile", href: "/profile" },
    { name: "Career Resources", href: "/about" },
  ],
  "For Employers": [
    { name: "Post a Job", href: "/post-job" },
    { name: "Find Talent", href: "/find-talent" },
    { name: "Employer Dashboard", href: "/dashboard" },
  ],
  Company: [
    { name: "About Us", href: "/about" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

const SOCIAL_LINKS = [
  {
    icon: IconBrandLinkedin,
    href: "https://linkedin.com/company/joblify",
    label: "LinkedIn",
    hoverColor:
      "hover:text-[#0A66C2] hover:border-[#0A66C2]/30 hover:bg-[#0A66C2]/5",
  },
  {
    icon: IconBrandTwitter,
    href: "https://twitter.com/joblify",
    label: "Twitter / X",
    hoverColor: "hover:text-[#111827] hover:border-black/20 hover:bg-black/5",
  },
  {
    icon: IconBrandInstagram,
    href: "https://instagram.com/joblify",
    label: "Instagram",
    hoverColor:
      "hover:text-[#E1306C] hover:border-[#E1306C]/30 hover:bg-[#E1306C]/5",
  },
  {
    icon: IconBrandGithub,
    href: "https://github.com/joblify",
    label: "GitHub",
    hoverColor:
      "hover:text-[#24292F] hover:border-[#24292F]/25 hover:bg-[#24292F]/5",
  },
  {
    icon: IconMail,
    href: "mailto:hello@joblify.in",
    label: "Email us",
    hoverColor: "hover:text-primary hover:border-primary/30 hover:bg-primary/5",
  },
];

export const Footer = () => {
  return (
    <footer className="bg-[#F8FAFC] border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* ── Brand column (spans 2 cols on lg) ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <Image src={Logo} alt="Joblify" width={18} height={18} />
              </div>
              <span className="text-xl font-bold text-[#0F172A] tracking-tight group-hover:text-primary transition-colors">
                Joblify
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-sm text-[#64748B] leading-relaxed max-w-xs">
              Connecting ambitious professionals with companies building
              tomorrow. Your next opportunity starts here.
            </p>

            {/* Address */}
            <div className="flex items-start gap-2">
              <IconMapPin
                size={15}
                className="text-[#94A3B8] mt-0.5 shrink-0"
              />
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                123 Business Street, Suite 100
                <br />
                City, State 12345
              </p>
            </div>

            {/* Social links */}
            <div>
              <p className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-3">
                Follow us
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label, hoverColor }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className={`w-8 h-8 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center text-[#94A3B8] transition-all duration-150 ${hoverColor}`}
                  >
                    <Icon size={15} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Link columns ── */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="space-y-3">
              <h4 className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ name, href }) => (
                  <li key={name}>
                    <Link
                      href={href}
                      className="text-sm text-[#64748B] hover:text-primary transition-colors duration-150"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Stats strip ── */}
        <div className="mt-10 grid grid-cols-3 gap-4 py-5 px-6 bg-white rounded-xl border border-[#E2E8F0]">
          {[
            { value: "50K+", label: "Active job listings" },
            { value: "200K+", label: "Registered candidates" },
            { value: "5K+", label: "Verified companies" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-lg font-bold text-primary leading-none">
                {value}
              </p>
              <p className="text-xs text-[#94A3B8] mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Separator className="bg-[#E2E8F0] my-6" />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
              <IconBriefcase size={11} className="text-primary" />
            </div>
            <p className="text-xs text-[#94A3B8]">
              © {new Date().getFullYear()} Joblify, Inc. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-xs text-[#94A3B8] hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-[#94A3B8] hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/about"
              className="text-xs text-[#94A3B8] hover:text-primary transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
