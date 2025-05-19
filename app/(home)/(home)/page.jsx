"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { RouteGuard } from "@/components/RouteGuard.jsx";
import React, { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const baseLoopImages1 = ["/icsloop1.jpg", "/icsloop2.jpg", "/icsloop3.jpg", "/icsloop4.jpg", "/icsloop5.jpg"];
const baseLoopImages2 = ["/icsloop6.jpg", "/icsloop7.jpg", "/icsloop8.jpg", "/icsloop9.jpg", "/icsloop10.jpg"];
const numberOfDuplicates = 4;
const loopImages1 = Array.from({ length: numberOfDuplicates }, () => baseLoopImages1).flat();
const loopImages2 = Array.from({ length: numberOfDuplicates }, () => baseLoopImages2).flat();

const textRevealVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const letterVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const ChevronDown = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const sectionBase = "relative h-[95vh] flex items-center overflow-hidden isolate z-10";
const absoluteInset = "absolute inset-0";
const textWhiteCenter = "text-astrawhite text-center";
const buttonBase = "border-1 border-astraprimary text-astrawhite bg-transparent hover:bg-astrawhite/5 hover:text-astrawhite rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer w-[200px] h-[60px]";
const loopContainer = "loop-container w-full overflow-hidden whitespace-nowrap py-0";
const loopTrackBase = "inline-block";
const imageLoopBase = "inline-block mr-3 w-80 h-46 relative";

export default function Page() {
  const [init, setInit] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container) => {
    if (container) {
      controls.start({
        opacity: 0.4,
        transition: { duration: 1 },
      });
    }
  };

  return (
    <main className="min-h-screen bg-astratintedwhite relative overflow-hidden">
      <div className={`${absoluteInset} bg-gradient-to-br from-astradark to-color-pieastra-primary-60 z-0`} />
      <div className={`${absoluteInset} bg-astrablack/100 z-1`} />

      <RouteGuard />

      <section className={`${sectionBase} justify-center`}>
        <div className={`${absoluteInset} bg-gradient-to-br from-astradark to-color-astraprimary/40 animate-pulse-slow z-1`} />
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`relative z-20 px-6 md:px-8 max-w-4xl ${textWhiteCenter} overflow-hidden`}
        >
          <motion.h1
            className="font-h1 mb-2 md:mb-4 leading-tight"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
          >
            WELCOME TO ICS-Astra!
          </motion.h1>
          <motion.p
            className="font-l text-astrawhite/80 mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
          Your lifelong connection to ICS starts here. Access resources, network with peers, and advance your career.
          </motion.p>
        </motion.div>
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-astrawhite/70" />
        </div>
      </section>

      <section className={`${sectionBase} gap-10`}>
        <div className={`${absoluteInset} bg-astrablack/20 z-1`} />
        <motion.div
  initial={{ opacity: 0, x: 100, scale: 0.8, rotate: -30 }}
  whileInView={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
  transition={{
    type: "spring",
    stiffness: 120,
    damping: 18,
    duration: 3,
    delay: 0.4,
  }}
  viewport={{ once: true }}
  className="relative z-20 flex-shrink-0 mr-8 md:mr-16 mt-10 md:mt-16"
>
  <Image
    src="/landing_page.gif"
    alt="Institute of Computer Science Logo"
    width={600}
    height={400}
    className="relative z-10 transform transition-all duration-500 hover:scale-105 object-cover  "
  />
</motion.div>

        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 3, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative z-20 px-6 md:px-8 max-w-4xl text-astrawhite mb-10 md:mb-16"
        >
          <h1 className="font-h2 mb-6 md:mb-8 leading-tight items-center">
            Here at ICS-Astra, we keep the spirit of innovation alive by connecting alumni, fostering collaboration, and celebrating achievements beyond graduation.
            <br />
          </h1>
          <Link href="/about" passHref>
            <button className={`${buttonBase} mt-10`}>
              Learn More
            </button>
          </Link>
        </motion.div>

      </section>
      <section className={`${sectionBase} flex-col justify-center`}>
        <div className={`${absoluteInset} bg-astrablack/20`} />
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 3 }}
          viewport={{ once: true }}
          className={`relative z-20 px-6 md:px-8 max-w-4xl ${textWhiteCenter} overflow-hidden`}
        >
          <motion.h1
            className="font-h1 mb-6 md:mb-8 leading-tight inline-block"
            variants={textRevealVariants}
            initial="initial"
            animate="animate"
          >
            {"EVENTS".split("").map((char, index) => (
              <motion.span key={`${char}-${index}`} className="inline-block" variants={letterVariants}>
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>
          <p className="font-r text-astrawhite/90 text-base md:text-lg leading-relaxed mb-8">
            From engaging workshops to exciting celebrations, there’s always something happening. Don’t just watch—participate, engage, and make each event unforgettable!
          </p>
        </motion.div>

        <div className="flex flex-col w-full items-center p-6">
          <motion.section
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 2 }}
            viewport={{ once: true }}
            className={loopContainer}
          >
            <div className="loop-track-left">
              {loopImages1.map((image, index) => (
                <div key={index} className={imageLoopBase}>
                  <Image
                    src={image}
                    alt={`Alumni ${index + 1}`}
                    fill
                    style={{ objectFit: "cover", borderRadius: "5px" }}
                  />
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 2 }}
            viewport={{ once: true }}
            className={loopContainer}
          >
            <div className="loop-track-right">
              {loopImages2.map((image, index) => (
                <div key={index} className={imageLoopBase}>
                  <Image
                    src={image}
                    alt={`Alumni ${index + 1}`}
                    fill
                    style={{ objectFit: "cover", borderRadius: "5px" }}
                  />
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 2 }}
          viewport={{ once: true }}
          className="flex justify-center mt-2 mb-5 relative z-20"
        >
          <Link href="/events" passHref>
            <button className={buttonBase}>
              View All Events
            </button>
          </Link>
        </motion.div>
      </section>

      <style jsx>
        {`
          .loop-track-left {
            ${loopTrackBase};
            animation: scrollLoopLeft 50s linear infinite; /* Adjust duration as needed */
          }

          .loop-track-right {
            ${loopTrackBase};
            animation: scrollLoopRight 50s linear infinite; /* Adjust duration as needed */
          }

          @keyframes scrollLoopLeft {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%); /* Move the track to the left by its full width */
            }
          }

          @keyframes scrollLoopRight {
            0% {
              transform: translateX(-50%); /* Start from the left */
            }
            100% {
              transform: translateX(0%); /* Move to the right */
            }
          }
        `}
      </style>
      <motion.div
        animate={controls}
        className="opacity-0 absolute inset-0 w-full h-full z-2 pointer-events-none"
      >
        {init && (
          <Particles
            id="tsparticles"
            className="h-full w-full"
            particlesLoaded={particlesLoaded}
            options={{
              background: {
                color: {
                  value: "transparent",
                },
              },
              fullScreen: {
                enable: false,
                zIndex: 1,
              },
              fpsLimit: 120,
              interactivity: {
                events: {
                  onClick: {
                    enable: false,
                    mode: "push",
                  },
                  onHover: {
                    enable: false,
                    mode: "repulse",
                  },
                  resize: true,
                },
                modes: {
                  push: {
                    quantity: 4,
                  },
                  repulse: {
                    distance: 200,
                    duration: 0.4,
                  },
                },
              },
              particles: {
                bounce: {
                  horizontal: {
                    value: 1,
                  },
                  vertical: {
                    value: 1,
                  },
                },
                collisions: {
                  enable: false,
                },
                color: {
                  value: "#ffffff",
                },
                move: {
                  direction: "none",
                  enable: true,
                  outModes: {
                    default: "out",
                  },
                  random: false,
                  speed: 1,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    width: 400,
                    height: 400,
                  },
                  value: 100,
                },
                opacity: {
                  value: {
                    min: 0.3,
                    max: 1,
                  },
                  animation: {
                    enable: true,
                    speed: 4,
                    sync: false,
                  },
                },
                shape: {
                  type: "circle",
                },
                size: {
                  value: {
                    min: 0.6,
                    max: 1.4,
                  },
                  animation: {
                    enable: false,
                  },
                },
                stroke: {
                  width: 0,
                },
              },
              detectRetina: true,
            }}
          />
        )}
      </motion.div>
    </main>
  );
}