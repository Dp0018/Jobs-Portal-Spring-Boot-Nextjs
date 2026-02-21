"use client";

import {
  IconFileText,
  IconSend,
  IconCircleCheck,
  IconProgressCheck,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Girl from "@/public/Girl.png"

const steps = [
  {
    number: "01",
    icon: IconFileText,
    title: "Build Your Resume",
    description:
      "Create a standout resume with your skills, experience, and achievements that catches employers' attention.",
  },
  {
    number: "02",
    icon: IconSend,
    title: "Apply for Job",
    description:
      "Browse thousands of opportunities and apply to positions that match your skills with just one click.",
  },
  {
    number: "03",
    icon: IconCircleCheck,
    title: "Get Hired",
    description:
      "Connect with top employers, ace your interviews, and land your dream job with our comprehensive support.",
  },
];

export const HowItWorks = () => {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-background via-card to-background px-6 md:px-12 lg:px-20 py-20 md:py-32">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm mb-6">
            <span className="text-sm font-semibold text-primary">
              <IconProgressCheck className="inline-block h-4 w-4 mr-2 mb-0.5" />
              Simple Process
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            How It{" "}
            <span className="text-primary">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get hired in three simple steps. It's fast, easy, and designed to
            help you succeed.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Side - Image */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-8 bg-primary/20 rounded-3xl blur-3xl opacity-60" />

            <div className="relative bg-linear-to-br from-card/80 to-background/80 p-6 rounded-3xl shadow-2xl backdrop-blur-sm border border-border">
              <Image
                src={Girl}
                alt="How it works illustration"
                className="w-full h-auto rounded-2xl object-cover shadow-xl"
              />

              {/* Floating top-right badge */}
              <div className="absolute -top-4 -right-4 h-16 w-16 rounded-2xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/50 animate-bounce">
                <IconFileText className="h-8 w-8 text-primary-foreground" />
              </div>

              {/* Floating bottom-left badge */}
              <div
                className="absolute -bottom-4 -left-4 h-16 w-16 rounded-2xl bg-linear-to-br from-primary/80 to-primary/60 flex items-center justify-center shadow-lg shadow-primary/50 animate-bounce"
                style={{ animationDelay: "0.5s" }}
              >
                <IconCircleCheck className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* Right Side - Steps */}
          <div className="space-y-6 order-1 lg:order-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-linear-to-br from-card/50 to-background/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] cursor-pointer"
                >
                  {/* Connecting line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-13 top-22.5 h-12 w-0.5 bg-linear-to-b from-primary/30 to-transparent" />
                  )}

                  <div className="flex gap-6">
                    {/* Icon Circle */}
                    <div className="relative shrink-0 h-20 w-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="h-10 w-10 text-primary" />
                      {/* Number badge */}
                      <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-linear-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-xs font-bold shadow-lg">
                        {step.number}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-2">
                      <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <button
            onClick={() => router.push("/signup")}
            className="group bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 mx-auto transition-all hover:shadow-2xl hover:shadow-primary/40 hover:scale-105"
          >
            Start Your Journey
            <IconSend className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
