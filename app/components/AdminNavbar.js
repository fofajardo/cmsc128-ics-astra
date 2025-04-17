"use client"
import { useState } from "react";
import { Menu } from "lucide-react";
import { SideNavItem } from "./AdminRoutes";

export default function AdminNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <div className="h-[100px] w-full bg-astrawhite flex items-center justify-between px-6 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Menu
            className="w-6 h-6 text-astrablack cursor-pointer"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <img
            src="https://via.placeholder.com/40"
            alt="Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <div>
          <img
            src="https://via.placeholder.com/40"
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      </div>

      <Sidebar isOpen={isSidebarOpen} />
    </>
  );
}

function Sidebar({ isOpen }) {
  return (
    <div
      className={`w-64 bg-astratintedwhite border-r border-astralightgray transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-64"
      }`}
    >
      <div className="p-6 h-[calc(100vh-100px)]">
        
      </div>
    </div>
  );
}
