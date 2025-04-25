"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  ChevronUp,
} from "lucide-react";

// Menu items data
const menuItems = [
  { icon: <Home size={18} />, label: "Dashboard", path: "/admin/dashboard" },
  {
    icon: <Users size={18} />,
    label: "Alumni",
    path: "/admin/alumni",
    children: [
      { icon: <Search size={16} />, label: "Search", path: "/admin/alumni/search" },
      { icon: <Key size={16} />, label: "Manage Access", path: "/admin/alumni/manage-access" },
    ],
  },
  { icon: <Calendar size={18} />, label: "Events", path: "/admin/events" },
  { icon: <Briefcase size={18} />, label: "Jobs", path: "/admin/jobs" },
  { icon: <Gift size={18} />, label: "Projects", path: "/admin/projects" },
  { icon: <MessageCircle size={18} />, label: "Communications", path: "/admin/communications" },
];

function Navbar({ toggleSidebar, isSidebarOpen, isScrolled }) {
  return (
    <nav
      className={`fixed top-0 z-50 w-full h-20 flex items-center justify-between px-4 md:px-6 transition-all duration-300 ${
        isScrolled
          ? "bg-astrawhite/80 backdrop-blur-md shadow-lg"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="transition-transform duration-200"
        >
          <div
            className={`transition-transform duration-300 ${
              isSidebarOpen ? "rotate-90" : "rotate-0"
            }`}
          >
            {isSidebarOpen ? (
              <X
                size={26}
                strokeWidth={2.3}
                className="text-astrablack hover:opacity-70 transition-opacity duration-300"
              />
            ) : (
              <Menu
                size={26}
                strokeWidth={2.3}
                className="text-astrablack hover:opacity-70 transition-opacity duration-300"
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
      <Image
        src={avatar}
        alt="Admin Avatar"
        width={46}
        height={46}
        className="rounded-full border-2 border-astraprimary shadow-md transition-transform duration-300 hover:scale-105 cursor-pointer"
      />
    </nav>
  );
}

function Sidebar({
  menuItems,
  activeMenu,
  toggleSubmenu,
  openSubmenus,
  navigateTo,
  isSidebarOpen,
}) {
  return (
    <div
      className={`fixed top-0 left-0 z-40 h-screen pt-20 w-[250px] bg-astratintedwhite border-t border-astradarkgray shadow-2xl overflow-y-auto transition-transform duration-300 ${
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
  const pathname = usePathname();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set active menu based on current pathname
  useEffect(() => {
    const findActiveMenu = () => {
      // Flatten menu items including children for easier lookup
      const allItems = menuItems.reduce((acc, item) => {
        if (item.children) {
          acc.push(...item.children); // Only include submenu items
        } else {
          acc.push(item); // Include top-level items
        }
        return acc;
      }, []);

      // Find the menu item whose path is the closest match to the current pathname
      const matchingItem = allItems.find((item) =>
        pathname.startsWith(item.path)
      );

      if (matchingItem) {
        setActiveMenu(matchingItem.label);
        // Open parent submenu if the active item is a child
        if (matchingItem.path.includes("/alumni/")) {
          setOpenSubmenus((prev) => ({ ...prev, Alumni: true }));
        } else {
          // Close Alumni submenu if a non-submenu item is active
          setOpenSubmenus((prev) => ({ ...prev, Alumni: false }));
        }
      } else {
        setActiveMenu("Dashboard"); // Fallback to Dashboard
        setOpenSubmenus((prev) => ({ ...prev, Alumni: false }));
      }
    };

    findActiveMenu();
  }, [pathname]);

  // Toggle Sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Toggle Submenu visibility
  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Navigate to a route
  const navigateTo = (label) => {
    setActiveMenu(label);
    const item = menuItems
      .reduce((acc, curr) => {
        acc.push(curr);
        if (curr.children) acc.push(...curr.children);
        return acc;
      }, [])
      .find((i) => i.label === label);
    if (item && item.path) {
      router.push(item.path);
    }
    setIsSidebarOpen(false);
  };

  return (
    <>
      <Navbar
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        isScrolled={isScrolled}
      />
      <Sidebar
        menuItems={menuItems}
        activeMenu={activeMenu}
        toggleSubmenu={toggleSubmenu}
        openSubmenus={openSubmenus}
        navigateTo={navigateTo}
        isSidebarOpen={isSidebarOpen}
      />
      <div
        className={`fixed inset-0 z-30 bg-astrablack/50 transition-opacity duration-200 ease-in-out md:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />
    </>
  );
}