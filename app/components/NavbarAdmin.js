"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import logo from "../assets/logo.png";
import avatar from "../assets/avatar.png";
import {
  Menu,
  Home,
  Users,
  Search,
  Key,
  Calendar,
  Briefcase,
  Gift,
  MessageCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function NavbarAdmin() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [openSubmenus, setOpenSubmenus] = useState({});
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const navigateTo = (label) => {
    setActiveMenu(label);
    const route = `/${label.toLowerCase().replace(/ /g, "-")}`;
    router.push(route);
    setIsSidebarOpen(false);
  };

  const menuItems = [
    {
      icon: <Home size={18} />, label: "Dashboard"
    },
    {
      icon: <Users size={18} />, label: "Alumni", children: [
        { icon: <Search size={16} />, label: "Search" },
        { icon: <Key size={16} />, label: "Manage Access" },
      ]
    },
    { icon: <Calendar size={18} />, label: "Events" },
    { icon: <Briefcase size={18} />, label: "Jobs" },
    { icon: <Gift size={18} />, label: "Projects" },
    { icon: <MessageCircle size={18} />, label: "Communications" },
  ];

  return (
    <>
      {/* Top Nav */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "shadow-lg bg-white/80 backdrop-blur-md" : "bg-white"
        }`}
        style={{ height: "80px" }}
      >
        <div className="flex items-center justify-between h-full w-full px-4 md:px-6">
          {/* Left: Menu & Logo */}
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="mr-[25px]">
              <Menu
                size={26}
                strokeWidth={2.3}
                className="text-black cursor-pointer hover:opacity-70 transition-all duration-200"
              />
            </button>
            <Image
              src={logo}
              alt="Admin Logo"
              width={50}
              height={50}
              className="rounded-full cursor-pointer"
            />
          </div>

          {/* Right: Avatar */}
          <Image
            src={avatar}
            alt="Admin Avatar"
            width={46}
            height={46}
            className="rounded-full border-2 border-[var(--color-astraprimary)] shadow-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_12px_var(--color-astraprimary)] cursor-pointer"
          />
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed top-[80px] left-0 z-40 h-[calc(100vh-80px)] w-[250px] transition-transform duration-300 bg-white overflow-y-auto border-t border-gray-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="p-6 space-y-4 text-gray-600 font-medium">
          {menuItems.map((item, index) => (
            <li key={index}>
              <div
                className={`flex items-center justify-between cursor-pointer rounded-md p-2 transition-all ${
                  activeMenu === item.label
                    ? "bg-[var(--color-astraprimary-light)] text-[var(--color-astraprimary)] font-semibold"
                    : "hover:bg-[#dce4ff] hover:text-blue-600"
                }`}
                onClick={() => {
                  if (item.children) {
                    toggleSubmenu(item.label);
                  } else {
                    navigateTo(item.label);
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.children && (
                  <span>
                    {openSubmenus[item.label] ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </span>
                )}
              </div>

              {/* Submenu */}
              {item.children && openSubmenus[item.label] && (
                <ul className="ml-6 mt-2 space-y-3 border-l border-gray-300 pl-4">
                  {item.children.map((child, idx) => (
                    <li
                      key={idx}
                      className={`flex items-center space-x-3 text-sm cursor-pointer transition-all pl-1 ${
                        activeMenu === child.label
                          ? "text-[var(--color-astraprimary)] font-semibold"
                          : "text-gray-500 hover:text-blue-600 hover:scale-[1.02]"
                      }`}
                      onClick={() => navigateTo(child.label)}
                    >
                      {child.icon}
                      <span>{child.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
