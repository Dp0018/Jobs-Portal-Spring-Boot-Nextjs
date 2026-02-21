import {
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandFacebook,
  IconBrandInstagram,
  IconMail,
  IconPhone,
  IconMapPin,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/Logo.svg"

export const Footer = () => {
  return (
    <footer className="pt-24 bg-background text-foreground pb-6">
      <div className="w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image src={Logo} alt="Joblify" width={28} height={28} />
              <h2 className="text-primary text-2xl font-bold">Joblify</h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Connecting talented professionals with their dream careers. Your
              success is our mission.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: IconBrandLinkedin, href: "#" },
                { Icon: IconBrandTwitter, href: "#" },
                { Icon: IconBrandFacebook, href: "#" },
                { Icon: IconBrandInstagram, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="bg-card text-muted-foreground p-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="text-primary/80 text-lg font-semibold mb-4">For Job Seekers</h3>
            <ul className="space-y-2">
              {["Browse Jobs", "Create Profile", "Career Resources", "Resume Builder", "Salary Guide"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-muted-foreground text-sm hover:text-primary transition-colors duration-200"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-primary/80 text-lg font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2">
              {["Post a Job", "Browse Candidates", "Pricing Plans", "Recruitment Solutions", "Employer Dashboard"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-muted-foreground text-sm hover:text-primary transition-colors duration-200"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-primary/80 text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <IconMapPin size={18} className="text-primary mt-1 shrink-0" />
                <p className="text-muted-foreground text-sm">
                  123 Business Street, Suite 100, City, State 12345
                </p>
              </div>
              <div className="flex items-center gap-2">
                <IconPhone size={18} className="text-primary shrink-0" />
                <p className="text-muted-foreground text-sm">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center gap-2">
                <IconMail size={18} className="text-primary shrink-0" />
                <p className="text-muted-foreground text-sm">contact@joblify.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">© 2026 Joblify. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-muted-foreground text-sm hover:text-primary transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
