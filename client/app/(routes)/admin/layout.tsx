"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/modules/auth/components/AuthGuard";
import {
  Users,
  FileText,
  Settings,
  UserPlus,
  LayoutDashboard,
  Shield,
  ShieldAlert,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    section: "Main",
    items: [
      { label: "Overview", href: "/admin", icon: LayoutDashboard },
      { label: "User Management", href: "/admin/users", icon: Users },
      { label: "Platform Jobs", href: "/admin/jobs", icon: FileText },
    ],
  },
  {
    section: "AI & Security",
    items: [
      {
        label: "Fraud Monitor",
        href: "/admin/fraud-monitor",
        icon: ShieldAlert,
        badge: "AI",
      },
    ],
  },
  {
    section: "Administration",
    items: [
      { label: "Add Admin", href: "/admin/add-admin", icon: UserPlus },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

const allNavItems = navItems.flatMap((s) => s.items);

function NavLink({
  item,
  active,
  onClick,
}: {
  item: (typeof allNavItems)[0];
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 select-none",
        active
          ? "bg-[#2563EB] text-white shadow-sm"
          : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]",
      )}
    >
      {/* Active left accent bar */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-white/40" />
      )}

      <item.icon
        size={17}
        strokeWidth={active ? 2.2 : 1.8}
        className={cn(
          "shrink-0 transition-colors",
          active ? "text-white" : "text-[#94A3B8] group-hover:text-[#475569]",
        )}
      />

      <span className="flex-1 truncate">{item.label}</span>

      {"badge" in item && item.badge && !active && (
        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
          {item.badge}
        </span>
      )}

      {active && (
        <ChevronRight className="w-3.5 h-3.5 text-white/60 shrink-0" />
      )}
    </Link>
  );
}

function SidebarContent({
  isActive,
  onLinkClick,
}: {
  isActive: (href: string) => boolean;
  onLinkClick?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Shield className="w-4.5 h-4.5 text-white" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h2 className="text-[13px] font-bold text-[#0F172A] leading-none tracking-tight">
              Admin Panel
            </h2>
            <p className="text-[11px] text-[#94A3B8] mt-0.5 font-medium">
              Platform Management
            </p>
          </div>
          {/* Live badge */}
          <div className="ml-auto flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-[#94A3B8] font-medium">Live</span>
          </div>
        </div>
      </div>

      <Separator className="bg-[#E2E8F0]" />

      {/* Nav Groups */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {navItems.map((section) => (
          <div key={section.section}>
            <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#CBD5E1]">
              {section.section}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={isActive(item.href)}
                  onClick={onLinkClick}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <Separator className="bg-[#E2E8F0]" />

      {/* Footer */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-2.5 text-[11px] text-[#94A3B8]">
          <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-[#94A3B8]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-medium text-[#475569] text-xs leading-none">
              Secure Session
            </p>
            <p className="text-[10px] mt-0.5 text-[#CBD5E1]">
              All activity is logged
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="flex">
          {/* ── Desktop Sidebar ── */}
          <aside className="w-[256px] shrink-0 min-h-screen sticky top-0 hidden lg:flex flex-col bg-white border-r border-[#E2E8F0] shadow-sm">
            <SidebarContent isActive={isActive} />
          </aside>

          {/* ── Mobile Top Bar ── */}
          <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-[#E2E8F0] px-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-sm shadow-blue-500/20">
                <Shield className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <span className="text-sm font-bold text-[#0F172A] tracking-tight">
                Admin Panel
              </span>
            </div>

            {/* Mobile Sheet (Drawer) */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                >
                  {mobileOpen ? (
                    <X size={18} strokeWidth={2} />
                  ) : (
                    <Menu size={18} strokeWidth={2} />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-72 p-0 bg-white border-r border-[#E2E8F0]"
              >
                <SidebarContent
                  isActive={isActive}
                  onLinkClick={() => setMobileOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* ── Main Content ── */}
          <main className="flex-1 min-w-0 pt-14 lg:pt-0">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
