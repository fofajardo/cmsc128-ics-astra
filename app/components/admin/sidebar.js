// components/admin/sidebar.js
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { SideNavItem } from './routes';
import '../../styles/admin/sidebar.css'; // Import the CSS file
import { useRouter, usePathname } from 'next/navigation'; // Import useRouter and usePathname

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname(); // Get the current pathname

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-circle"></div>
          {!isCollapsed && <span className="logo-text">ICS ASTRA</span>}
        </div>
        <button onClick={toggleCollapse} className="collapse-button">
          <Icon icon={isCollapsed ? 'mdi:menu-open' : 'mdi:menu'} width="24" height="24" />
        </button>
      </div>

      <nav className="sidebar-nav">
        {SideNavItem.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`nav-item ${pathname === item.path ? 'active' : ''}`}
          >
            <div className="nav-item-content">
              <span className="nav-icon">{item.icon}</span>
              {!isCollapsed && <span className="nav-text">{item.title}</span>}
            </div>
          </Link>
        ))}
      </nav>

      <div className="user-profile">
        <div className="user-info">
          <div className="user-avatar"></div>
          {!isCollapsed && <span className="user-name">ICS Admin</span>}
        </div>
        {!isCollapsed && <Icon icon="mdi:cog" width="24" height="24" />}
      </div>
      <button className="sign-out-button">Sign Out</button>
    </div>
  );
};

export default Sidebar;