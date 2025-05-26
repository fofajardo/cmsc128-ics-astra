"use client";
import React, { useEffect, useRef } from "react";

export const StarParticlesBackground = ({ count = 35 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");

      // BIGGER SIZE - now ranges from 10px to 20px (originally 2-10px)
      const size = Math.random() * 10 + 10;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const duration = 6 + Math.random() * 4;
      const rotation = Math.random() * 360;

      Object.assign(particle.style, {
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        top: `${posY}%`,
        left: `${posX}%`,
        opacity: 0.5,
        animation: `diagonalMove ${duration}s linear infinite`,
        transform: `rotate(${rotation}deg)`,
        filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))",
      });

      // Create larger SVG star
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.setAttribute("viewBox", "0 0 50 50"); // Larger viewBox for bigger stars

      // Big star path (scaled up coordinates)
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M25 5L30 15L40 17L32 25L35 35L25 30L15 35L18 25L10 17L20 15Z");
      path.setAttribute("fill", "white");

      svg.appendChild(path);
      particle.appendChild(svg);

      // Random twinkle effect for some stars
      if (Math.random() > 0.7) {
        particle.style.animation = `diagonalMove ${duration}s linear infinite, twinkle ${3 + Math.random() * 4}s ease-in-out infinite`;
      }

      container.appendChild(particle);
    }
  }, [count]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <style jsx>{`
        @keyframes diagonalMove {
          0% {
            transform: translate(0, 0) rotate(var(--rotation));
            opacity: 0.5;
          }
          100% {
            transform: translate(200px, -200px) rotate(var(--rotation));
            opacity: 0;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8) rotate(var(--rotation));
          }
          50% {
            opacity: 1;
            transform: scale(1.2) rotate(var(--rotation));
          }
        }
      `}</style>
    </div>
  );
};