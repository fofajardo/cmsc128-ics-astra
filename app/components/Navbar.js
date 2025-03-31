"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getRole } from "../utils/auth"; 

export default function Navbar({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const role = getRole(user);

  if (role !== "visitor" && role !== "alumni") {
    return null;
  }

  return (
    <nav className={`navbar-main ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        <a href="#" className="navbar-logo-section">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="navbar-logo-image"
            alt="Flowbite Logo"
          />
          <span className="navbar-logo-text">Flowbite</span>
        </a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          data-collapse-toggle="navbar-default"
          type="button"
          className="navbar-menu-button"
          aria-controls="navbar-default"
          aria-expanded={menuOpen ? "true" : "false"}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        <div
          className={`${menuOpen ? "" : "hidden"} w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="navbar-menu-container">
            {role === "visitor" && (
              <>
                <li>
                  <Link href="/" className="navbar-link">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="navbar-link">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="navbar-link">
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="navbar-link">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/announcements" className="navbar-link">
                    What's Up
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="navbar-log-in-button">
                    Log in
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="navbar-sign-up-button">
                    Sign Up
                  </Link>
                </li>
              </>
            )}

            {role === "alumni" && (
              <>
                <li>
                  <Link href="/" className="navbar-link">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="navbar-link">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="navbar-link">
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="navbar-link">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/jobs" className="navbar-link">
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/announcements" className="navbar-link">
                    What's Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
