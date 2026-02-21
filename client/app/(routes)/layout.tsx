import React from "react";
import Header from "@/modules/landing/components/header";
import { Footer } from "@/modules/landing/components/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;