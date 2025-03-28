"use client";
import React, { useState, useEffect } from "react";

export default function Navbar() {
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

  return (
    <nav className={`navbar-main ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        <a href="#" className="navbar-logo-section">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="navbar-logo-image"
            alt="Flowbite Logo"
          />
          <span className="navbar-logo-text">
            Flowbite
          </span>
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
            <li>
              <a href="#" className="navbar-link">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="navbar-link">
                Services
              </a>
            </li>
            <li>
              <a href="#" className="navbar-link">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="navbar-link">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="navbar-link">
                Login
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`${
                  menuOpen
                    ? "navbar-link"
                    : scrolled
                    ? "navbar-sign-up-button hover:bg-black hover:text-white"
                    : "navbar-sign-up-button"
                } md:navbar-sign-up-button`}
              >
                Sign Up
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
