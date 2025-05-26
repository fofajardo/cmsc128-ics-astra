"use client";
import React, { useEffect, useRef } from "react";

export const ParticlesBackground = ({ count = 35 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");

      const size = Math.random() * 8 + 2;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const duration = 6 + Math.random() * 4;

      Object.assign(particle.style, {
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: "white",
        borderRadius: "50%",
        top: `${posY}%`,
        left: `${posX}%`,
        opacity: 0.5,
        animation: `diagonalMove ${duration}s linear infinite`,
      });

      container.appendChild(particle);
    }
  }, [count]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <style jsx>{`
        @keyframes diagonalMove {
          0% {
            transform: translate(0, 0);
            opacity: 0.5;
          }
          100% {
            transform: translate(200px, -200px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
