"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import logo from "../assets/logo.png";
import avatar from "../assets/avatar.png"; // Replace with your actual avatar path
import { Menu, X, LogOut, User, Settings } from "lucide-react";
import axios from "axios";
import {useSignedInUser} from "@/components/UserContext.jsx";
import {LoadingSpinner} from "@/components/LoadingSpinner.jsx"; // Using lucide-react for icons

function HeaderMenu(toggleSidebar, isSidebarOpen) {
  return <button
    onClick={toggleSidebar}
    className="lg:hidden flex items-center space-x-2 p-2"
  >
    {isSidebarOpen ? (
      <X size={26} className="text-astrablack"/>
    ) : (
      <Menu size={26} className="text-astrablack"/>
    )}
  </button>;
}

function HeaderLogo() {
  return <Link href="/" className="flex items-center space-x-3 cursor-pointer">
    <Image src={logo} alt="Logo" width={60} height={60} className="rounded-full"/>
  </Link>;
}

function HeaderNavigation(navLinks, setActiveLink, activeLink) {
  return <div className="hidden lg:flex gap-[75px] text-[15px] font-semibold relative">
    {navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        onClick={() => setActiveLink(link.href)}
        className={`relative transition-all duration-300 ease-in-out text-astrablack hover:text-astraprimary
              ${activeLink === link.href ? "text-astraprimary" : ""} group`}
      >
        <span className="z-10 relative">{link.name}</span>
        {/* Active Underline */}
        <span
          className={`absolute left-1/2 -translate-x-1/2 bottom-[-16px] h-[8px] w-[100px] rounded-tl-[10px] rounded-tr-[10px] transition-all duration-300
                ${activeLink === link.href ? "bg-astraprimary opacity-100" : "opacity-0"}`}
        />
      </Link>
    ))}
  </div>;
}

function HeaderAuth() {
  return <div className="flex items-center space-x-3">
    <Link href="/sign-in">
      <button
        className="cursor-pointer px-4 py-1 min-w-[90px] h-[35px] font-semibold text-astrawhite bg-astraprimary border-2 border-astraprimary rounded-[12px] transition-all duration-300 transform hover:scale-105 hover:shadow-astraprimary">
        Sign In
      </button>
    </Link>
    <Link href="/sign-up">
      <button
        className="cursor-pointer px-4 py-1 min-w-[90px] h-[35px] font-semibold text-astraprimary bg-astrawhite border-2 border-astraprimary rounded-[12px] transition-all duration-300 transform hover:scale-105 hover:shadow-astraprimary">
        Sign Up
      </button>
    </Link>
  </div>;
}

function HeaderAvatar({user}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for dropdown menu
  const dropdownRef = useRef(null); // Ref for detecting click outside dropdown

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSignOut() {
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/sign-out`).then(() => {
      alert("Signed out");
    });
  }

  return <div className="relative flex items-center">
    <Image
      src={avatar}
      alt="User Avatar"
      width={46}
      height={46}
      className="rounded-full border-2 border-astraprimary shadow-md transition-all duration-300 hover:scale-105 cursor-pointer"
      onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle dropdown
    />

    {/* Avatar Dropdown Menu */}
    {isMenuOpen && (
      <div
        ref={dropdownRef}
        className="absolute top-full mt-2 right-0 p-2 w-36 bg-white rounded-lg shadow-lg border border-astragray z-10"
      >
        <Link
          href="/profile/alumni"
          className="flex items-center p-2 w-full text-astrablack hover:bg-astraprimary hover:text-white rounded-md"
        >
          <User size={18} className="mr-2"/>
          Profile
        </Link>
        <Link
          href="/settings"
          className="flex items-center p-2 w-full text-astrablack hover:bg-astraprimary hover:text-white rounded-md"
        >
          <Settings size={18} className="mr-2"/>
          Settings
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center p-2 w-full text-astrared hover:bg-astrared hover:text-white rounded-md"
        >
          <LogOut size={18} className="mr-2"/>
          Sign Out ({user?.state?.authUser?.id})
        </button>
      </div>
    )}
  </div>;
}

function HeaderSidebar(isSidebarOpen, toggleSidebar, navLinks, setActiveLink, activeLink) {
  return <>
    {isSidebarOpen && (
      <div
        className="fixed inset-0 z-40 bg-black/70 lg:hidden"
        onClick={toggleSidebar}
      />
    )}

    <div
      className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-md transition-transform duration-300 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col pt-20 px-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setActiveLink(link.href)}
            className={`py-2 text-astrablack ${activeLink === link.href ? "text-astraprimary" : ""}`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  </>;
}

export default function HeaderUser() {
  const user = useSignedInUser();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar menu

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Projects", href: "/projects" },
    { name: "Search Alumni", href: "/search" },
    { name: "What’s Up?", href: "/whats-up" },
    { name: "Jobs", href: "/jobs" },
  ];

  // Handle scrolling effect for navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle Sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  console.log(user.state);

  return (
    <header
      className={"sticky top-0 z-50 w-full transition-all duration-300 bg-astrawhite shadow-md"}
      style={{height: "80px"}}
    >
      <div className="flex items-center justify-between max-w-screen-xl mx-auto h-full px-4 sm:px-12 w-full">
        {HeaderMenu(toggleSidebar, isSidebarOpen)}
        {HeaderLogo()}
        {HeaderNavigation(navLinks, setActiveLink, activeLink)}
        {
          user?.state?.initialized
            ? user?.state?.user == null
              ? <HeaderAuth />
              : <HeaderAvatar user={user} />
            : <LoadingSpinner className="h-12 w-12" />
        }
      </div>

      {HeaderSidebar(isSidebarOpen, toggleSidebar, navLinks, setActiveLink, activeLink)}
    </header>
  );
}
