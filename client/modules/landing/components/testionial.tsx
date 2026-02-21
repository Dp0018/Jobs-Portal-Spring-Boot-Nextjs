"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconStar, IconMail } from "@tabler/icons-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "TechCorp",
    image: "https://api.dicebear.com/7/avataaars/svg?seed=Sarah",
    rating: 5,
    text: "Found my dream job within 2 weeks! The platform's matching algorithm is incredibly accurate and saved me hours of searching.",
  },
  {
    name: "Michael Rodriguez",
    role: "Product Manager",
    company: "InnovateLabs",
    image: "https://api.dicebear.com/7/avataaars/svg?seed=Michael",
    rating: 5,
    text: "The quality of job listings here is exceptional. Every opportunity was relevant to my skills and career goals.",
  },
  {
    name: "Emily Thompson",
    role: "UX Designer",
    company: "DesignHub",
    image: "https://api.dicebear.com/7/avataaars/svg?seed=Emily",
    rating: 5,
    text: "Simple, clean interface and amazing support team. This platform made my job search stress-free and efficient.",
  },
];

export const Testimonial = () => {
  const [email, setEmail] = React.useState("");

  const handleSubscribe = () => {
    if (email) {
      alert(`Subscribed with: ${email}`);
      setEmail("");
    }
  };

  return (
    <div className="bg-background">

      {/* ── Testimonials Section ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-24">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Loved by Job Seekers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals who found their perfect role
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-card border border-border hover:border-primary/50 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <IconStar
                    key={i}
                    size={18}
                    className="fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-auto">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                    {testimonial.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-foreground text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Newsletter Section ── */}
      <div className="bg-linear-to-br from-card to-background border-t border-border">
        <div className="max-w-2xl mx-auto px-6 py-16 md:py-20 text-center">

          {/* Icon */}
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <IconMail size={28} className="text-primary" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Stay Updated
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto mb-8">
            Get the latest job opportunities and career insights delivered to
            your inbox weekly
          </p>

          {/* Email row */}
          <div className="flex gap-2 w-full max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              className="flex-1 bg-card/50 border-border focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground text-foreground"
            />
            <Button
              onClick={handleSubscribe}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shrink-0"
            >
              Subscribe
            </Button>
          </div>

          <p className="text-muted-foreground text-xs mt-4">
            No spam, unsubscribe anytime
          </p>
        </div>
      </div>
    </div>
  );
};
