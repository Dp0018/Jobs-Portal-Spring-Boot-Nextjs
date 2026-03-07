"use client";

import { useEffect, useState } from "react";
import {
  Users,
  FileText,
  UserPlus,
  Shield,
  ShieldAlert,
  Loader2,
  TrendingUp,
  ArrowRight,
  Activity,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { getAllUsers } from "@/modules/admin/server/admin-service";
import { getAllJobs } from "@/modules/job/server/job-service";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    applicants: 0,
    employers: 0,
    admins: 0,
    totalJobs: 0,
    activeJobs: 0,
    flaggedJobs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllUsers(), getAllJobs()])
      .then(([users, jobs]) => {
        setStats({
          totalUsers: users.length,
          applicants: users.filter((u: any) => u.accountType === "APPLICANT")
            .length,
          employers: users.filter((u: any) => u.accountType === "EMPLOYER")
            .length,
          admins: users.filter((u: any) => u.accountType === "ADMIN").length,
          totalJobs: jobs.length,
          activeJobs: jobs.filter((j: any) => j.jobStatus === "ACTIVE").length,
          flaggedJobs: jobs.filter(
            (j: any) => j.fraudRisk === "MEDIUM" || j.fraudRisk === "HIGH",
          ).length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <Loader2 className="w-10 h-10 text-primary animate-spin relative" />
        </div>
        <p className="text-muted-foreground text-sm animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  const kpiCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      gradient: "from-primary/15 to-primary/5",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
      valueColor: "text-primary",
    },
    {
      title: "Applicants",
      value: stats.applicants,
      icon: Users,
      gradient: "from-chart-2/15 to-chart-2/5",
      iconBg: "bg-chart-2/15",
      iconColor: "text-chart-2",
      valueColor: "text-chart-2",
    },
    {
      title: "Employers",
      value: stats.employers,
      icon: Briefcase,
      gradient: "from-chart-3/15 to-chart-3/5",
      iconBg: "bg-chart-3/15",
      iconColor: "text-chart-3",
      valueColor: "text-chart-3",
    },
    {
      title: "Admins",
      value: stats.admins,
      icon: Shield,
      gradient: "from-chart-4/15 to-chart-4/5",
      iconBg: "bg-chart-4/15",
      iconColor: "text-chart-4",
      valueColor: "text-chart-4",
    },
  ];

  const jobCards = [
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: FileText,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      icon: Activity,
      color: "text-chart-2",
      bg: "bg-chart-2/10",
      border: "border-chart-2/20",
    },
    {
      title: "Flagged Jobs",
      value: stats.flaggedJobs,
      icon: ShieldAlert,
      color: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/20",
    },
  ];

  const quickLinks = [
    {
      label: "User Management",
      href: "/admin/users",
      icon: Users,
      desc: "View, search, and manage platform users",
      color: "group-hover:text-primary",
      iconBg: "bg-primary/10 group-hover:bg-primary/20",
    },
    {
      label: "Platform Jobs",
      href: "/admin/jobs",
      icon: FileText,
      desc: "Moderate and manage all job listings",
      color: "group-hover:text-chart-2",
      iconBg: "bg-chart-2/10 group-hover:bg-chart-2/20",
    },
    {
      label: "Fraud Monitor",
      href: "/admin/fraud-monitor",
      icon: ShieldAlert,
      desc: "Review AI-flagged suspicious job postings",
      color: "group-hover:text-destructive",
      iconBg: "bg-destructive/10 group-hover:bg-destructive/20",
    },
    {
      label: "Add Admin",
      href: "/admin/add-admin",
      icon: UserPlus,
      desc: "Create new administrator accounts",
      color: "group-hover:text-chart-4",
      iconBg: "bg-chart-4/10 group-hover:bg-chart-4/20",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Platform overview and quick actions
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-muted-foreground">
          <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
          Live
        </div>
      </div>

      {/* ── User KPI Cards ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            User Analytics
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card, idx) => (
            <div
              key={card.title}
              className={`relative overflow-hidden rounded-xl border border-border bg-gradient-to-br ${card.gradient} p-5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}
                >
                  <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>
              <div className={`text-3xl font-bold ${card.valueColor} mb-1`}>
                {card.value.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {card.title}
              </div>

              {/* Decorative corner circle */}
              <div
                className={`absolute -top-6 -right-6 w-20 h-20 rounded-full ${card.iconBg} opacity-40`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Job Stats ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Job Analytics
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {jobCards.map((card) => (
            <div
              key={card.title}
              className={`rounded-xl border ${card.border} ${card.bg} p-5 text-center hover:shadow-md transition-all duration-300`}
            >
              <div
                className={`w-10 h-10 mx-auto rounded-xl ${card.bg} flex items-center justify-center mb-3`}
              >
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className={`text-3xl font-bold ${card.color} mb-1`}>
                {card.value}
              </div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {card.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <ArrowRight className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Quick Actions
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex items-start gap-4"
            >
              <div
                className={`w-11 h-11 rounded-xl ${link.iconBg} flex items-center justify-center shrink-0 transition-colors duration-300`}
              >
                <link.icon
                  className={`w-5 h-5 text-muted-foreground ${link.color} transition-colors duration-300`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-semibold text-foreground mb-0.5 ${link.color} transition-colors`}
                >
                  {link.label}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {link.desc}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 mt-1 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
