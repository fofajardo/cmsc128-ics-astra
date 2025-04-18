"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import avatar from "../assets/avatar.png"; // Replace with your actual avatar path

export default function NavbarUser() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Projects", href: "/projects" },
    { name: "What’s Up?", href: "/whatsup" },
  ];

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "shadow-lg bg-white/80 backdrop-blur-md" : "bg-[var(--color-astrawhite)]"
      }`}
      style={{ height: "80px" }}
    >
      <div className="flex items-center justify-between max-w-screen-xl mx-auto h-full px-12 w-[1440px]">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 cursor-pointer">
          <Image src={logo} alt="Logo" width={60} height={60} className="rounded-full" />
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-[75px] text-[15px] font-semibold relative">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setActiveLink(link.href)}
              className={`relative transition-all duration-300 ease-in-out text-[var(--color-astrablack)] hover:text-[var(--color-astraprimary)]
              ${activeLink === link.href ? "text-[var(--color-astraprimary)]" : ""} group`}
            >
              <span className="z-10 relative">{link.name}</span>
              {/* Active Underline */}
              <span
                className={`absolute left-1/2 -translate-x-1/2 bottom-[-16px] h-[8px] w-[100px] rounded-tl-[10px] rounded-tr-[10px] transition-all duration-300
                ${activeLink === link.href ? "bg-[var(--color-astraprimary)] opacity-100" : "opacity-0"}`}
              />
            </Link>
          ))}
        </div>

        {/* Avatar */}
        <div className="flex items-center">
          <Image
            src={avatar}
            alt="User Avatar"
            width={46}
            height={46}
            className="rounded-full border-2 border-[var(--color-astraprimary)] shadow-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_12px_var(--color-astraprimary)] cursor-pointer"
          />
        </div>
      </div>
    </nav>
  );
}
