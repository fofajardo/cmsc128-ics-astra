"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import NavbarUser from "../../components/NavbarUser";
import ProjectCard from "../../components/projects/ProjectCard";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function ProjectsPage({projects}) {
  const [visibleCount, setVisibleCount] = useState(6);
  const [startIndex, setStartIndex] = useState(0);
  const completedVisibleCount = 3;
  
// change to actual data, 6 can also be changed to actual number of completed projects
  const completedProjects = projects || Array(6).fill({
    image: "/projects/assets/Donation.jpg",
    title: "Snacks to Support Student Success",
    description: "This project aims to provide snacks to students to encourage attendance and enhance focus.",
    amountRaised: "PHP20K",
    goalAmount: "PHP50K",
    donors: "30K",
    buttonText: "Read story"
  });

   // Navigate Left
   const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  // Navigate Right
  const handleNext = () => {
    setStartIndex((prev) => 
      Math.min(prev + 1, completedProjects.length - completedVisibleCount)
    );
  };

  const allProjects = [...Array(12).keys()].map((i) => ({
    id: i,
    title: `Snacks to Support Student Success ${i + 1}`,
    description: `This project aims to provide middle school students the resources they need to excel academically, emotionally, and physically... ${i + 1}`,
    image: '/projects/assets/Donation.jpg',
    goal: 'PHP50K',
    raised: 'PHP20K',
    donors: '30K',
  }));

  const visibleCompletedProjects = completedProjects.slice(startIndex, startIndex + completedVisibleCount);
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarUser />

      {/* Hero Section */}
      <section className="relative bg-[url('/blue-bg.png')] bg-cover bg-center text-white text-center py-32">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10"
        >
          {/* header text */}
          <h2 className="font-l text-astrawhite text-center mt-10">
            Equal access to tech futures for everyone
          </h2>
          <h1 className="text-[60px] font-extrabold leading-[1.1] text-astrawhite text-center mt-7">
            <span className="block">Your home</span>
            <span className="block mt-4">for help</span>
          </h1>

          {/* Request a fundraiser button */}
          <Link href="/projects/request" passHref>
            <button className="mt-12 border-2 border-astrawhite text-astrawhite hover:bg-astrawhite hover:text-astraprimary rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer w-[200px] h-[60px]">
              Request a Fundraiser
            </button>
          </Link>
        </motion.div>
      </section>
      {/* -----------------need edits----------------*/}
      {/* Project Grid */}
       <section className="bg-astrawhite py-16 px-4">
       <div className="max-w-6xl mx-auto">
      <h2 className="font-h2 mb-8">Fund the future of technology</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProjects.slice(0, visibleCount).map((project) => (
              <ProjectCard
              key={project.id}
              image={project.image}
              title={project.title}
              description={project.description}
              goal={project.goal}
              raised={project.raised}
              donors={project.donors}
                 />
              ))}
        </div>

      {/* See More Button */}
         {visibleCount < allProjects.length && (
          <div className="flex justify-center mt-6">
            <button
            onClick={() => setVisibleCount(visibleCount + 3)}
            className="px-6 py-2 font-r bg-astrawhite border border-astraprimary text-astraprimary rounded hover:bg-blue-100 transition cursor-pointer">
            See More
           </button>
          </div>
            )}
          </div>
        </section>


      {/* Why Your Support Matters (no need edits)*/}
      <section className="bg-astralightgray pt-20 pb-40 px-4 text-center">
        <h2 className="font-h2 mb-2 text-astrablack">
          Why Your Support Matters
        </h2>
        <p className="text-astrablack font-r max-w-2xl mx-auto mt-7 mb-12">
          Your generosity, at any amount, powers real change— <br /> tracked,
          reported, and celebrated.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
          {[
            {
              title: (
                <>
                  Immediate <br /> Impact
                </>
              ),
              desc: "Your donation powers urgent aid—where it matters most.",
            },
            {
              title: (
                <>
                  Sustainable <br /> Solutions
                </>
              ),
              desc: "Building self-sufficient futures, not quick fixes.",
            },
            {
              title: (
                <>
                  Transparent <br /> Operations
                </>
              ),
              desc: "Accountability you can compile aFnd run.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-astratintedwhite text-astrablack p-10 rounded-xl shadow-md"
            >
              <h3 className="px-10 py-5 font-lb mb-2 leading-snug">
                {item.title}
              </h3>
              <p className="px-10 mb-10 font-r">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Donation Process */}
      <section className="bg-astrawhite pt-20 pb-40 px-4">
        <h2 className="font-h2 mb-2 text-astrablack text-center mb-12">
          Donation Process
        </h2>
        <div className="max-w-3xl mx-auto space-y-8 relative">
          {[
            {
              step: "Visit Our Donation Page",
              desc: "Navigate to our secure donation platform where you can review our mission and impact.",
              sub: "🔒 Secure and encrypted connection",
            },
            {
              step: "Choose a project to support",
              desc: "Choose from a number of causes to support.",
              sub: "💳 Flexible payment options",
            },
            {
              step: "Fill up the form",
              desc: "Fill in your contact details and payment information. This helps us process your donation and send you a receipt.",
              sub: "📝 Protected and confidential",
            },
            {
              step: "Receive Confirmation",
              desc: "After your donation is processed, you’ll receive a confirmation after we verify your payment.",
              sub: "📧 Confirmation",
            },
          ].map((item, index) => (
            <div key={index} className="relative pl-10">
              <div className="absolute left-0 top-1 text-astrawhite bg-astraprimary rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
              <h4 className="font-lb">{item.step}</h4>
              <p className="text-astradarkgray font-r">{item.desc}</p>
              <p className="font-s text-astraprimary mt-1">{item.sub}</p>
              {index < 3 && (
                <div className="absolute left-2.5 top-6 w-1 h-16 bg-blue-300"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Completed Fundraisers */}
      <section className="bg-astralightgray pt-20 pb-30">
      <div className="max-w-7xl mx-auto px-4 relative">
        <h2 className="font-h2 text-astrablack mb-3">
          Completed Fundraisers
        </h2>
        <p className="text-astrablack font-r mb-10">
        See the fundraisers and scholarships we've brought to life together.
        </p>
        
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className={`absolute left-[-20px] top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md hover:bg-astragray transition-all p-2 rounded-full ${
              startIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <Icon icon="ic:baseline-keyboard-arrow-left" className="text-3xl" />
          </button>

          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ease-in-out">
            {visibleCompletedProjects.map((project, index) => (
              <ProjectCard
                key={index}
                image={project.image}
                title={project.title}
                description={project.description}
                amountRaised={project.amountRaised}
                goalAmount={project.goalAmount}
                donors={project.donors}
                buttonText={project.buttonText}
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            disabled={startIndex >= completedProjects.length - completedVisibleCount}
            className={`absolute right-[-20px] top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md hover:bg-astragray transition-all p-2 rounded-full ${
              startIndex >= completedProjects.length - completedVisibleCount ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <Icon icon="ic:baseline-keyboard-arrow-right" className="text-3xl" />
          </button>
        </div>
      </div>
    </section>
    </div>
  );
}
