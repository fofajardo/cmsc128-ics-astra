"use client";

import Image from "next/image";
import Head from "next/head";
import Slideshow from "@/components/Slideshow";
import { FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Users, Code, Database, Star } from "lucide-react";



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

      <section className="bg-astratintedwhite py-20">
        {/* Display Astra logo */}
        <div className="logo-container flex justify-center items-center py-10">
          <motion.div
            initial={{ opacity: 0, rotateY: -30 }}
            whileInView={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Image
              src="/astra-logo.png"
              alt="Astra Logo"
              width={350}
              height={350}
              priority
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

          <div className="px-6 md:px-16 lg:px-32 xl:px-48 2xl:px-64 py-8">

            <h1 className="text-2xl md:text-3xl lg:text-4xl text-center leading-relaxed">
              <span className="font-bold text-astraprimary">ICS-ASTRA</span>{" "}
              <span className="font-medium text-astrablack">is a</span>{" "}
              <span className="font-medium text-astrablack">
                system catered towards the alumni of the Institute of Computer Science
                (ICS) of the University of the Philippines Los Baños (UPLB). Its
                purpose is to improve and maintain the connections between ICS and its
                alumni that it had produced over the years.
              </span>
            </h1>
          </div>
        </motion.div>


      </section>

      {/* Mission section */}
      <section
        id="mission"
        className="py-24 md:py-32 w-full relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-astrawhite)] to-[var(--color-astratintedwhite)]"></div>
        <div className="absolute top-0 left-1/2 w-full h-64 bg-[var(--color-astraprimary)]/10 blur-3xl -translate-x-1/2 rounded-full"></div>
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
                <div className="absolute -inset-4 bg-gradient-to-br from-[var(--color-astraprimary)] to-[var(--color-astraprimary)]/30 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <Image
                  src="/homepage-vector1.gif"
                  alt="Institute of Computer Science Logo"
                  width={500}
                  height={500}
                  className="relative z-10 transform transition-all duration-500 hover:scale-105"
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
                    Stay connected with the latest updates from Astra-ICS. From important news to exciting announcements, find out what’s happening, what’s new, and what’s coming next — all right here.
                  </p>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </section>


    </main>
  );
}
