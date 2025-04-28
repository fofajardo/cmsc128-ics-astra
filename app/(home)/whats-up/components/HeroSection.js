"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./HeroSection.module.css";
import animations from "../styles/animations.module.css";
import heroImage from "../../../assets/whats-up-vector.png"; // Example image path

export function HeroSection() {
  const router = useRouter();

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

  const handleLearnMore = () => {
    router.push('/whats-up/about'); // Replace with your desired route
  };

  return (
    <div className="w-full bg-astradirtywhite">
      <div className="h-[100px]" />
      <div
        className="relative w-full bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/blue-bg.png')" }}
      >
        <div className={`${styles.particles} ${animations.fadeSlideUp}`} id="particles" />

        <div className="max-w-[1440px] mx-auto px-12 py-20 flex flex-col lg:flex-row items-center justify-between text-astrawhite gap-10">
          {/* Image Section - Now First */}
          <div className={`w-full lg:w-[550px] flex justify-center order-2 lg:order-1 ${animations.floatAnimation}`}>
            <div className="relative w-full h-auto max-w-[550px] animate-float">
              <Image
                src={heroImage}
                alt="What's Up Illustration"
                className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>
          </div>

          {/* Text Section - Now Second */}
          <div className={`max-w-[600px] space-y-6 text-center lg:text-right order-1 lg:order-2 ${animations.fadeSlideUp}`}>
            <h1 className="text-[60px] font-extrabold leading-[1.1] hover:scale-105 transition-transform">
              What's Up
            </h1>
            <p className="text-lg font-medium hover:text-blue-200 transition-colors">
              Stay connected and informed with the latest updates and stories.
            </p>
            <div className="flex justify-center lg:justify-end">
              <button 
                onClick={handleLearnMore}
                className={`mt-4 px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-astraprimary rounded-xl transition-all duration-300 ${animations.glowEffect}`}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}