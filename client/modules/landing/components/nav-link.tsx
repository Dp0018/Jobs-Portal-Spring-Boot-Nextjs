"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Find Job", url: "/find-jobs" },
  { name: "Find Talent", url: "/find-talent" },
  { name: "Post Job", url: "/post-job" },
  { name: "About us", url: "/about" },
];

const NavLink = () => {
  const pathname = usePathname();

  return (
    <>
      {links.map((link, index) => (
        <Link
          href={link.url}
          key={index}
          className={`relative h-full flex items-center px-4 transition-colors hover:text-foreground ${
            pathname.includes(link.url) ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {link.name}
          {pathname.includes(link.url) && (
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
          )}
        </Link>
      ))}
    </>
  );
};

export default NavLink;