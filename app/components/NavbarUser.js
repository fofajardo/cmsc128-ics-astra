"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import logo from "../assets/logo.png";
import avatar from "../assets/avatar.png"; // Replace with your actual avatar path
import { Menu, X, LogOut, User, Settings } from "lucide-react"; // Using lucide-react for icons

export default function NavbarUser() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for dropdown menu
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar menu
  const dropdownRef = useRef(null); // Ref for detecting click outside dropdown

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Projects", href: "/projects" },
    { name: "What’s Up?", href: "/whats-up" },
  ];

  // Handle scrolling effect for navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            <X size={26} className="text-astrablack" />
          ) : (
            <Menu size={26} className="text-astrablack" />
          )}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 cursor-pointer">
          <Image src={logo} alt="Logo" width={60} height={60} className="rounded-full" />
        </Link>

        {/* Navigation Links (Visible on larger screens) */}
        <div className="hidden lg:flex gap-[75px] text-[15px] font-semibold relative">
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
        </div>

        {/* Avatar and Dropdown */}
        <div className="relative flex items-center">
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
                <User size={18} className="mr-2" />
                Profile
              </Link>
              <Link
                href="/settings"
                className="flex items-center p-2 w-full text-astrablack hover:bg-astraprimary hover:text-white rounded-md"
              >
                <Settings size={18} className="mr-2" />
                Settings
              </Link>
              <button
                onClick={() => console.log("Log Out")}
                className="flex items-center p-2 w-full text-astrared hover:bg-astrared hover:text-white rounded-md"
              >
                <LogOut size={18} className="mr-2" />
                Log Out
              </button>
            </div>
          )}
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
