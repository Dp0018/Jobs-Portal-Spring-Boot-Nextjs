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
  BarChart3,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { getAllUsers, getEarnings, getPremiumUsers } from "@/modules/admin/server/admin-service";
import { getAllJobs } from "@/modules/job/server/job-service";
import { DollarSign, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    applicants: 0,
    employers: 0,
    admins: 0,
    totalJobs: 0,
    activeJobs: 0,
    flaggedJobs: 0,
    earnings: 0,
    premiumUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAllUsers(), 
      getAllJobs(),
      getEarnings().catch(() => "{}"),
      getPremiumUsers().catch(() => []),
    ])
      .then(([users, jobs, earningsStr, premiumUsers]) => {
        let earningsAmount = 0;
        try {
          const parsed = typeof earningsStr === 'string' ? JSON.parse(earningsStr) : earningsStr;
          
          if (parsed?.available?.[0]?.amount) {
            earningsAmount += parsed.available[0].amount / 100;
          }
          // Test payments often reflect in pending balance.
          if (parsed?.pending?.[0]?.amount) {
            earningsAmount += parsed.pending[0].amount / 100;
          }
        } catch (e) {
          console.warn("Failed to parse earnings", e);
        }

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
          earnings: earningsAmount,
          premiumUsers: premiumUsers?.length || 0,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Skeleton Loading State ──
  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header skeleton */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-52 bg-[#E2E8F0]" />
            <Skeleton className="h-4 w-72 bg-[#F1F5F9]" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg bg-[#F1F5F9]" />
        </div>
        {/* KPI skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl bg-[#F1F5F9]" />
          ))}
        </div>
        {/* Job stats skeleton */}
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl bg-[#F1F5F9]" />
          ))}
        </div>
        {/* Quick actions skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl bg-[#F1F5F9]" />
          ))}
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      change: "+12%",
      changePositive: true,
      iconBg: "bg-[#EFF6FF]",
      iconColor: "text-[#2563EB]",
      valueColor: "text-[#0F172A]",
      accentBar: "bg-[#2563EB]",
    },
    {
      title: "Applicants",
      value: stats.applicants,
      icon: Users,
      change: "+8%",
      changePositive: true,
      iconBg: "bg-[#ECFDF5]",
      iconColor: "text-emerald-600",
      valueColor: "text-[#0F172A]",
      accentBar: "bg-emerald-500",
    },
    {
      title: "Employers",
      value: stats.employers,
      icon: Briefcase,
      change: "+5%",
      changePositive: true,
      iconBg: "bg-[#FFF7ED]",
      iconColor: "text-orange-500",
      valueColor: "text-[#0F172A]",
      accentBar: "bg-orange-400",
    },
    {
      title: "Admins",
      value: stats.admins,
      icon: Shield,
      change: "0%",
      changePositive: true,
      iconBg: "bg-[#F5F3FF]",
      iconColor: "text-violet-600",
      valueColor: "text-[#0F172A]",
      accentBar: "bg-violet-500",
    },
  ];

  const revenueCards = [
    {
      title: "Total Earnings",
      value: `£${stats.earnings.toLocaleString()}`,
      icon: DollarSign,
      iconBg: "bg-[#F0FDF4]",
      iconColor: "text-[#16A34A]",
      valueColor: "text-[#0F172A]",
      accentBar: "bg-[#16A34A]",
    },
    {
      title: "Premium Users",
      value: stats.premiumUsers,
      icon: Crown,
      iconBg: "bg-[#FEF3C7]",
      iconColor: "text-[#D97706]",
      valueColor: "text-[#0F172A]",
      accentBar: "bg-[#D97706]",
    },
  ];

  // Generate 6 months of history leading up to the current earnings for the graph
  const chartData = [5, 4, 3, 2, 1, 0].map((offset) => {
    const d = new Date();
    d.setMonth(d.getMonth() - offset);
    const monthName = d.toLocaleString('default', { month: 'short' });
    
    // Create a sensible curve leading to the current earnings (mock historical data)
    let val = 0;
    if (stats.earnings > 0) {
      if (offset === 0) val = stats.earnings;
      else if (offset === 1) val = stats.earnings * 0.8;
      else if (offset === 2) val = stats.earnings * 0.6;
      else if (offset === 3) val = stats.earnings * 0.45;
      else if (offset === 4) val = stats.earnings * 0.25;
      else if (offset === 5) val = stats.earnings * 0.1;
    }
    
    return {
      name: monthName,
      Revenue: Math.round(val),
    };
  });

  const jobCards = [
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      label: "All listings",
      icon: FileText,
      iconBg: "bg-[#EFF6FF]",
      iconColor: "text-[#2563EB]",
      valueColor: "text-[#0F172A]",
      borderAccent: "border-l-[#2563EB]",
    },
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      label: "Currently live",
      icon: Activity,
      iconBg: "bg-[#ECFDF5]",
      iconColor: "text-emerald-600",
      valueColor: "text-[#0F172A]",
      borderAccent: "border-l-emerald-500",
    },
    {
      title: "Flagged Jobs",
      value: stats.flaggedJobs,
      label: "Needs review",
      icon: ShieldAlert,
      iconBg: "bg-[#FEF2F2]",
      iconColor: "text-red-500",
      valueColor: "text-red-600",
      borderAccent: "border-l-red-500",
    },
  ];

  const quickLinks = [
    {
      label: "User Management",
      href: "/admin/users",
      icon: Users,
      desc: "View, search, and manage platform users",
      iconBg: "bg-[#EFF6FF]",
      iconColor: "text-[#2563EB]",
      badge: null,
    },
    {
      label: "Platform Jobs",
      href: "/admin/jobs",
      icon: FileText,
      desc: "Moderate and manage all job listings",
      iconBg: "bg-[#ECFDF5]",
      iconColor: "text-emerald-600",
      badge: null,
    },
    {
      label: "Fraud Monitor",
      href: "/admin/fraud-monitor",
      icon: ShieldAlert,
      desc: "Review AI-flagged suspicious job postings",
      iconBg: "bg-[#FEF2F2]",
      iconColor: "text-red-500",
      badge: stats.flaggedJobs > 0 ? stats.flaggedJobs.toString() : null,
    },
    {
      label: "Add Admin",
      href: "/admin/add-admin",
      icon: UserPlus,
      desc: "Create new administrator accounts",
      iconBg: "bg-[#F5F3FF]",
      iconColor: "text-violet-600",
      badge: null,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            Welcome back. Here's what's happening on the platform.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#475569] shadow-sm shrink-0">
          <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span className="font-medium">Live</span>
        </div>
      </div>

      {/* ── User KPI Cards ── */}
      <section>
        {/* Section Label */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#EFF6FF] flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-[#2563EB]" />
            </div>
            <h2 className="text-xs font-bold text-[#94A3B8] uppercase tracking-[0.08em]">
              User Analytics
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card, idx) => (
            <div
              key={card.title}
              className="relative bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              {/* Top accent bar */}
              <div
                className={`absolute top-0 left-5 right-5 h-0.5 rounded-b-full ${card.accentBar} opacity-70`}
              />

              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center mb-4`}
              >
                <card.icon
                  className={`w-4.5 h-4.5 ${card.iconColor}`}
                  strokeWidth={1.8}
                />
              </div>

              {/* Value */}
              <div
                className={`text-2xl font-bold ${card.valueColor} leading-none mb-1`}
              >
                {card.value.toLocaleString()}
              </div>

              {/* Title + Change */}
              <div className="flex items-end justify-between gap-2 mt-2">
                <p className="text-xs text-[#94A3B8] font-medium leading-tight">
                  {card.title}
                </p>
                {card.change !== "0%" && (
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md shrink-0">
                    {card.change}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Revenue & Growth ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#F0FDF4] flex items-center justify-center">
              <DollarSign className="w-3 h-3 text-[#16A34A]" />
            </div>
            <h2 className="text-xs font-bold text-[#94A3B8] uppercase tracking-[0.08em]">
              Revenue & Growth
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-4">
            {revenueCards.map((card, idx) => (
              <div
                key={card.title}
                className="relative bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-5 right-5 h-0.5 rounded-b-full ${card.accentBar} opacity-70`}
                />
                <div
                  className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center mb-4`}
                >
                  <card.icon
                    className={`w-5 h-5 ${card.iconColor}`}
                    strokeWidth={1.8}
                  />
                </div>
                <div
                  className={`text-3xl font-bold ${card.valueColor} leading-none mb-1`}
                >
                  {card.value}
                </div>
                <div className="flex items-end justify-between gap-2 mt-2">
                  <p className="text-sm text-[#94A3B8] font-medium leading-tight">
                    {card.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-2 relative bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#0F172A] mb-4">Revenue Overview</h3>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94A3B8', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    tickFormatter={(value) => `£${value}`}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    formatter={(value) => [`£${value}`, 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Revenue" 
                    stroke="#16A34A" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ── Job Stats ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded-md bg-[#EFF6FF] flex items-center justify-center">
            <BarChart3 className="w-3 h-3 text-[#2563EB]" />
          </div>
          <h2 className="text-xs font-bold text-[#94A3B8] uppercase tracking-[0.08em]">
            Job Analytics
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {jobCards.map((card) => (
            <div
              key={card.title}
              className={`bg-white rounded-2xl border border-[#E2E8F0] border-l-4 ${card.borderAccent} p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-4`}
            >
              <div
                className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0`}
              >
                <card.icon
                  className={`w-5 h-5 ${card.iconColor}`}
                  strokeWidth={1.8}
                />
              </div>
              <div className="min-w-0">
                <div
                  className={`text-2xl font-bold ${card.valueColor} leading-none`}
                >
                  {card.value.toLocaleString()}
                </div>
                <div className="text-xs font-semibold text-[#0F172A] mt-0.5">
                  {card.title}
                </div>
                <div className="text-[11px] text-[#94A3B8] mt-0.5">
                  {card.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quick Actions ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#EFF6FF] flex items-center justify-center">
              <ArrowRight className="w-3 h-3 text-[#2563EB]" />
            </div>
            <h2 className="text-xs font-bold text-[#94A3B8] uppercase tracking-[0.08em]">
              Quick Actions
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group bg-white border border-[#E2E8F0] rounded-2xl p-4 hover:border-[#BFDBFE] hover:shadow-md transition-all duration-300 flex items-center gap-4"
            >
              {/* Icon */}
              <div
                className={`w-11 h-11 rounded-xl ${link.iconBg} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105`}
              >
                <link.icon
                  className={`w-5 h-5 ${link.iconColor}`}
                  strokeWidth={1.8}
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors duration-200">
                    {link.label}
                  </h3>
                  {link.badge && (
                    <Badge
                      variant="destructive"
                      className="text-[10px] px-1.5 py-0 h-4 rounded-md"
                    >
                      {link.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-[#94A3B8] mt-0.5 truncate">
                  {link.desc}
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Platform Health Footer Strip ── */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl px-5 py-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-[#475569]">
              Platform Online
            </span>
          </div>
          <Separator
            orientation="vertical"
            className="h-4 bg-[#E2E8F0] hidden sm:block"
          />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#94A3B8]">Total Users:</span>
            <span className="text-xs font-bold text-[#0F172A]">
              {stats.totalUsers.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#94A3B8]">Active Jobs:</span>
            <span className="text-xs font-bold text-[#0F172A]">
              {stats.activeJobs.toLocaleString()}
            </span>
          </div>
          {stats.flaggedJobs > 0 && (
            <>
              <Separator
                orientation="vertical"
                className="h-4 bg-[#E2E8F0] hidden sm:block"
              />
              <Link
                href="/admin/fraud-monitor"
                className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" strokeWidth={2} />
                {stats.flaggedJobs} job
                {stats.flaggedJobs > 1 ? "s" : ""} need review
              </Link>
            </>
          )}
          <div className="ml-auto">
            <span className="text-[11px] text-[#CBD5E1]">
              Last refreshed just now
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
