
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
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* ── Desktop Sidebar ── */}
          <aside className="w-[260px] shrink-0 min-h-[calc(100vh-3.5rem)] sticky top-14 hidden lg:flex flex-col bg-card/50 backdrop-blur-sm border-r border-border">
            {/* Sidebar Header */}
            <div className="px-5 pt-6 pb-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground leading-none">
                    Admin Panel
                  </h2>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Platform Management
                  </p>
                </div>
              </div>
            </div>

            {/* Nav Links — grouped by section */}
            <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
              {navItems.map((section) => (
                <div key={section.section}>
                  <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    {section.section}
                  </p>
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                            active
                              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                              : "text-muted-foreground hover:bg-accent hover:text-foreground",
                          )}
                        >
                          <item.icon
                            size={18}
                            strokeWidth={active ? 2.5 : 1.8}
                          />
                          <span className="flex-1">{item.label}</span>
                          {active && (
                            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="px-5 py-4 border-t border-border">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground/50">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                System Online
              </div>
            </div>
          </aside>

          {/* ── Mobile Top Bar ── */}
          <div className="lg:hidden fixed top-14 left-0 right-0 z-40 bg-card/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold text-foreground">
                Admin Panel
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-foreground hover:bg-accent transition-colors"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* ── Mobile Dropdown Menu ── */}
          {mobileOpen && (
            <>
              <div
                className="lg:hidden fixed inset-0 top-30 z-30 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
              />
              <div className="lg:hidden fixed top-30 left-0 right-0 z-40 bg-card border-b border-border px-3 py-3 space-y-1 shadow-2xl animate-in slide-in-from-top-2 duration-200">
                {allNavItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* ── Main Content ── */}
          <main className="flex-1 min-w-0 mt-[52px] lg:mt-0">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
