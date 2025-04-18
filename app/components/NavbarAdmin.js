"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import logo from "../assets/logo.png";
import avatar from "../assets/avatar.png";
import {
  Menu,
  X,
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

// Menu items data
const menuItems = [
  { icon: <Home size={18} />, label: "Dashboard" },
  {
    icon: <Users size={18} />,
    label: "Alumni",
    children: [
      { icon: <Search size={16} />, label: "Search" },
      { icon: <Key size={16} />, label: "Manage Access" },
    ]
  },
  { icon: <Calendar size={18} />, label: "Events" },
  { icon: <Briefcase size={18} />, label: "Jobs" },
  { icon: <Gift size={18} />, label: "Projects" },
  { icon: <MessageCircle size={18} />, label: "Communications" }
];

function Navbar({ toggleSidebar, isSidebarOpen, isScrolled }) {
  return (
    <nav
      className={`fixed top-0 z-50 w-full h-20 flex items-center justify-between px-4 md:px-6 transition-all duration-300 ${
        isScrolled ? "shadow-lg bg-astrawhite/80 backdrop-blur-md" : "bg-white"
      }`}
    >
      {/* Left: Menu & Logo */}
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-6 transition-transform duration-200"
        >
          <div
            className={`transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? "rotate-90" : "rotate-0"
            }`}
          >
            {isSidebarOpen ? (
              <X
                size={26}
                strokeWidth={2.3}
                className="text-astrablack cursor-pointer hover:opacity-70 transition-colors duration-300"
              />
            ) : (
              <Menu
                size={26}
                strokeWidth={2.3}
                className={`text-astrablack cursor-pointer hover:opacity-70 transition-colors duration-300`}
              />
            )}
          </div>
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
        className={`rounded-full border-2 ${isScrolled ? 'border-astraprimary shadow-[0_0_8px_var(--color-astraprimary)]' : 'border-astrawhite shadow-md'} transition-all duration-300 hover:scale-105 cursor-pointer`}
      />
    </nav>
  );
}

function Sidebar({ menuItems, activeMenu, toggleSubmenu, openSubmenus, navigateTo, isSidebarOpen }) {
  return (
    <div
      className={`fixed top-0 left-0 z-40 h-screen pt-20 w-[250px] bg-astrawhite border-t border-gray-300 overflow-y-auto transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <ul className="p-6 space-y-4 text-gray-600 font-medium">
        {menuItems.map((item, index) => (
          <li key={index}>
            <div
              className={`flex items-center justify-between cursor-pointer rounded-md p-2 transition-all ${
                activeMenu === item.label
                  ? "bg-[var(--color-astraprimary-light)] text-astraprimary font-semibold"
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
                        ? "text-astraprimary font-semibold"
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
  );
}

export default function NavbarAdmin() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [openSubmenus, setOpenSubmenus] = useState({});
  const router = useRouter();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle Sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Toggle Submenu visibility
  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  // Navigate to a route
  const navigateTo = (label) => {
    setActiveMenu(label);
    const route =
      label === "Search" || label === "Manage Access"
        ? `/admin/alumni/${label.toLowerCase().replace(/ /g, "-")}`
        : `/admin/${label.toLowerCase().replace(/ /g, "-")}`;
    router.push(route);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Navbar Component */}
      <Navbar
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        isScrolled={isScrolled}
      />

      {/* Sidebar Component */}
      <Sidebar
        menuItems={menuItems}
        activeMenu={activeMenu}
        toggleSubmenu={toggleSubmenu}
        openSubmenus={openSubmenus}
        navigateTo={navigateTo}
        isSidebarOpen={isSidebarOpen}
      />

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
