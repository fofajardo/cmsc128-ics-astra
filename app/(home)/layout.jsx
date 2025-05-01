"use client";

import Footer from "../components/Footer";
import { usePathname } from "next/navigation";
import "../styles/globals.css";
import "../styles/styles.css";
import HeaderUser from "@/components/HeaderUser.jsx";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isRequestPage = pathname.startsWith("/projects/request");

  if (isRequestPage) {
    return children;
  }

  return (
    <>
      <HeaderUser />
      <main>{children}</main>
      <Footer />
    </>
  );
}
