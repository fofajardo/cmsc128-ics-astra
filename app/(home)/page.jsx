"use client";

import Image from "next/image";
import Head from "next/head";
import Slideshow from "@/components/Slideshow";
import { FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Users, Code, Database, Star } from "lucide-react";
import Link from "next/link";
import {RouteGuard} from "@/components/RouteGuard.jsx";

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

const textVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--color-astrawhite)] to-[var(--color-astratintedwhite)]">
      <RouteGuard />
      <Head>
        <title>ICS-ASTRA</title>
        <link rel="icon" href="/astra-logo.png" />
      </Head>

      <section className="showcase">
        <Slideshow />
      </section>

      <section
        id="mission"
        className="py-16 md:py-24 lg:py-32 w-full relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-astratintedwhite"></div>
        <div className="absolute top-0 left-1/2 w-full h-32 md:h-48 lg:h-64 blur-xl md:blur-2xl lg:blur-3xl -translate-x-1/2 rounded-full"></div>
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-6xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-24 items-center">
          <div className="flex justify-center order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-md"
            >
              <motion.h2
                variants={textVariants}
                initial="initial"
                animate="animate"
                className="text-[var(--color-astraprimary)] text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 lg:mb-10"
              >
                Join the Excitement!
              </motion.h2>
              <div className="space-y-4 md:space-y-6 lg:space-y-8">
                <motion.div variants={textVariants} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
                  <div className="flex items-start gap-3 md:gap-4">
                    <p className="text-[var(--color-astrablack)] text-base md:text-lg">
                      From engaging workshops to exciting celebrations, there’s always something happening. Don’t just watch—participate, engage, and make each event unforgettable!
                    </p>
                  </div>
                </motion.div>
                <motion.div variants={textVariants} initial="initial" animate="animate" transition={{ delay: 0.4 }}>
                  <Link href="/events" passHref>
                    <button className="mt-8 md:mt-10 border-2 border-astraprimary text-astraprimary bg-astrawhite hover:bg-astraprimary hover:text-astrawhite rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer w-full sm:w-[200px] h-14 md:h-16">
                      See Events
                    </button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, rotateY: 30 }}
            whileInView={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative order-1 md:order-2 flex justify-center"
          >
            <div className="absolute rounded-full blur-xl opacity-30 animate-pulse w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80"></div>
            <Image
              src="/homepage-vector1.gif"
              alt="Institute of Computer Science Logo"
              width={800}
              height={800}
              className="relative z-10 transform transition-all duration-500 hover:scale-105 object-contain w-full max-w-md"
            />
          </motion.div>
        </div>
      </section>
      {/* Looping Image Section going left */}
      <section className="pt-4 bg-astrablack overflow-hidden">
        <div className="loop-container">
          <div className="loop-track-left">
            {loopImages1.map((image, index) => (
              <div
                key={index}
                className="inline-block mr-4 relative"
                style={{ width: "280px", height: "210px" }} // Example fixed dimensions
              >
                <Image
                  src={image}
                  fill
                  style={{ objectFit: "cover", borderRadius: "10px" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Looping Image Section going right */}
      <section className="pb-2 bg-astrablack overflow-hidden">
        <div className="loop-container">
          <div className="loop-track-right">
            {loopImages2.map((image, index) => (
              <div
                key={index}
                className="inline-block mr-4 relative"
                style={{ width: "280px", height: "210px" }} // Example different fixed dimensions
              >
                <Image
                  src={image}
                  alt={`Alumni ${index + 1}`}
                  fill
                  style={{ objectFit: "cover", borderRadius: "10px" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="mission"
        className="py-16 md:py-24 lg:py-32 w-full relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-astratintedwhite"></div>
        <div className="absolute top-0 left-1/2 w-full h-32 md:h-48 lg:h-64 blur-xl md:blur-2xl lg:blur-3xl -translate-x-1/2 rounded-full"></div>
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-6xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-24 items-center">
          {/* Switch the order here */}
          <div className="flex justify-center order-1 md:order-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-md"
            >
              <motion.h2
                variants={textVariants}
                initial="initial"
                animate="animate"
                className="text-[var(--color-astraprimary)] text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 lg:mb-10"
              >
                Stay Connected with Us!
              </motion.h2>
              <div className="space-y-4 md:space-y-6 lg:space-y-8">
                <motion.div variants={textVariants} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
                  <div className="flex items-start gap-3 md:gap-4">
                    <p className="text-[var(--color-astrablack)] text-base md:text-lg">
                      Stay connected with the latest updates from Astra-ICS. From
                      important news to exciting announcements, find out what’s
                      happening, what’s new, and what’s coming next — all right
                      here.              </p>
                  </div>
                </motion.div>
                <motion.div variants={textVariants} initial="initial" animate="animate" transition={{ delay: 0.4 }}>
                  <Link href="/events" passHref>
                    <button className="mt-8 md:mt-10 border-2 border-astraprimary text-astraprimary bg-astrawhite hover:bg-astraprimary hover:text-astrawhite rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer w-full sm:w-[200px] h-14 md:h-16">
                      See Latest Updates
                    </button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
          {/* Vector Image on Left */}
          <motion.div
            initial={{ opacity: 0, rotateY: 30 }}
            whileInView={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative order-2 md:order-1 flex justify-center"
          >
            <div className="absolute rounded-full blur-xl opacity-30 animate-pulse w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80"></div>
            <Image
              src="/homepage-vector2.gif"
              alt="Institute of Computer Science Logo"
              width={800}
              height={800}
              className="relative z-10 transform transition-all duration-500 hover:scale-105 object-contain w-full max-w-md"
            />
          </motion.div>
        </div>
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
            animation: scrollLoopLeft 400s linear infinite; /* Adjust duration as needed */
          }

          .loop-track-right {
            display: inline-block; /* Allow horizontal arrangement */
            animation: scrollLoopRight 400s linear infinite; /* Adjust duration as needed */
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

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .loop-track-left {
              animation-duration: 200s; /* Faster scroll on smaller screens */
            }
            .loop-track-right {
              animation-duration: 200s; /* Faster scroll on smaller screens */
            }
            .loop-container div > div { /* Target the image wrappers */
              margin-right: 1rem;
            }
          }

          @media (max-width: 640px) {
            .grid {
              grid-template-columns: 1fr; /* Stack columns on smaller screens */
            }
            .order-1 {
              order: 1;
            }
            .order-2 {
              order: 2;
            }
            .max-w-md {
              max-width: 100%; /* Allow text to take full width */
            }
            .text-3xl {
              font-size: 2.5rem;
            }
            .mt-8 {
              margin-top: 2rem;
            }
            .h-14 {
              height: 3.5rem;
            }
          }
        `}
      </style>
    </main>
  );
}