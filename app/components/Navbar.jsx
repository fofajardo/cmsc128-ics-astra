"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import logo from "../assets/logo.png"; // Use your logo (Rocket logo as per your request)
import { Menu, X } from "lucide-react"; // Using lucide-react for icons

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar menu

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Projects", href: "/projects" },
    { name: "What’s Up?", href: "/whats-up" }
  ];

  // Handle scrolling effect for navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle Sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <nav
      className={"sticky top-0 z-50 w-full transition-all duration-300 bg-astrawhite shadow-md"}
      style={{ height: "80px" }}
    >
      <div className="flex items-center justify-between max-w-screen-xl mx-auto h-full px-4 sm:px-12 w-full">
        {/* Hamburger Icon (Visible on small screens) */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden flex items-center space-x-2 p-2"
        >
          {isSidebarOpen ? (
            <X size={22} className="text-astrablack" /> // Smaller X icon
          ) : (
            <Menu size={22} className="text-astrablack" /> // Smaller Menu icon
          )}
        </button>

        {/* Logo (Lean towards the left) */}
        <Link href="/" className="flex items-center space-x-3 cursor-pointer">
          <Image src={logo} alt="Logo" width={50} height={50} className="rounded-full" /> {/* Smaller logo */}
        </Link>

        {/* Navigation Links (Visible on larger screens) */}
        <div className="hidden lg:flex gap-[50px] text-[14px] font-semibold relative"> {/* Reduced gap and font size */}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setActiveLink(link.href)}
              className={`relative transition-all duration-300 ease-in-out text-astrablack hover:text-astraprimary
              ${activeLink === link.href ? "text-astraprimary" : ""}
              group`}
            >
              <span className="z-10 relative">{link.name}</span>
              {/* Active Underline */}
              <span
                className={`absolute left-1/2 -translate-x-1/2 bottom-[-16px] h-[8px] w-[100px] rounded-tl-[10px] rounded-tr-[10px] transition-all duration-300
                ${
            activeLink === link.href
              ? "bg-astraprimary opacity-100"
              : "opacity-0"
            }`}
              />
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <Link href="/signin">
            <button className="cursor-pointer px-4 py-1 min-w-[90px] h-[35px] font-semibold text-astrawhite bg-astraprimary border-2 border-astraprimary rounded-[12px] transition-all duration-300 transform hover:scale-105 hover:shadow-astraprimary">
              Sign In
            </button>
          </Link>
          <Link href="/signup">
            <button className="cursor-pointer px-4 py-1 min-w-[90px] h-[35px] font-semibold text-astraprimary bg-astrawhite border-2 border-astraprimary rounded-[12px] transition-all duration-300 transform hover:scale-105 hover:shadow-astraprimary">
              Sign Up
            </button>
          </Link>
        </div>
      </div>

      {/* Sidebar for small screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden" // Overlay with a solid background (adjust the opacity as needed)
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
    </nav>
  );
}
