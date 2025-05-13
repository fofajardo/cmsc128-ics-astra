"use client";
import Link from "next/link";
import Image from "next/image";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import logo from "../assets/logo.png";
import {
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronUp,
  Gift,
  Home,
  Key,
  LogOut,
  Menu,
  MessageCircle,
  School,
  Search,
  Settings,
  User,
  Users,
  X
} from "lucide-react";
import {useSignedInUser} from "@/components/UserContext.jsx";
import {LoadingSpinner} from "@/components/LoadingSpinner.jsx";
import {feRoutes} from "../../common/routes.js";
import {useRouter} from "next/navigation";
import {NavMenuItemId} from "../../common/scopes.js";

const menuItemsMain = {
  [NavMenuItemId.HOME]: {
    label: "Home",
    path: "/"
  },
  [NavMenuItemId.ABOUT]: {
    label: "About",
    path: "/about"
  },
  [NavMenuItemId.EVENTS]: {
    label: "Events",
    path: "/events"
  },
  [NavMenuItemId.PROJECTS]: {
    label: "Projects",
    path: "/projects"
  },
  [NavMenuItemId.ALUMNI_DIRECTORY]: {
    label: "Search Alumni",
    path: "/search"
  },
  [NavMenuItemId.NEWS]: {
    label: "What's Up?",
    path: "/whats-up"
  },
  [NavMenuItemId.JOBS]: {
    label: "Jobs",
    path: "/jobs"
  }
};

const menuItemsAdmin = {
  [NavMenuItemId.HOME]: {
    icon: <Home size={18}/>,
    label: "Dashboard",
    path: "/admin/dashboard"
  },
  [NavMenuItemId.ALUMNI]: {
    icon: <Users size={18}/>,
    label: "Alumni",
    path: "/admin/alumni",
    children: [
      NavMenuItemId.ALUMNI_DIRECTORY,
      NavMenuItemId.ALUMNI_ACCESS,
    ]
  },
  [NavMenuItemId.ALUMNI_DIRECTORY]: {
    parent: NavMenuItemId.ALUMNI,
    icon: <Search size={16}/>,
    label: "Search",
    path: "/admin/alumni/search"
  },
  [NavMenuItemId.ALUMNI_ACCESS]: {
    parent: NavMenuItemId.ALUMNI,
    icon: <Key size={16}/>,
    label: "Manage Access",
    path: "/admin/alumni/manage-access"
  },
  [NavMenuItemId.EVENTS]: {
    icon: <Calendar size={18}/>,
    label: "Events",
    path: "/admin/events"
  },
  [NavMenuItemId.JOBS]: {
    icon: <Briefcase size={18}/>,
    label: "Jobs",
    path: "/admin/jobs"
  },
  [NavMenuItemId.PROJECTS]: {
    icon: <Gift size={18}/>,
    label: "Projects",
    path: "/admin/projects"
  },
  [NavMenuItemId.NEWS]: {
    icon: <MessageCircle size={18}/>,
    label: "What's up?",
    path: "/admin/whats-up"
  },
  [NavMenuItemId.ORGANIZATIONS]: {
    icon: <School size={18}/>,
    label: "Organizations",
    path: "/admin/organizations"
  }
};

export function ActiveNavItemMarker({id}) {
  const user = useSignedInUser();
  useLayoutEffect(() => {
    user.actions.setActiveNavItem(id);
  }, []);
}

function Sidebar({
  items,
  sidebarState,
  context,
}) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen, toggleSidebar] = sidebarState;

  const handleNavigate = function (aItem) {
    router.push(aItem.path);
    setIsSidebarOpen(false);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 z-40 h-screen pt-20 w-[250px] bg-astratintedwhite border-t border-astradarkgray shadow-2xl overflow-y-auto transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="p-6 space-y-4 text-gray-600 font-medium">
          {Object.entries(items).map(([key, navItem]) => {
            return (
              <li key={"sidebar-" + key}>
                <div
                  className={`flex items-center justify-between cursor-pointer rounded-md p-2 transition-all ${
                    context.state.activeNavItem === key
                      ? "bg-[var(--color-astraprimary-light)] text-astraprimary font-semibold"
                      : "hover:bg-[#dce4ff] hover:text-blue-600"
                  }`}
                  onClick={() => {
                    if (navItem.children) {
                      return context.actions.toggleNavSubmenu(key);
                    }
                    handleNavigate(navItem);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    {navItem.icon}
                    <span className="text-sm">{navItem.label}</span>
                  </div>
                  {navItem.children && (
                    <span>
                      {context.state.activeNavSubmenus?.[key] ? (
                        <ChevronUp size={18}/>
                      ) : (
                        <ChevronDown size={18}/>
                      )}
                    </span>
                  )}
                </div>
                {navItem.children && context.state.activeNavSubmenus?.[key] && (
                  <ul className="ml-6 mt-2 space-y-3 border-l border-gray-300 pl-4">
                    {navItem.children.map(function (childNavItemId, i) {
                      const childNavItem = items[childNavItemId];
                      return (
                        <li
                          key={i}
                          className={`flex items-center space-x-3 text-sm cursor-pointer transition-all pl-1 ${
                            context.state.activeNavItem === childNavItem.id
                              ? "text-astraprimary font-semibold"
                              : "text-gray-500 hover:text-blue-600 hover:scale-[1.02]"
                          }`}
                          onClick={() => handleNavigate(childNavItem)}
                        >
                          {childNavItem.icon}
                          <span>{childNavItem.label}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div
        className={`fixed inset-0 z-30 bg-astrablack/50 transition-opacity duration-200 ease-in-out md:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />
    </>
  );
}

function HeaderNavigation({items, context}) {
  return (
    <div className="hidden lg:flex gap-4 md:gap-8 font-sb relative items-center justify-center flex-1">
      {Object.entries(items).map(([key, value]) => {
        return (
          <Link
            key={"nav-" + key}
            href={value.path}
            className={`relative transition-all duration-300 ease-in-out text-astrablack hover:text-astraprimary
                ${context.state.activeNavItem === key ? "text-astraprimary" : ""} group px-2 py-1`}
          >
            <span className="z-10 relative truncate line-clamp-1">{value.label}</span>
            <span
              className={`absolute left-0 bottom-[-12px] h-[6px] w-full rounded-tl-[8px] rounded-tr-[8px] transition-all duration-300
                  ${context.state.activeNavItem === key ? "bg-astraprimary opacity-100" : "opacity-0"}`}
            />
          </Link>
        );
      })}
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

function HeaderAvatar({context}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleMenuClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center">
      <Image
        src={context.state.authUser?.avatar_url}
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
            href={`/admin/alumni/search/${context.state.user?.id}`}
            className="flex items-center p-2 w-full text-astrablack hover:bg-astraprimary hover:text-white rounded-md text-sm"
            onClick={handleMenuClose}
          >
            <User size={16} className="mr-2"/>
            Profile
          </Link>
          <Link
            href="/settings"
            className="flex items-center p-2 w-full text-astrablack hover:bg-astraprimary hover:text-white rounded-md text-sm"
            onClick={handleMenuClose}
          >
            <Settings size={16} className="mr-2"/>
            Settings
          </Link>
          <Link href="/sign-out">
            <button
              className="flex items-center p-2 w-full text-astrared hover:bg-astrared hover:text-white rounded-md text-sm"
              onClick={handleMenuClose}
            >
              <LogOut size={16} className="mr-2"/>
              Sign Out
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export function Header({fromAdmin}) {
  const context = useSignedInUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  let items = fromAdmin ? menuItemsAdmin : menuItemsMain;

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full h-20 flex items-center justify-between px-4 md:px-6 transition-all duration-300 ${
          isScrolled
            ? "bg-astrawhite/80 backdrop-blur-md shadow-lg"
            : "bg-white shadow-sm"
        }`}
        style={{height: "72px"}}
      >
        <div className="flex items-center justify-between max-w-screen-xl mx-auto h-full px-4 sm:px-6 md:px-8 w-full">
          <div className="flex items-center space-x-4">
            <button onClick={toggleSidebar}
              className={fromAdmin ? "transition-transform duration-200" : "lg:hidden flex items-center space-x-2 p-3"}>
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
            <Link href="/" className="flex items-center space-x-3 cursor-pointer">
              <Image src={logo} alt="Logo" width={50} height={50} className="rounded-full"/>
            </Link>
          </div>
          {
            !fromAdmin &&
            <HeaderNavigation
              items={items}
              context={context}
            />
          }
          <div className="flex items-center">
            {context.state?.initialized ? (
              context.state?.user === null ? (
                <HeaderAuth/>
              ) : (
                <HeaderAvatar context={context}/>
              )
            ) : (
              <LoadingSpinner className="h-10 w-10"/>
            )}
          </div>
        </div>
      </header>
      <Sidebar
        items={items}
        sidebarState={[isSidebarOpen, setIsSidebarOpen, toggleSidebar]}
        context={context}
      />
    </>
  );
}
