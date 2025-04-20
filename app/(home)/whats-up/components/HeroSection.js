"use client";
import React, { useEffect } from "react";
import styles from "./HeroSection.module.css"; // Use CSS modules

export function HeroSection() {
  useEffect(() => {
    const particlesContainer = document.getElementById("particles");
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.classList.add(styles.particle); // Use the CSS module class

      // Random size
      const size = Math.random() * 8 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Random position
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;

      // Random animation delay
      const delay = Math.random() * 15;
      particle.style.animationDelay = `${delay}s`;

      particlesContainer.appendChild(particle);
    }
  }, []);

  return (
    <div className={styles.techHeader}>
      <div className={styles.techBg}></div>
      <div className={styles.grid}></div>

      <div className={styles.particles} id="particles">
        {/* Particles will be generated with JavaScript */}
      </div>

      <div className={styles.wave}></div>
      <h1>Newsletter</h1>
      <p>Stay connected and informed with the latest updates and stories.</p>
    </div>
  );
}