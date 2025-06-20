"use client";

import Footer from "../components/Footer";
import { usePathname } from "next/navigation";
import "../styles/globals.css";
import "../styles/styles.css";
import {Header} from "@/components/Header.jsx";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isRequestPage = pathname.startsWith("/projects/request");

  if (isRequestPage) {
    return children;
  }

  return (
    <div className="relative min-h-screen max-w-screen">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
