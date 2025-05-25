"use client";
import React from "react";
import Image from "next/image";
import heroImage from "../../../assets/whats-up-vector.gif";
import { ParticlesBackground } from "@/components/ParticlesBackground";

export function HeroSection() {
  return (
    <div className="w-full bg-astradirtywhite">
      <div
        className="relative w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/blue-bg.png')" }}
      >
        {/* Particles */}
        <ParticlesBackground count={40} />

        {/* Hero Content */}
        <div className="max-w-[1440px] mx-auto px-12 py-20 flex flex-col lg:flex-row items-center justify-between text-astrawhite gap-10 relative z-10">
          <div className="max-w-[600px] space-y-6 text-center lg:text-left animate-hero-text">
            <h1 className="text-[60px] font-extrabold leading-[1.1]">
              ICS Bulletin Board
            </h1>
            <p className="text-lg font-medium">
              Discover upcoming events, celebrate student successes, and find out what&apos;s ongoing in ICS.
              From hackathons to career fairs - never miss out on campus life.
            </p>
          </div>
          <div className="w-full lg:w-[550px] flex justify-center">
            <div className="relative w-full h-auto max-w-[550px] animate-natural-float">
              <Image
                src={heroImage}
                alt="What's Up Illustration"
                className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes naturalFloat {
          0% { transform: translate(0px, 0px) rotate(0deg); }
          25% { transform: translate(8px, -10px) rotate(1deg); }
          50% { transform: translate(0px, -20px) rotate(0deg); }
          75% { transform: translate(-8px, -10px) rotate(-1deg); }
          100% { transform: translate(0px, 0px) rotate(0deg); }
        }

        @keyframes fadeBounce {
          0% { opacity: 0; transform: translateY(-10px); }
          50% { opacity: 1; transform: translateY(5px); }
          100% { transform: translateY(0px); }
        }

        .animate-natural-float {
          animation: naturalFloat 8s ease-in-out infinite;
        }

        .animate-hero-text {
          animation: fadeBounce 2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
