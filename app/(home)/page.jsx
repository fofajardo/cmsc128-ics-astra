"use client";

import Image from "next/image";
import Head from "next/head";
import Slideshow from "@/components/Slideshow";
import { FileText } from "lucide-react";
import { motion, AnimatePresence, useAnimation, useScroll } from "framer-motion";import { Rocket, Users, Code, Database, Star } from "lucide-react";
import Link from "next/link";
import { RouteGuard } from "@/components/RouteGuard.jsx";
import React, { useEffect, useState, useId } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";


const initialLoopImages1 = [
  "/icsloop1.jpg",
  "/icsloop2.jpg",
  "/icsloop3.jpg",
  "/icsloop4.jpg",
  "/icsloop5.jpg",
];

const initialLoopImages2 = [
  "/icsloop6.jpg",
  "/icsloop7.jpg",
  "/icsloop8.jpg",
  "/icsloop9.jpg",
  "/icsloop10.jpg",
];

const numberOfDuplicates = 4;

const loopImages1 = Array.from({ length: numberOfDuplicates }, () => initialLoopImages1).flat();
const loopImages2 = Array.from({ length: numberOfDuplicates }, () => initialLoopImages2).flat();

export default function Page() {
  const [init, setInit] = useState(false);
  const controls = useAnimation();
  const generatedId = useId();

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
        transition: {
          duration: 1,
        },
      });
    }
  };

  return (
    <main className="min-h-screen bg-astratintedwhite relative overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center will-change-transform z-0"
        style={{
          backgroundImage: "url(\"/about-bg.png\")",
          backgroundAttachment: "fixed",
          filter: "brightness(0.4)",
          transform: "scale(1.2)",
        }}
      ></div>
      <div className="absolute inset-0 bg-astrablack/20 z-1"></div>

      <RouteGuard />


      <motion.div
        animate={controls}
        className="opacity-0 absolute inset-0 w-full h-full z-2 pointer-events-none"
      >
        {init && (
          <Particles
            id={generatedId}
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
                  absorb: {
                    speed: 2,
                  },
                  bounce: {
                    horizontal: {
                      value: 1,
                    },
                    vertical: {
                      value: 1,
                    },
                  },
                  enable: false,
                  maxSpeed: 50,
                  mode: "bounce",
                  overlap: {
                    enable: true,
                    retries: 0,
                  },
                },
                color: {
                  value: "#ffffff",
                  animation: {
                    h: {
                      count: 0,
                      enable: false,
                      speed: 1,
                      decay: 0,
                      delay: 0,
                      sync: true,
                      offset: 0,
                    },
                    s: {
                      count: 0,
                      enable: false,
                      speed: 1,
                      decay: 0,
                      delay: 0,
                      sync: true,
                      offset: 0,
                    },
                    l: {
                      count: 0,
                      enable: false,
                      speed: 1,
                      decay: 0,
                      delay: 0,
                      sync: true,
                      offset: 0,
                    },
                  },
                },
                effect: {
                  close: true,
                  fill: true,
                  options: {},
                  type: {},
                },
                groups: {},
                move: {
                  angle: {
                    offset: 0,
                    value: 90,
                  },
                  attract: {
                    distance: 200,
                    enable: false,
                    rotate: {
                      x: 3000,
                      y: 3000,
                    },
                  },
                  center: {
                    x: 50,
                    y: 50,
                    mode: "percent",
                    radius: 0,
                  },
                  decay: 0,
                  distance: {},
                  direction: "none",
                  drift: 0,
                  enable: true,
                  gravity: {
                    acceleration: 9.81,
                    enable: false,
                    inverse: false,
                    maxSpeed: 50,
                  },
                  path: {
                    clamp: true,
                    delay: {
                      value: 0,
                    },
                    enable: false,
                    options: {},
                  },
                  outModes: {
                    default: "out",
                  },
                  random: false,
                  size: false,
                  speed: {
                    min: 0.1,
                    max: 1,
                  },
                  spin: {
                    acceleration: 0,
                    enable: false,
                  },
                  straight: false,
                  trail: {
                    enable: false,
                    length: 10,
                    fill: {},
                  },
                  vibrate: false,
                  warp: false,
                },
                number: {
                  density: {
                    enable: true,
                    width: 400,
                    height: 400,
                  },
                  limit: {
                    mode: "delete",
                    value: 0,
                  },
                  value: 100,
                },
                opacity: {
                  value: {
                    min: 0.1,
                    max: 1,
                  },
                  animation: {
                    count: 0,
                    enable: true,
                    speed: 4,
                    decay: 0,
                    delay: 0,
                    sync: false,
                    mode: "auto",
                    startValue: "random",
                    destroy: "none",
                  },
                },
                reduceDuplicates: false,
                shadow: {
                  blur: 0,
                  color: {
                    value: "#000",
                  },
                  enable: false,
                  offset: {
                    x: 0,
                    y: 0,
                  },
                },
                shape: {
                  close: true,
                  fill: true,
                  options: {},
                  type: "circle",
                },
                size: {
                  value: {
                    min: 0.6,
                    max: 1.4,
                  },
                  animation: {
                    count: 0,
                    enable: false,
                    speed: 5,
                    decay: 0,
                    delay: 0,
                    sync: false,
                    mode: "auto",
                    startValue: "random",
                    destroy: "none",
                  },
                },
                stroke: {
                  width: 0,
                },
                zIndex: {
                  value: 0,
                  opacityRate: 1,
                  sizeRate: 1,
                  velocityRate: 1,
                },
                destroy: {
                  bounds: {},
                  mode: "none",
                  split: {
                    count: 1,
                    factor: {
                      value: 3,
                    },
                    rate: {
                      value: {
                        min: 4,
                        max: 9,
                      },
                    },
                    sizeOffset: true,
                  },
                },
                roll: {
                  darken: {
                    enable: false,
                    value: 0,
                  },
                  enable: false,
                  enlighten: {
                    enable: false,
                    value: 0,
                  },
                  mode: "vertical",
                  speed: 25,
                },
                tilt: {
                  value: 0,
                  animation: {
                    enable: false,
                    speed: 0,
                    decay: 0,
                    sync: false,
                  },
                  direction: "clockwise",
                  enable: false,
                },
                twinkle: {
                  lines: {
                    enable: false,
                    frequency: 0.05,
                    opacity: 1,
                  },
                  particles: {
                    enable: false,
                    frequency: 0.05,
                    opacity: 1,
                  },
                },
                wobble: {
                  distance: 5,
                  enable: false,
                  speed: {
                    angle: 50,
                    move: 10,
                  },
                },
                life: {
                  count: 0,
                  delay: {
                    value: 0,
                    sync: false,
                  },
                  duration: {
                    value: 0,
                    sync: false,
                  },
                },
                rotate: {
                  value: 0,
                  animation: {
                    enable: false,
                    speed: 0,
                    decay: 0,
                    sync: false,
                  },
                  direction: "clockwise",
                  path: false,
                },
                orbit: {
                  animation: {
                    count: 0,
                    enable: false,
                    speed: 1,
                    decay: 0,
                    delay: 0,
                    sync: false,
                  },
                  enable: false,
                  opacity: 1,
                  rotation: {
                    value: 45,
                  },
                  width: 1,
                },
                links: {
                  blink: false,
                  color: {
                    value: "#fff",
                  },
                  consent: false,
                  distance: 100,
                  enable: false,
                  frequency: 1,
                  opacity: 1,
                  shadow: {
                    blur: 5,
                    color: {
                      value: "#000",
                    },
                    enable: false,
                  },
                  triangles: {
                    enable: false,
                    frequency: 1,
                  },
                  width: 1,
                  warp: false,
                },
                repulse: {
                  value: 0,
                  enabled: false,
                  distance: 1,
                  duration: 1,
                  factor: 1,
                  speed: 1,
                },
              },
              detectRetina: true,
            }}
          />
        )}
      </motion.div>

    <section className="relative h-[95vh] flex items-center justify-center overflow-hidden isolate z-10">
        <div className="absolute inset-0 bg-astrablack/20 z-1"></div>

<motion.div
  initial={{ opacity: 0, scale: 0.8, y: 50 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="relative z-20 px-6 md:px-8 max-w-4xl text-astrawhite text-center overflow-hidden"
>
  <motion.h1
    className="text-2xl sm:text-5xl md:text-7xl font-bold mb-6 md:mb-8 leading-tight"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 3 }}
  >
    Welcome to ICS-Astra!
  </motion.h1>
</motion.div>

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-8 w-8 text-astrawhite/70" />
          </div>
      </section>

<section className="relative h-[95vh] flex items-center overflow-hidden isolate z-10 gap-10">
  <div className="absolute inset-0 bg-astrablack/20 z-1"></div>

<motion.div
  whileInView={{ opacity: 1, y: 0 }}
  initial={{ opacity: 0, y: 50 }}
  transition={{ duration: 3, ease: "easeOut" }}
      viewport={{ once: true }}

  className="relative z-20 px-6 md:px-8 max-w-4xl text-astrawhite mb-10 md:mb-16"
>
  <h1 className="text-4xl font-bold mb-6 md:mb-8 leading-tight">
    Here at ICS-Astra, we keep the spirit of innovation alive by connecting alumni, fostering collaboration, and celebrating achievements beyond graduation.
    <br />
  </h1>
  <Link href="/about" passHref>
    <button className="mt-12 border-1 border-astraprimary text-astrawhite bg-transparent hover:bg-astrawhite/5 hover:text-astrawhite rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer w-[200px] h-[60px]">
      Learn More
    </button>
  </Link>

</motion.div>


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
    className="relative z-20 flex-shrink-0 w-80 md:w-96 lg:w-104 mr-8 md:mr-16 mt-10 md:mt-16"
  >
    <div className="absolute rounded-full blur-xl opacity-30 bg-gradient-to-r from-purple-400 to-blue-500 w-full h-full -inset-1"></div>

    <Image
      src="/landing_page.gif"
      alt="Institute of Computer Science Logo"
      width={800}
      height={800}
      className="relative z-10 transform transition-all duration-500 hover:scale-105 object-cover rounded-full shadow-lg"
    />
  </motion.div>
</section>

<section className="relative h-[95vh] flex flex-col items-center justify-center overflow-hidden isolate z-10">
  <div className="absolute inset-0 bg-astrablack/20 "></div>

  <motion.div
    whileInView={{ opacity: 1, y: 0 }}
    initial={{ opacity: 0, y: 50 }}
    transition={{ duration: 3 }}
    viewport={{ once: true }}
    className="relative z-20 px-6 md:px-8 max-w-4xl text-astrawhite text-center overflow-hidden"
  >
    <motion.h1
      className="text-2xl sm:text-5xl md:text-7xl font-bold mb-6 md:mb-8 leading-tight inline-block"
      variants={textRevealVariants}
      initial="initial"
      animate="animate"
    >
      {"EVENTS".split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block"
          variants={letterVariants}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
      <br />
    </motion.h1>
    <p className="text-astrawhite/90 text-base md:text-lg leading-relaxed mb-8">
      From engaging workshops to exciting celebrations, there’s always something happening. Don’t just watch—participate, engage, and make each event unforgettable!
    </p>
  </motion.div>

  <div className="flex flex-col w-full items-center p-7">
    <motion.section
      whileInView={{ opacity: 1, y: 0 }}
    initial={{ opacity: 0, y: 50 }}
    transition={{ duration: 3 }}
    viewport={{ once: true }}
      className="py-1 overflow-hidden w-full"
    >
      <div className="loop-container">
        <div className="loop-track-left">
          {loopImages1.map((image, index) => (
            <div key={index} className="inline-block mr-3 w-80 h-46 relative">
              <Image
                src={image}
                alt={`Alumni ${index + 1}`}
                fill
                style={{ objectFit: "cover", borderRadius: "5px" }}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.section>

    <motion.section
      whileInView={{ opacity: 1, y: 0 }}
    initial={{ opacity: 0, y: 50 }}
    transition={{ duration: 3 }}
    viewport={{ once: true }}
      className="py-0 overflow-hidden w-full"
    >
      <div className="loop-container">
        <div className="loop-track-right">
          {loopImages2.map((image, index) => (
            <div key={index} className="inline-block mr-3 w-80 h-46 relative">
              <Image
                src={image}
                alt={`Alumni ${index + 1}`}
                fill
                style={{ objectFit: "cover", borderRadius: "5px" }}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  </div>

 <motion.div
  whileInView={{ opacity: 1, y: 0 }}
  initial={{ opacity: 0, y: 20 }}
  transition={{ duration: 3}}
  viewport={{ once: true }}
  className="flex justify-center mt-2 mb-5 relative z-20"
>
  <Link href="/events" passHref>
    <button className="border-1 border-astraprimary text-astrawhite bg-transparent hover:bg-astrawhite/5 hover:text-astrawhite rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer w-[200px] h-[60px]">
      Learn More
    </button>
  </Link>
</motion.div>
</section>






      <style jsx>
        {`
          .loop-container {
            width: 100%;
            overflow: hidden; /* Hide images that go beyond the container */
            white-space: nowrap; /* Keep images in a single line */
          }

          .loop-track-left {
            display: inline-block; /* Allow horizontal arrangement */
            animation: scrollLoopLeft 200s linear infinite; /* Adjust duration as needed */
          }

          .loop-track-right {
            display: inline-block; /* Allow horizontal arrangement */
            animation: scrollLoopRight 200s linear infinite; /* Adjust duration as needed */
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
    </main>
  );

}

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