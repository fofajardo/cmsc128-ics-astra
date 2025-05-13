"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import logo from "../assets/logo.png";
import avatar from "../assets/avatar.png";
import { Menu, X, LogOut, User, Settings } from "lucide-react";
import axios from "axios";
import {useSignedInUser} from "@/components/UserContext.jsx";
import {LoadingSpinner} from "@/components/LoadingSpinner.jsx";
import {feRoutes} from "../../common/routes.js";

function HeaderMenu({ toggleSidebar, isSidebarOpen }) {
  return (
    <button onClick={toggleSidebar} className="lg:hidden flex items-center space-x-2 p-3">
      {isSidebarOpen ? (
        <X size={28} className="text-astrablack" />
      ) : (
        <Menu size={28} className="text-astrablack" />
      )}
    </button>
  );
}

function HeaderLogo() {
  return (
    <Link href="/" className="flex items-center space-x-3 cursor-pointer">
      <Image src={logo} alt="Logo" width={40} height={40} className="rounded-full sm:w-[50px] sm:h-[50px]" />
      <span className="text-astrablack font-bold text-sm sm:text-lg">ICS-Astra</span>
    </Link>
  );
}

function HeaderNavigation({ navLinks, activeLink }) {
  return (
    <div className="hidden lg:flex gap-4 md:gap-8 font-sb relative items-center justify-center flex-1">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`relative transition-all duration-300 ease-in-out text-astrablack hover:text-astraprimary
              ${activeLink === link.href ? "text-astraprimary" : ""} group px-2 py-1`}
        >
          <span className="z-10 relative truncate line-clamp-1">{link.name}</span>
          <span
            className={`absolute left-0 bottom-[-12px] h-[6px] w-full rounded-tl-[8px] rounded-tr-[8px] transition-all duration-300
                ${activeLink === link.href ? "bg-astraprimary opacity-100" : "opacity-0"}`}
          />
        </Link>
      ))}
    </div>
  );
}

function HeaderAuth() {
  return (
    <div className="flex items-center space-x-2 md:space-x-3">
      <Link href={feRoutes.auth.signIn()}>
        <button
          className="cursor-pointer px-3 md:px-4 py-1 min-w-[80px] md:min-w-[90px] h-[32px] md:h-[35px] font-semibold text-astrawhite text-sm md:text-base bg-astraprimary border-2 border-astraprimary rounded-[12px] transition-all duration-300 transform hover:scale-105 hover:shadow-astraprimary truncate line-clamp-1"
        >
          Sign In
        </button>
      </Link>
      <Link href={feRoutes.auth.signUp()}>
        <button
          className="cursor-pointer px-3 md:px-4 py-1 min-w-[80px] md:min-w-[90px] h-[32px] md:h-[35px] font-semibold text-astraprimary text-sm md:text-base bg-astrawhite border-2 border-astraprimary rounded-[12px] transition-all duration-300 transform hover:scale-105 hover:shadow-astraprimary truncate line-clamp-1"
        >
          Sign Up
        </button>
      </Link>
    </div>
  );
}

function HeaderAvatar({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center">
      <Image
        src={avatar}
        alt="User Avatar"
        width={40}
        height={40}
        className="rounded-full border-2 border-astraprimary shadow-md transition-all duration-300 hover:scale-105 cursor-pointer"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      />
      {isMenuOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-3 right-0 p-3 w-40 bg-white rounded-lg shadow-xl border border-astragray z-10 transition-all duration-200 ease-in-out"
        >
          <Link
            href={`/admin/alumni/search/${user.state.user?.id}`}
            className="flex items-center p-2 w-full text-astrablack hover:bg-astraprimary hover:text-white rounded-md text-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            <User size={16} className="mr-2" />
            Profile
          </Link>
          <Link
            href="/settings"
            className="flex items-center p-2 w-full text-astrablack hover:bg-astraprimary hover:text-white rounded-md text-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            <Settings size={16} className="mr-2" />
            Settings
          </Link>
          <Link href="/sign-out">
            <button
              className="flex items-center p-2 w-full text-astrared hover:bg-astrared hover:text-white rounded-md text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

function HeaderSidebar({ isSidebarOpen, toggleSidebar, navLinks, activeLink }) {
  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center p-4 border-b border-astragray">
          <HeaderLogo />
        </div>
        <div className="flex flex-col pt-6 px-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={toggleSidebar}
              className={`py-2 px-3 text-astrablack text-[15px] font-medium rounded-md hover:bg-astraprimary/10
                ${activeLink === link.href ? "text-astraprimary bg-astraprimary/10" : ""}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default function HeaderUser() {
  const user = useSignedInUser();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Projects", href: "/projects" },
    { name: "Search Alumni", href: "/search" },
    { name: "What’s Up?", href: "/whats-up" },
    { name: "Jobs", href: "/jobs" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeLink = navLinks.find((link) => link.href === pathname)?.href || "/";

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 bg-astrawhite ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
      style={{ height: "72px" }}
    >
      <div className="flex items-center justify-between max-w-screen-xl mx-auto h-full px-4 sm:px-6 md:px-8 w-full">
        <div className="flex items-center space-x-4">
          <HeaderMenu toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <HeaderLogo />
        </div>
        <HeaderNavigation navLinks={navLinks} activeLink={activeLink} />
        <div className="flex items-center">
          {user?.state?.initialized ? (
            user?.state?.user == null ? (
              <HeaderAuth />
            ) : (
              <HeaderAvatar user={user} />
            )
          ) : (
            <LoadingSpinner className="h-10 w-10" />
          )}
        </div>
      </div>
      <HeaderSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        navLinks={navLinks}
        activeLink={activeLink}
      />
    </header>
  );
}