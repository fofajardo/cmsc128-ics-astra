"use client";

import Image from "next/image";
import Head from "next/head";
import Slideshow from "@/components/Slideshow";
import { FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Users, Code, Database, Star } from "lucide-react";
import Link from "next/link";


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
  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--color-astrawhite)] to-[var(--color-astratintedwhite)]">
      <Head>
        <title>ICS-ASTRA</title>
        <link rel="icon" href="/astra-logo.png" />
      </Head>

      <section className="showcase">
        <Slideshow />
      </section>



      <section
  id="mission"
  className="py-24 md:py-32 w-full relative overflow-hidden"
>
  <div className="absolute inset-0 bg-astratintedwhite"></div>
  <div className="absolute top-0 left-1/2 w-full h-64 blur-3xl -translate-x-1/2 rounded-full"></div>
  <div className="px-6 sm:px-8 md:px-12 max-w-6xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-50 items-center">
    <div className="flex justify-center order-1 md:order-1">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-[var(--color-astraprimary)] text-4xl md:text-5xl font-bold mb-8 md:mb-10">
          Join the Excitement!
        </h2>
        <div className="space-y-6 md:space-y-8">
          <div className="flex items-start gap-4">
            <p className="text-[var(--color-astrablack)] text-base md:text-lg">
              From engaging workshops to exciting celebrations, there’s always something happening. Don’t just watch—participate, engage, and make each event unforgettable!
            </p>
          </div>
          <Link href="/events" passHref>
                <button className="mt-12 border-2 border-astraprimary text-astrawhite bg-astraprimary hover:bg-astrawhite hover:text-astraprimary rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer w-[200px] h-[60px]">
              See Events
            </button>
            </Link>
        </div>
      </motion.div>
    </div>
    <motion.div
      initial={{ opacity: 0, rotateY: -30 }}
      whileInView={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="relative order-2 md:order-2"
    >
      <div className="absolute rounded-full blur-xl opacity-30 animate-pulse"></div>
      <Image
        src="/homepage-vector1.gif"
        alt="Institute of Computer Science Logo"
        width={500}
        height={500}
        className="relative z-10 transform transition-all duration-500 hover:scale-105 object-contain"
      />
    </motion.div>
  </div>
</section>


      {/* Looping Image Section going left */}
      <section className="py-3 bg-astratintedwhite overflow-hidden">
        <div className="loop-container">
          <div className="loop-track-left">
            {loopImages1.map((image, index) => (
              <div key={index} className="inline-block mr-8 w-100 h-76 relative">
                <Image
                  src={image}
                  fill
                  style={{ objectFit: 'cover', borderRadius: '10px' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Looping Image Section going right */}
      <section className="py-0 bg-astratintedwhite overflow-hidden">
        <div className="loop-container">
          <div className="loop-track-right">
            {loopImages2.map((image, index) => (
              <div key={index} className="inline-block mr-8 w-100 h-76 relative">
                <Image
                  src={image}
                  alt={`Alumni ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover', borderRadius: '10px' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="mission"
        className="py-24 md:py-32 w-full relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-astratintedwhite"></div>
        <div className="absolute top-0 left-1/2 w-full h-64  blur-3xl -translate-x-1/2 rounded-full"></div>
        <div className="px-6 sm:px-8 md:px-12 max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-50 items-center">
            <div className="flex justify-center order-1 md:order-1">
              <motion.div
                initial={{ opacity: 0, rotateY: -30 }}
                whileInView={{ opacity: 1, rotateY: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute rounded-full blur-xl opacity-30 animate-pulse"></div>
                <Image
                  src="/homepage-vector2.gif"
                  alt="Institute of Computer Science Logo"
                  width={500}
                  height={500}
                  className="relative z-10 transform transition-all duration-500 hover:scale-105 object-contain"
                />
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-2 md:order-2"
            >
              <h2 className="text-[var(--color-astraprimary)] text-4xl md:text-5xl font-bold mb-8 md:mb-10">
                Stay Connected with ICS
              </h2>
              <div className="space-y-6 md:space-y-8">
                <div className="flex items-start gap-4">
                  <p className="text-[var(--color-astrablack)] text-base md:text-lg">
                    Stay connected with the latest updates from Astra-ICS. From
                    important news to exciting announcements, find out what’s
                    happening, what’s new, and what’s coming next — all right
                    here.
                  </p>
                </div>
                <Link href="/whats-up" passHref>
                <button className="mt-12 border-2 border-astraprimary text-astrawhite bg-astraprimary hover:bg-astrawhite hover:text-astraprimary rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer w-[200px] h-[60px]">
              See Latest Updates
            </button>
            </Link>
              </div>
            </motion.div>
          </div>
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
        `}
      </style>
    </main>
  );
}