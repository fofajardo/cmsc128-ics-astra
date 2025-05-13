"use client";

import Footer from "../components/Footer";
import { usePathname } from "next/navigation";
import "../styles/globals.css";
import "../styles/styles.css";
import {Header} from "@/components/Header.jsx";
import {RouteGuard} from "@/components/RouteGuard.jsx";

function RootLayout({ children }) {
  const pathname = usePathname();
  const isRequestPage = pathname.startsWith("/projects/request");

  if (isRequestPage) {
    return children;
  }

  return (
    <div className="relative min-h-screen max-w-screen overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default function LayoutWrapper({ children }) {
  return <RouteGuard
    component={
      <RootLayout>
        { children }
      </RootLayout>
    }
  />;
}
