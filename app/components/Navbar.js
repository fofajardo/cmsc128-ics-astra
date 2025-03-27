"use client";
import { useEffect, useState } from "react";

export default function Navbar() {
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
    <nav className={`navbar-main ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="navbar-logo-img"
            alt="Flowbite Logo"
          />
          <span className="navbar-logo-text">Flowbite</span>
        </div>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="navbar-menu-button"
          aria-controls="navbar-default"
          aria-expanded="false"
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
        <div className="navbar-menu-container" id="navbar-default">
          <ul className="navbar-menu">
            <li>
              <a href="/" className="navbar-menu-item">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="navbar-menu-item">
                About
              </a>
            </li>
            <li>
              <a href="/events" className="navbar-menu-item">
                Events
              </a>
            </li>
            <li>
              <a href="/projects" className="navbar-menu-item">
                Projects
              </a>
            </li>
            <li>
              <a href="/whats-up" className="navbar-menu-item">
                What's Up
              </a>
            </li>
            <li>
              <a href="/login" className="navbar-menu-item">
                Login
              </a>
            </li>
            <li>
              <a
                href="/signup"
                className={`navbar-sign-up-btn ${
                  scrolled ? "scrolled-sign-up" : ""
                }`}
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
