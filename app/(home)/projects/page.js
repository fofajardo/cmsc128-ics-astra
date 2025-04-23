"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import NavbarUser from "../../components/NavbarUser";
import Footer from "../../components/Footer";
import ProjectCard from "../../components/projects/ProjectCard";
import Image from "next/image";
import Logo from "../../assets/logo.png";
import Link from "next/link";

export default function ProjectsPage() {
  const [visibleCount, setVisibleCount] = useState(6);
  const [showRequestPanel, setShowRequestPanel] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [amount, setAmount] = useState("");
  const [zip, setZip] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleReset = () => {
    setShowRequestPanel(false);
    setStep(1);
    setSelectedOption(null);
    setAmount("");
    setZip("");
    setTitle("");
    setDescription("");
    setImage(null);
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
            Equal access to tech futures
          </h2>
          <h1 className="font-h1 text-astrawhite text-center mt-7">
            <span className="block">Your home</span>
            <span className="block mt-4">for help</span>
          </h1>

          {/* Request a fundraiser button */}
          <Link href="/projects/request" passHref>
            <button className="mt-12 bg-astrawhite text-astraprimary font-semibold py-2 px-6 rounded-xl shadow hover:bg-astralightgray transition cursor-pointer w-[220px] h-[55px]">
              Request a Fundraiser
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Project Grid */}
       <section className="bg-astrawhite py-16 px-4">
       <div className="max-w-6xl mx-auto">
      <h2 className="font-lb mb-8">Fund the future of technology</h2>

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


      {/* Why Your Support Matters */}
      <section className="bg-astralightgray mt-16 py-16 px-4 text-center">
        <h2 className="font-h2 mb-2 text-astrablack">
          Why Your Support Matters
        </h2>
        <p className="text-astrablack font-l max-w-2xl mx-auto mt-7 mb-12">
          Your generosity, at any amount, powers real change—tracked, reported,
          and celebrated.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Immediate Impact",
              desc: "Your donation powers urgent aid—where it matters most.",
            },
            {
              title: "Sustainable Solutions",
              desc: "Building self-sufficient futures, not quick fixes.",
            },
            {
              title: "Transparent Operations",
              desc: "Accountability you can compile and run.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Donation Process */}
      <section className="bg-gray-100 py-16 px-4">
        <h2 className="text-2xl font-semibold text-center mb-12">
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
              <div className="absolute left-0 top-1 text-white bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
              <h4 className="font-bold text-lg">{item.step}</h4>
              <p className="text-gray-700">{item.desc}</p>
              <p className="text-sm text-blue-600 mt-1">{item.sub}</p>
              {index < 3 && (
                <div className="absolute left-2.5 top-6 w-1 h-16 bg-blue-300"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Completed Fundraisers */}
      <section className="bg-blue-100 py-12">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Completed Fundraisers
        </h2>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, index) => (
            <ProjectCard
              key={index}
              image="/projects/assets/Donation.jpg"
              title="Snacks to Support Student Success"
              description="This project aims to provide snacks to students to encourage attendance and enhance focus."
              amountRaised="PHP20K"
              goalAmount="PHP50K"
              donors="30K"
              buttonText="Read story"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
