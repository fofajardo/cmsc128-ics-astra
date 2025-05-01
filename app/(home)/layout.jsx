"use client";

import NavbarUser from "../components/NavbarUser";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";
import "../styles/globals.css";
import "../styles/styles.css";
import { useSignedInUser } from "@/components/UserContext";
import Navbar from "@/components/Navbar.jsx";

export default function RootLayout({ children }) {
  const user = useSignedInUser();
  const pathname = usePathname();
  const isRequestPage = pathname.startsWith("/projects/request");

  if (isRequestPage) {
    return children;
  }

  return (
    <>
      {
        user?.state?.user ? (
          <NavbarUser />
        ) : (
          <Navbar />
        )
      }
      <main>{children}</main>
      <Footer />
    </>
  );
}
