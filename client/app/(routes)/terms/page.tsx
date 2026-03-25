import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  IconScale,
  IconShieldCheck,
  IconAlertCircle,
  IconUsers,
  IconBriefcase,
  IconLock,
  IconMail,
  IconFileText,
  IconChevronRight,
} from "@tabler/icons-react";

/* ─────────────────────────────────────────────
   Data — sections and sub-clauses
───────────────────────────────────────────── */
const LAST_UPDATED = "January 15, 2025";
const EFFECTIVE_DATE = "February 1, 2025";

const TOC = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "definitions", label: "Definitions" },
  { id: "accounts", label: "User Accounts" },
  { id: "employer", label: "Employer Obligations" },
  { id: "applicant", label: "Applicant Obligations" },
  { id: "prohibited", label: "Prohibited Conduct" },
  { id: "ip", label: "Intellectual Property" },
  { id: "privacy", label: "Privacy & Data" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "termination", label: "Termination" },
  { id: "governing", label: "Governing Law" },
  { id: "contact", label: "Contact Us" },
];

interface SectionProps {
  id: string;
  icon: React.ReactNode;
  number: string;
  title: string;
  children: React.ReactNode;
}

const Section = ({ id, icon, number, title, children }: SectionProps) => (
  <section id={id} className="scroll-mt-24">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5">
          Section {number}
        </p>
        <h2 className="text-xl font-bold text-[#0F172A]">{title}</h2>
      </div>
    </div>
    <div className="pl-13 ml-13 space-y-3 text-[#475569] text-sm leading-relaxed">
      {children}
    </div>
    <Separator className="bg-[#E2E8F0] mt-8" />
  </section>
);

const Clause = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-2.5">
    <IconChevronRight size={15} className="text-primary shrink-0 mt-0.5" />
    <p>{children}</p>
  </div>
);

/* ═══════════════════════════════════════════
   PAGE
═══════════════════════════════════════════ */
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Hero banner ── */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/8 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full gap-1.5"
              >
                <IconScale size={11} />
                Legal
              </Badge>
              <h1 className="text-3xl md:text-4xl font-black text-[#0F172A] tracking-tight">
                Terms of Service
              </h1>
              <p className="text-sm text-[#64748B] max-w-xl leading-relaxed">
                Please read these terms carefully before using Joblify. By
                accessing or using our platform you agree to be bound by these
                terms.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 text-right shrink-0">
              <p className="text-xs text-[#94A3B8]">
                Last updated:{" "}
                <span className="font-semibold text-[#475569]">
                  {LAST_UPDATED}
                </span>
              </p>
              <p className="text-xs text-[#94A3B8]">
                Effective:{" "}
                <span className="font-semibold text-[#475569]">
                  {EFFECTIVE_DATE}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body: sidebar + content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sticky TOC sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-24 bg-white border border-[#E2E8F0] rounded-xl p-4">
              <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3 px-1">
                Contents
              </p>
              <nav className="space-y-0.5">
                {TOC.map(({ id, label }, i) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#64748B] hover:text-primary hover:bg-primary/5 transition-colors group"
                  >
                    <span className="w-4 text-[#CBD5E1] font-mono text-[10px] shrink-0 group-hover:text-primary transition-colors">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {label}
                  </a>
                ))}
              </nav>

              <Separator className="bg-[#E2E8F0] my-4" />
              <Link
                href="/privacy"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#64748B] hover:text-primary hover:bg-primary/5 transition-colors"
              >
                <IconShieldCheck size={13} className="text-[#94A3B8]" />
                Privacy Policy →
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 bg-white border border-[#E2E8F0] rounded-xl p-6 md:p-8 space-y-8">
            {/* Intro notice */}
            <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <IconAlertCircle
                size={18}
                className="text-amber-600 shrink-0 mt-0.5"
              />
              <p className="text-sm text-amber-800 leading-relaxed">
                <strong>Important:</strong> These Terms of Service constitute a
                legally binding agreement between you and Joblify, Inc. If you
                do not agree, please do not use our platform.
              </p>
            </div>

            {/* 01 — Acceptance */}
            <Section
              id="acceptance"
              number="01"
              icon={<IconFileText size={17} className="text-primary" />}
              title="Acceptance of Terms"
            >
              <p>
                By creating an account, browsing, or using any part of the
                Joblify platform (the "Service"), you agree to comply with and
                be legally bound by these Terms of Service ("Terms"), whether or
                not you are a registered user.
              </p>
              <Clause>
                These Terms apply to all visitors, users, employers, and
                applicants of the Service.
              </Clause>
              <Clause>
                Joblify reserves the right to modify these Terms at any time. We
                will notify users via email or prominent notice on the platform.
              </Clause>
              <Clause>
                Your continued use of the Service after any modification
                constitutes acceptance of the updated Terms.
              </Clause>
            </Section>

            {/* 02 — Definitions */}
            <Section
              id="definitions"
              number="02"
              icon={<IconFileText size={17} className="text-primary" />}
              title="Definitions"
            >
              <p>For the purposes of these Terms:</p>
              <Clause>
                <strong className="text-[#0F172A]">"Platform"</strong> means the
                Joblify website, mobile applications, and related services.
              </Clause>
              <Clause>
                <strong className="text-[#0F172A]">"Employer"</strong> means any
                company or individual who posts job listings or searches for
                candidates on the Platform.
              </Clause>
              <Clause>
                <strong className="text-[#0F172A]">"Applicant"</strong> means
                any individual who uses the Platform to search for employment
                opportunities.
              </Clause>
              <Clause>
                <strong className="text-[#0F172A]">"Content"</strong> means all
                information, data, text, images, or other material submitted to
                or displayed on the Platform.
              </Clause>
            </Section>

            {/* 03 — Accounts */}
            <Section
              id="accounts"
              number="03"
              icon={<IconUsers size={17} className="text-primary" />}
              title="User Accounts"
            >
              <Clause>
                You must be at least 18 years of age to create an account and
                use the Service.
              </Clause>
              <Clause>
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account.
              </Clause>
              <Clause>
                You agree to provide accurate, current, and complete information
                during registration and to update such information as necessary.
              </Clause>
              <Clause>
                You must notify Joblify immediately at{" "}
                <a
                  href="mailto:security@joblify.in"
                  className="text-primary hover:underline underline-offset-2"
                >
                  security@joblify.in
                </a>{" "}
                of any unauthorised use of your account.
              </Clause>
              <Clause>
                Joblify reserves the right to suspend or terminate any account
                that violates these Terms or engages in fraudulent activity.
              </Clause>
            </Section>

            {/* 04 — Employer */}
            <Section
              id="employer"
              number="04"
              icon={<IconBriefcase size={17} className="text-primary" />}
              title="Employer Obligations"
            >
              <Clause>
                Employers warrant that all job listings are genuine, accurate,
                and comply with applicable employment laws and
                anti-discrimination legislation.
              </Clause>
              <Clause>
                Employers may not post roles that require candidates to pay any
                fees or make any purchases as a condition of employment.
              </Clause>
              <Clause>
                Employers are solely responsible for the hiring decision and any
                resulting employment relationship.
              </Clause>
              <Clause>
                Job listings must not contain misleading information about
                compensation, role scope, or company details.
              </Clause>
              <Clause>
                Joblify reserves the right to remove any listing that violates
                these obligations without notice or refund.
              </Clause>
            </Section>

            {/* 05 — Applicant */}
            <Section
              id="applicant"
              number="05"
              icon={<IconUsers size={17} className="text-primary" />}
              title="Applicant Obligations"
            >
              <Clause>
                Applicants warrant that all information provided in their
                profiles and applications is truthful and accurate.
              </Clause>
              <Clause>
                Submitting false credentials, fabricated work experience, or
                misleading information constitutes grounds for immediate account
                termination.
              </Clause>
              <Clause>
                Applicants may not use the platform to harvest employer contact
                information for unsolicited commercial purposes.
              </Clause>
              <Clause>
                Applicants acknowledge that applying for a role does not
                guarantee an interview or offer of employment.
              </Clause>
            </Section>

            {/* 06 — Prohibited */}
            <Section
              id="prohibited"
              number="06"
              icon={<IconAlertCircle size={17} className="text-primary" />}
              title="Prohibited Conduct"
            >
              <p>You agree not to:</p>
              <Clause>
                Scrape, crawl, or use automated tools to extract data from the
                Platform without explicit written permission.
              </Clause>
              <Clause>
                Post spam, phishing links, malware, or any malicious content.
              </Clause>
              <Clause>
                Impersonate any person, company, or Joblify employee.
              </Clause>
              <Clause>
                Circumvent, disable, or otherwise interfere with
                security-related features of the Platform.
              </Clause>
              <Clause>
                Use the Platform for any purpose that is unlawful, harmful, or
                fraudulent.
              </Clause>
              <Clause>
                Create multiple accounts to circumvent bans or rate limits.
              </Clause>
            </Section>

            {/* 07 — IP */}
            <Section
              id="ip"
              number="07"
              icon={<IconLock size={17} className="text-primary" />}
              title="Intellectual Property"
            >
              <Clause>
                The Joblify name, logo, platform design, and all proprietary
                technology are owned by Joblify, Inc. and protected by
                copyright, trademark, and other laws.
              </Clause>
              <Clause>
                You retain ownership of content you submit (e.g., your resume or
                job listings) but grant Joblify a worldwide, royalty-free
                licence to display and process that content for the purpose of
                operating the Service.
              </Clause>
              <Clause>
                You may not reproduce, distribute, or create derivative works
                from any part of the Platform without express written consent.
              </Clause>
            </Section>

            {/* 08 — Privacy */}
            <Section
              id="privacy"
              number="08"
              icon={<IconShieldCheck size={17} className="text-primary" />}
              title="Privacy & Data"
            >
              <Clause>
                Your use of the Platform is governed by our{" "}
                <Link
                  href="/privacy"
                  className="text-primary font-semibold hover:underline underline-offset-2"
                >
                  Privacy Policy
                </Link>
                , which is incorporated into these Terms by reference.
              </Clause>
              <Clause>
                By using the Platform you consent to the collection and use of
                information as described in the Privacy Policy.
              </Clause>
            </Section>

            {/* 09 — Liability */}
            <Section
              id="liability"
              number="09"
              icon={<IconScale size={17} className="text-primary" />}
              title="Limitation of Liability"
            >
              <Clause>
                The Platform is provided on an "as-is" and "as-available" basis
                without warranties of any kind, express or implied.
              </Clause>
              <Clause>
                Joblify is not liable for any loss of profits, data, or goodwill
                arising from your use of or inability to use the Service.
              </Clause>
              <Clause>
                Joblify does not guarantee the accuracy, completeness, or
                suitability of any job listing or candidate profile on the
                Platform.
              </Clause>
              <Clause>
                In no event shall Joblify's aggregate liability exceed the
                amount you paid to Joblify in the twelve (12) months preceding
                the claim.
              </Clause>
            </Section>

            {/* 10 — Termination */}
            <Section
              id="termination"
              number="10"
              icon={<IconAlertCircle size={17} className="text-primary" />}
              title="Termination"
            >
              <Clause>
                You may delete your account at any time from your profile
                settings.
              </Clause>
              <Clause>
                Joblify may suspend or terminate your access immediately,
                without prior notice, for conduct that violates these Terms.
              </Clause>
              <Clause>
                Upon termination, your right to use the Service will cease.
                Sections covering Intellectual Property, Limitation of
                Liability, and Governing Law survive termination.
              </Clause>
            </Section>

            {/* 11 — Governing Law */}
            <Section
              id="governing"
              number="11"
              icon={<IconScale size={17} className="text-primary" />}
              title="Governing Law"
            >
              <Clause>
                These Terms are governed by and construed in accordance with the
                laws of India, without regard to conflict of law principles.
              </Clause>
              <Clause>
                Any disputes arising out of or relating to these Terms shall be
                subject to the exclusive jurisdiction of the courts located in
                Bengaluru, Karnataka.
              </Clause>
              <Clause>
                If any provision of these Terms is found to be unenforceable,
                the remaining provisions will remain in full force and effect.
              </Clause>
            </Section>

            {/* 12 — Contact */}
            <section id="contact" className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <IconMail size={17} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5">
                    Section 12
                  </p>
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    Contact Us
                  </h2>
                </div>
              </div>
              <p className="text-sm text-[#475569] leading-relaxed mb-5 ml-13">
                If you have questions about these Terms, please reach out:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    label: "Legal queries",
                    value: "legal@joblify.in",
                    href: "mailto:legal@joblify.in",
                  },
                  {
                    label: "General support",
                    value: "hello@joblify.in",
                    href: "mailto:hello@joblify.in",
                  },
                  {
                    label: "Abuse / Reports",
                    value: "abuse@joblify.in",
                    href: "mailto:abuse@joblify.in",
                  },
                ].map(({ label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex flex-col gap-0.5 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover:border-primary/30 hover:bg-primary/5 transition-all group"
                  >
                    <span className="text-xs text-[#94A3B8]">{label}</span>
                    <span className="text-sm font-semibold text-primary group-hover:underline underline-offset-2">
                      {value}
                    </span>
                  </a>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
