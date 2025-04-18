"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png"; // Make sure the path is correct

export default function Navbar() {
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
          <Image src={logo} alt="Logo" width={56} height={56} className="rounded-full" />
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-[75px] text-[15px] font-semibold relative">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setActiveLink(link.href)}
              className={`relative transition-all duration-300 ease-in-out text-[var(--color-astrablack)] hover:text-[var(--color-astraprimary)] 
              ${activeLink === link.href ? "text-[var(--color-astraprimary)]" : ""}
              group`}
            >
              <span className="z-10 relative">{link.name}</span>
              {/* Active Underline */}
              <span
                className={`absolute left-1/2 -translate-x-1/2 bottom-[-16px] h-[8px] w-[100px] rounded-tl-[10px] rounded-tr-[10px] transition-all duration-300
                ${
                  activeLink === link.href
                    ? "bg-[var(--color-astraprimary)] opacity-100"
                    : "opacity-0"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <Link href="/signin">
            <button className="cursor-pointer px-5 py-1.5 min-w-[110px] h-[42px] font-bold text-white bg-[var(--color-astraprimary)] border-2 border-[var(--color-astraprimary)] rounded-[15px] transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_10px_var(--color-astraprimary)]">
              Sign In
            </button>
          </Link>
          <Link href="/signup">
            <button className="cursor-pointer px-5 py-1.5 min-w-[110px] h-[42px] font-bold text-[var(--color-astraprimary)] bg-white border-2 border-[var(--color-astraprimary)] rounded-[15px] transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_10px_var(--color-astraprimary)]">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
