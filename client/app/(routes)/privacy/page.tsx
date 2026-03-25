import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  IconShieldCheck,
  IconDatabase,
  IconEye,
  IconShare,
  IconLock,
  IconUserCheck,
  IconMail,
  IconCookie,
  IconTrash,
  IconWorld,
  IconChevronRight,
  IconAlertCircle,
} from "@tabler/icons-react";

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const LAST_UPDATED = "January 15, 2025";
const EFFECTIVE_DATE = "February 1, 2025";

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "collection", label: "Data We Collect" },
  { id: "use", label: "How We Use Your Data" },
  { id: "sharing", label: "Sharing Your Data" },
  { id: "cookies", label: "Cookies & Tracking" },
  { id: "retention", label: "Data Retention" },
  { id: "rights", label: "Your Rights" },
  { id: "security", label: "Security" },
  { id: "children", label: "Children's Privacy" },
  { id: "international", label: "International Transfers" },
  { id: "changes", label: "Changes to This Policy" },
  { id: "contact", label: "Contact & DPO" },
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
    <div className="space-y-3 text-[#475569] text-sm leading-relaxed">
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

/* Data table row */
const DataRow = ({
  category,
  examples,
  purpose,
}: {
  category: string;
  examples: string;
  purpose: string;
}) => (
  <tr className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors">
    <td className="py-3 pr-4 text-sm font-semibold text-[#0F172A] align-top w-1/4">
      {category}
    </td>
    <td className="py-3 pr-4 text-xs text-[#64748B] align-top w-2/5">
      {examples}
    </td>
    <td className="py-3 text-xs text-[#64748B] align-top">{purpose}</td>
  </tr>
);

/* Rights card */
const RightCard = ({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) => (
  <div className="flex items-start gap-3 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover:border-primary/25 hover:bg-primary/5 transition-all group">
    <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0 group-hover:border-primary/25 group-hover:bg-primary/10 transition-colors">
      <Icon
        size={15}
        className="text-[#64748B] group-hover:text-primary transition-colors"
      />
    </div>
    <div>
      <p className="text-sm font-semibold text-[#0F172A] mb-0.5">{title}</p>
      <p className="text-xs text-[#64748B] leading-relaxed">{desc}</p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   PAGE
═══════════════════════════════════════════ */
export default function PrivacyPage() {
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
                <IconShieldCheck size={11} />
                Legal
              </Badge>
              <h1 className="text-3xl md:text-4xl font-black text-[#0F172A] tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-sm text-[#64748B] max-w-xl leading-relaxed">
                We respect your privacy and are committed to protecting your
                personal data. This policy explains how we collect, use, and
                safeguard your information when you use Joblify.
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

      {/* ── Body ── */}
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
                href="/terms"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#64748B] hover:text-primary hover:bg-primary/5 transition-colors"
              >
                <IconShieldCheck size={13} className="text-[#94A3B8]" />
                Terms of Service →
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 bg-white border border-[#E2E8F0] rounded-xl p-6 md:p-8 space-y-8">
            {/* Commitment banner */}
            <div className="flex gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <IconShieldCheck
                size={18}
                className="text-green-600 shrink-0 mt-0.5"
              />
              <p className="text-sm text-green-800 leading-relaxed">
                <strong>Our commitment:</strong> We will never sell your
                personal data to third parties. You remain in control of your
                information at all times.
              </p>
            </div>

            {/* 01 — Overview */}
            <Section
              id="overview"
              number="01"
              icon={<IconEye size={17} className="text-primary" />}
              title="Overview"
            >
              <p>
                Joblify, Inc. ("Joblify", "we", "us", or "our") operates the
                Joblify platform. This Privacy Policy describes how we collect,
                use, store, and share information about you when you use our
                website, mobile applications, and services (collectively the
                "Platform").
              </p>
              <Clause>
                This policy applies to all users — job seekers, employers, and
                visitors — regardless of how you access the Platform.
              </Clause>
              <Clause>
                We process data in accordance with applicable data protection
                laws, including the Information Technology Act, 2000 (India) and
                the Digital Personal Data Protection Act, 2023 ("DPDPA").
              </Clause>
            </Section>

            {/* 02 — Collection */}
            <Section
              id="collection"
              number="02"
              icon={<IconDatabase size={17} className="text-primary" />}
              title="Data We Collect"
            >
              <p>
                We collect data in three ways: information you provide directly,
                data generated automatically, and information from third
                parties.
              </p>

              {/* Data table */}
              <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] mt-4">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <th className="py-3 px-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider w-1/4">
                        Category
                      </th>
                      <th className="py-3 px-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider w-2/5">
                        Examples
                      </th>
                      <th className="py-3 px-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                        Purpose
                      </th>
                    </tr>
                  </thead>
                  <tbody className="px-4">
                    {[
                      {
                        category: "Identity",
                        examples: "Full name, email, phone, profile photo",
                        purpose: "Account creation, authentication",
                      },
                      {
                        category: "Professional",
                        examples:
                          "Work history, education, skills, resume, certifications",
                        purpose: "Matching candidates with jobs",
                      },
                      {
                        category: "Usage",
                        examples:
                          "Pages visited, searches performed, jobs viewed, time on site",
                        purpose: "Platform analytics & improvement",
                      },
                      {
                        category: "Device",
                        examples: "IP address, browser type, OS, device ID",
                        purpose: "Security, fraud prevention",
                      },
                      {
                        category: "Communications",
                        examples: "Messages with employers, support tickets",
                        purpose: "Service delivery, dispute resolution",
                      },
                      {
                        category: "Payment",
                        examples:
                          "Billing address, last 4 digits of card (via Stripe)",
                        purpose: "Processing employer subscriptions",
                      },
                    ].map((row) => (
                      <DataRow key={row.category} {...row} />
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* 03 — Use */}
            <Section
              id="use"
              number="03"
              icon={<IconEye size={17} className="text-primary" />}
              title="How We Use Your Data"
            >
              <Clause>
                <strong className="text-[#0F172A]">
                  Matching & recommendations:
                </strong>{" "}
                To surface relevant job listings for applicants and suitable
                candidates for employers.
              </Clause>
              <Clause>
                <strong className="text-[#0F172A]">Account management:</strong>{" "}
                To create, maintain, and secure your account.
              </Clause>
              <Clause>
                <strong className="text-[#0F172A]">Communications:</strong> To
                send transactional emails (application status, OTP), and — with
                your consent — marketing communications.
              </Clause>
              <Clause>
                <strong className="text-[#0F172A]">Safety & compliance:</strong>{" "}
                To detect fraud, prevent abuse, and comply with legal
                obligations.
              </Clause>
              <Clause>
                <strong className="text-[#0F172A]">Product improvement:</strong>{" "}
                Aggregated, anonymised data helps us improve features and fix
                bugs.
              </Clause>
              <p className="p-3 bg-primary/5 border border-primary/15 rounded-lg text-xs text-primary font-medium">
                ✦ We never use your data to train third-party AI models or sell
                it to advertisers.
              </p>
            </Section>

            {/* 04 — Sharing */}
            <Section
              id="sharing"
              number="04"
              icon={<IconShare size={17} className="text-primary" />}
              title="Sharing Your Data"
            >
              <p>
                We do not sell your personal data. We may share it only in the
                following limited circumstances:
              </p>
              <Clause>
                <strong className="text-[#0F172A]">With employers</strong> —
                when you apply for a role, your profile and application
                materials are shared with that employer.
              </Clause>
              <Clause>
                <strong className="text-[#0F172A]">Service providers</strong> —
                trusted vendors (e.g., cloud hosting, payment processing, email
                delivery) who process data on our behalf under strict data
                processing agreements.
              </Clause>
              <Clause>
                <strong className="text-[#0F172A]">Legal requirements</strong> —
                when required by law, court order, or to protect the rights and
                safety of our users.
              </Clause>
              <Clause>
                <strong className="text-[#0F172A]">Business transfers</strong> —
                in the event of a merger or acquisition, with prior notice to
                affected users.
              </Clause>
            </Section>

            {/* 05 — Cookies */}
            <Section
              id="cookies"
              number="05"
              icon={<IconCookie size={17} className="text-primary" />}
              title="Cookies & Tracking"
            >
              <p>We use the following types of cookies:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                {[
                  {
                    name: "Essential",
                    color: "bg-green-50 border-green-200 text-green-800",
                    dot: "bg-green-500",
                    desc: "Required for the platform to function. Cannot be disabled.",
                  },
                  {
                    name: "Analytics",
                    color: "bg-blue-50 border-blue-200 text-blue-800",
                    dot: "bg-blue-500",
                    desc: "Help us understand usage patterns using anonymised data.",
                  },
                  {
                    name: "Preferences",
                    color: "bg-amber-50 border-amber-200 text-amber-800",
                    dot: "bg-amber-500",
                    desc: "Remember your settings such as language and display preferences.",
                  },
                ].map(({ name, color, dot, desc }) => (
                  <div
                    key={name}
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed ${color}`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-2 h-2 rounded-full ${dot}`} />
                      <strong className="text-sm">{name}</strong>
                    </div>
                    {desc}
                  </div>
                ))}
              </div>
              <Clause>
                You can manage cookie preferences in your browser settings.
                Disabling non-essential cookies will not affect core
                functionality.
              </Clause>
            </Section>

            {/* 06 — Retention */}
            <Section
              id="retention"
              number="06"
              icon={<IconTrash size={17} className="text-primary" />}
              title="Data Retention"
            >
              <Clause>
                Active account data is retained for as long as your account is
                open.
              </Clause>
              <Clause>
                If you delete your account, we permanently delete your personal
                data within <strong className="text-[#0F172A]">30 days</strong>,
                except where we are required by law to retain it longer.
              </Clause>
              <Clause>
                Anonymised, aggregated data (e.g., platform analytics) may be
                retained indefinitely as it cannot identify you.
              </Clause>
              <Clause>
                Application records may be retained for up to 12 months after
                submission to resolve disputes or comply with legal
                requirements.
              </Clause>
            </Section>

            {/* 07 — Rights */}
            <Section
              id="rights"
              number="07"
              icon={<IconUserCheck size={17} className="text-primary" />}
              title="Your Rights"
            >
              <p>Under applicable law you have the following rights:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {[
                  {
                    icon: IconEye,
                    title: "Right to Access",
                    desc: "Request a copy of all personal data we hold about you.",
                  },
                  {
                    icon: IconUserCheck,
                    title: "Right to Rectification",
                    desc: "Correct inaccurate or incomplete personal data.",
                  },
                  {
                    icon: IconTrash,
                    title: "Right to Erasure",
                    desc: "Request deletion of your personal data ('right to be forgotten').",
                  },
                  {
                    icon: IconLock,
                    title: "Right to Restriction",
                    desc: "Ask us to limit how we use your data in certain circumstances.",
                  },
                  {
                    icon: IconShare,
                    title: "Data Portability",
                    desc: "Receive your data in a structured, machine-readable format.",
                  },
                  {
                    icon: IconAlertCircle,
                    title: "Right to Object",
                    desc: "Object to processing based on legitimate interests or for marketing.",
                  },
                ].map((right) => (
                  <RightCard key={right.title} {...right} />
                ))}
              </div>
              <Clause>
                To exercise any of these rights, email{" "}
                <a
                  href="mailto:privacy@joblify.in"
                  className="text-primary font-semibold hover:underline underline-offset-2"
                >
                  privacy@joblify.in
                </a>
                . We will respond within{" "}
                <strong className="text-[#0F172A]">30 days</strong>.
              </Clause>
            </Section>

            {/* 08 — Security */}
            <Section
              id="security"
              number="08"
              icon={<IconLock size={17} className="text-primary" />}
              title="Security"
            >
              <Clause>
                All data is encrypted in transit using TLS 1.3 and at rest using
                AES-256.
              </Clause>
              <Clause>
                Passwords are hashed using bcrypt and are never stored in plain
                text.
              </Clause>
              <Clause>
                We conduct regular security audits and penetration tests. Our
                infrastructure is hosted on SOC 2-certified cloud providers.
              </Clause>
              <Clause>
                In the event of a data breach, we will notify affected users and
                relevant authorities within 72 hours as required by law.
              </Clause>
              <Clause>
                To report a security vulnerability, please email{" "}
                <a
                  href="mailto:security@joblify.in"
                  className="text-primary font-semibold hover:underline underline-offset-2"
                >
                  security@joblify.in
                </a>
                .
              </Clause>
            </Section>

            {/* 09 — Children */}
            <Section
              id="children"
              number="09"
              icon={<IconUserCheck size={17} className="text-primary" />}
              title="Children's Privacy"
            >
              <Clause>
                The Platform is not directed at children under the age of 18. We
                do not knowingly collect personal data from anyone under 18.
              </Clause>
              <Clause>
                If you believe a minor has provided us with personal data,
                please contact us immediately at{" "}
                <a
                  href="mailto:privacy@joblify.in"
                  className="text-primary font-semibold hover:underline underline-offset-2"
                >
                  privacy@joblify.in
                </a>{" "}
                and we will delete it promptly.
              </Clause>
            </Section>

            {/* 10 — International */}
            <Section
              id="international"
              number="10"
              icon={<IconWorld size={17} className="text-primary" />}
              title="International Data Transfers"
            >
              <Clause>
                Joblify is headquartered in India. If you access the Platform
                from outside India, your data may be transferred to and
                processed in India.
              </Clause>
              <Clause>
                We ensure appropriate safeguards are in place for any
                international data transfers, including Standard Contractual
                Clauses where applicable.
              </Clause>
            </Section>

            {/* 11 — Changes */}
            <Section
              id="changes"
              number="11"
              icon={<IconAlertCircle size={17} className="text-primary" />}
              title="Changes to This Policy"
            >
              <Clause>
                We may update this Privacy Policy from time to time. We will
                notify you of material changes by email or a prominent notice on
                the Platform at least 14 days before they take effect.
              </Clause>
              <Clause>
                The "Last Updated" date at the top of this page reflects the
                most recent revision. Your continued use of the Platform after
                any change constitutes acceptance of the updated Policy.
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
                    Contact & Data Protection Officer
                  </h2>
                </div>
              </div>
              <p className="text-sm text-[#475569] leading-relaxed mb-5">
                For any privacy-related queries or to exercise your rights,
                contact our Data Protection Officer:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    label: "Privacy & DPO",
                    value: "privacy@joblify.in",
                    href: "mailto:privacy@joblify.in",
                  },
                  {
                    label: "Security issues",
                    value: "security@joblify.in",
                    href: "mailto:security@joblify.in",
                  },
                  {
                    label: "General support",
                    value: "hello@joblify.in",
                    href: "mailto:hello@joblify.in",
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

              <div className="mt-4 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <p className="text-xs text-[#64748B] leading-relaxed">
                  <strong className="text-[#0F172A]">Postal address:</strong>{" "}
                  Joblify, Inc. · 123 Business Street, Suite 100 · City, State
                  12345, India
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
