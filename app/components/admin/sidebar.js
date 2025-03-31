// components/admin/sidebar.js
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import "../../styles/admin/sidebar.css";
import { usePathname } from "next/navigation";
import { SideNavItem } from "./routes";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Toggle Collapse State
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        {/* Logo and Collapse Button */}
        <div className="logo-container">
          {!isCollapsed && (
            <>
              <div className="logo-circle"></div>
              <span className="logo-text">ICS ASTRA</span>
            </>
          )}
        </div>
        {/* Collapse Button */}
        <button onClick={toggleCollapse} className="collapse-button">
          <Icon
            icon={isCollapsed ? "mdi:menu-open" : "mdi:menu"}
            width="24"
            height="24"
          />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="sidebar-nav">
        {SideNavItem.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`nav-item ${
              pathname === item.path ? "active" : ""
            }`}
          >
            <div className="nav-item-content">
              <Icon
                icon={item.icon}
                width="20"
                height="20"
                className="nav-icon"
              />
              {!isCollapsed && (
                <span className="nav-text">{item.title}</span>
              )}
            </div>
          </Link>
        ))}
      </nav>

      {/* User Profile - ICS Admin */}
      <div className="user-profile">
        <div className="user-info">
          {/* Gray Circle Icon when Collapsed */}
          <div
            className={`user-avatar ${
              isCollapsed ? "collapsed-avatar" : ""
            }`}
          />
          {!isCollapsed && <span className="user-name">ICS Admin</span>}
        </div>
        {!isCollapsed && (
          <Icon icon="mdi:cog" width="24" height="24" className="settings-icon" />
        )}
      </div>

      {/* Sign Out Button */}
      <button className="sign-out-button">
        <div className="sign-out-content">
          <Icon
            icon="mdi:logout"
            width="20"
            height="20"
            className="sign-out-icon"
          />
          {!isCollapsed && <span className="sign-out-text">Sign Out</span>}
        </div>
      </button>
    </div>
  );
};

export default Sidebar;
