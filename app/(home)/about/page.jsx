"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Users, Code, Database, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StarParticlesBackground } from "@/components/StarParticlesBackground";

export default function AboutPage() {
  const timelineItems = [
    {
      year: "1982",
      content:
        "Computer Science was first recognized as a discipline in UPLB when the Institute of Mathematical Sciences and Physics (IMSP) was established with the Division of Computer Science as one of its divisions.",
      position: "left",
    },
    {
      year: "1983",
      content: (
        <>
          <p className="mb-4">
            The Bachelor of Science in Computer Science (BSCS) program at UPLB
            was established concurrently with the Division of Computer Science.
            The program was officially instituted in 1982, the first students
            were accepted in 1983.
          </p>
          <p>
            When the BSCS program first started, the computer science courses
            were taught by three professors and statistics instructors. They
            were Dr. Manuel M. Manuel, Dr. Eliezer A. Albacea (then instructor),
            and Prof. Wilfredo E. Cabezon.
          </p>
        </>
      ),
      position: "right",
    },
    {
      year: "1988",
      content:
        "The Master of Science in Computer Science program was established by the Division. This became very popular among the Division's teaching staff.",
      position: "left",
    },
    {
      year: "1995",
      content:
        "In January 26, 1995, the UP Board of Regents separated the Division of Computer Science from IMSP and merged this with the existing Los Baños Computer Center to form the Institute of Computer Science (ICS). Dr. Eliezer A. Albacea then became the first Director of ICS.",
      position: "right",
    },
    {
      year: "1996",
      content: (
        <>
          <p className="mb-4">
            The institute was designated by the Board of Regents as a pilot
            institute to implement the concept of a System Academic Program.
          </p>
          <p className="mb-4">
            Dr. Eliezer A. Albacea was designated System Director for the UP
            System Computer Science Program. ICS is instrumental in the
            institution of BSCS programs in UP Manila, UP in the Visayas (Cebu,
            Tacloban, and Iloilo), UP College Baguio, and UP Mindanao.
          </p>
          <p>
            ICS also instituted the Diploma in Computer Science (now
            discontinued).
          </p>
        </>
      ),
      position: "left",
    },
    {
      year: "1998",
      content:
        "The Doctor of Philosophy (PhD) in Computer Science was instituted.",
      position: "right",
    },
    {
      year: "2002",
      content: "The Master of Information Technology was instituted.",
      position: "left",
    },
    {
      year: "2015",
      content:
        "The Institute of Computer Science was recognized as a Center of Excellence in Information Technology by the Commission on Higher Education (CHED).",
      position: "right",
    },
  ];

  const [activeTab, setActiveTab] = useState("team-leaders");
  const [isInView, setIsInView] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    const timelineElement = document.getElementById("timeline");
    if (timelineElement) {
      observer.observe(timelineElement);
    }

    return () => {
      if (timelineElement) {
        observer.unobserve(timelineElement);
      }
    };
  }, []);

  const contributors = {
    "team-leaders": [
      {
        name: "Francis Dominic Fajardo",
        role: "Project Manager",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "John Paul Minoc",
        role: "Frontend Team Leader",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Jan Neal Isaac Villamin",
        role: "Backend Team Leader",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Franc Roger Glason Aguitez",
        role: "Database Team Leader",
        avatar: "/Placeholder.png?height=100&width=100",
      },
    ],
    "frontend-members": [
      {
        name: "John Paul Minoc",
        role: "Frontend Team Leader",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Mark Neil Autriz",
        role: "Frontend Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Axel Balitaan",
        role: "Frontend Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Armie Casasola",
        role: "Frontend Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Bryan Kyle Delfino",
        role: "Frontend Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Jon Alem San Gregorio",
        role: "Frontend Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Ashton Stephonie Matias",
        role: "Frontend Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Julius Christian Namata",
        role: "Frontend Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Bernard Jezua Tandang",
        role: "Frontend Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Riggs Mikael Tomas",
        role: "Frontend Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
    ],
    "backend-members": [
      {
        name: "Jan Neal Isaac Villamin",
        role: "Backend Team Leader",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Dominic Abelarde",
        role: "Backend Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Franc Roger Glason Aguitez",
        role: "Backend Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Psymon Sez Arcedera",
        role: "Backend Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Joenzsen Jonner Camara",
        role: "Backend Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "John Nico De Castro",
        role: "Backend Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Francis Dominic Fajardo",
        role: "Backend Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Clarence Manzanido",
        role: "Backend Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Jake Laurence Neverida",
        role: "Backend Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Lorenzo Rafael Uichanco",
        role: "Backend Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
    ],
    "database-members": [
      {
        name: "Franc Roger Glason Aguitez",
        role: "Database Team Leader",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Joenzsen Jonner Camara",
        role: "Database Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Ashton Stephonie Matias",
        role: "Database Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Julius Christian Namata",
        role: "Database Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
      {
        name: "Riggs Mikael Tomas",
        role: "Database Developer",
        avatar: "/Placeholder.png?height=100&width=100",
      },
    ],
  };

  // Function to get tab label based on screen size
  const getTabLabel = (category) => {
    const labels = {
      "team-leaders": "Team Leaders",
      "frontend-members": "Frontend",
      "backend-members": "Backend",
      "database-members": "Database",
    };
    return labels[category];
  };

  // Function to get icon for each tab
  const getTabIcon = (category) => {
    switch (category) {
    case "team-leaders":
      return <Users className="h-4 w-4" />;
    case "frontend-members":
      return <Code className="h-4 w-4" />;
    case "backend-members":
      return <Code className="h-4 w-4" />;
    case "database-members":
      return <Database className="h-4 w-4" />;
    default:
      return <Users className="h-4 w-4" />;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--color-astrawhite)] to-[var(--color-astratintedwhite)]">
      {/* Hero section */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden isolate">
        <div
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: "url(\"/about-bg.png\")",
            filter: "brightness(0.7)",
            transform: "scale(1.2)", // Smoother parallax
            backgroundAttachment: "fixed",
          }}
        >
          <StarParticlesBackground count={40} />
        </div>
        <div className="absolute inset-0 bg-black/20"></div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-6 md:px-8 max-w-4xl"
        >
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-6 md:mb-8 leading-[1.1]">
            Building the Future:
            <br />
            <span className="text-[var(--color-astraprimary)] leading-[1.1]">
              Our Mission and Story
            </span>
          </h1>
          <p className="text-white/90 text-base md:text-lg leading-relaxed mb-8">
            The Institute of Computer Science at UPLB is recognized for its
            commitment to excellence in computer science education and research,
            producing skilled graduates and contributing to the advancement of
            the field in the Philippines.
          </p>
        </motion.div>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/70" />
        </div>
      </section>

      {/* Mission section */}
      <section
        id="mission"
        className="py-24 md:py-32 w-full relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-astrawhite)] to-[var(--color-astratintedwhite)]"></div>
        <div className="absolute top-0 left-1/2 w-full h-64 bg-[var(--color-astraprimary)]/10 blur-3xl -translate-x-1/2 rounded-full"></div>
        <div className="px-6 sm:px-8 md:px-12 max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
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
                  src="/ics-logo.png"
                  alt="Institute of Computer Science Logo"
                  width={350}
                  height={350}
                  className="relative z-10 transform transition-all duration-500 hover:scale-105 w-48 md:w-72"
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
              <h2 className="text-[var(--color-astraprimary)] text-4xl md:text-5xl font-bold mb-8 md:mb-10 text-center md:text-left">
                Our Mission
              </h2>
              <div className="space-y-6 md:space-y-8">
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-[var(--color-astraprimary)]/20 p-2 rounded-full">
                    <Star
                      className="h-5 w-5 text-[var(--color-astraprimary)]"
                      fill="currentColor"
                    />
                  </div>
                  <p className="text-[var(--color-astrablack)] text-base md:text-lg">
                    To produce the needed quality manpower for the Philippines&apos;
                    software industry and the manpower needed to carry out the
                    information processing functions of private and government
                    institutions.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-[var(--color-astraprimary)]/20 p-2 rounded-full">
                    <Star
                      className="h-5 w-5 text-[var(--color-astraprimary)]"
                      fill="currentColor"
                    />
                  </div>
                  <p className="text-[var(--color-astrablack)] text-base md:text-lg">
                    To carry out high-level research and development in computer
                    science and computer hardware so as to enhance locally
                    produced computer products.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-[var(--color-astraprimary)]/20 p-2 rounded-full">
                    <Star
                      className="h-5 w-5 text-[var(--color-astraprimary)]"
                      fill="currentColor"
                    />
                  </div>
                  <p className="text-[var(--color-astrablack)] text-base md:text-lg">
                    To continuously upgrade the computing personnel of industry
                    and government through training.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section id="timeline" className="py-24 md:py-32 w-full bg-astrawhite">
        <div className="px-6 sm:px-8 md:px-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-[var(--color-astraprimary)] text-4xl md:text-5xl font-bold mb-6">
              Our Journey Through Time
            </h2>
            <p className="text-[var(--color-astrablack)]/80 max-w-2xl mx-auto">
              From humble beginnings to becoming a Center of Excellence, explore
              the rich history of the Institute of Computer Science at UPLB.
            </p>
          </motion.div>
          <div className="relative pl-4 md:pl-0">
            <div className="absolute left-0 md:hidden w-1 h-full bg-gradient-to-b from-[var(--color-astraprimary)] via-[var(--color-astraprimary)]/70 to-[var(--color-astraprimary)]/30"></div>
            <div className="absolute left-1/2 hidden md:block transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[var(--color-astraprimary)] via-[var(--color-astraprimary)]/70 to-[var(--color-astraprimary)]/30"></div>

            {/* Timeline items */}
            {timelineItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  x: item.position === "right" ? 50 : -50,
                }}
                animate={hasMounted && isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`
                  relative mb-8 md:mb-12
                  flex flex-col
                  items-start
                  pl-0 sm:pl-4
                  ${item.position === "right" ? "md:items-end md:pl-12 md:pr-0" : "md:items-start md:pr-12 md:pl-0"}
                `}
              >
                {/* Timeline circle */}
                <div
                  className="hidden md:block absolute top-0 left-1/2 w-5 h-5 md:w-7 md:h-7 rounded-full
                    bg-[var(--color-astraprimary)] shadow-lg shadow-[var(--color-astraprimary)]/30
                    transform -translate-x-1/2"
                ></div>

                {/* Content container */}
                <div
                  className={`
                  bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg
                    border border-[var(--color-astralightgray)]/30 w-full md:w-1/2
                    transform transition-all duration-300 hover:shadow-xl hover:bg-white
                    ${item.position === "right" ? "md:ml-8 md:mr-0" : "md:mr-8 md:ml-0"}
                  `}
                >
                  <h3 className="text-[var(--color-astraprimary)] text-xl md:text-2xl font-bold mb-4 inline-flex items-center gap-3">
                    {item.year}
                    <div className="h-1 w-10 bg-[var(--color-astraprimary)]/30 rounded-full"></div>
                  </h3>
                  <div className="text-[var(--color-astrablack)] text-base md:text-lg text-justify leading-relaxed">
                    {typeof item.content === "string" ? (
                      <p>{item.content}</p>
                    ) : (
                      item.content
                    )}
                  </div>
                </div>

                {/* Clear floats on desktop */}
                <div className="clear-both"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="w-full py-24 md:py-32 bg-lightgray">
        <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto text-[var(--color-astrablack)]">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center mb-12 md:mb-16 space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-[var(--color-astraprimary)]/10">
                  <Rocket className="h-8 w-8 md:h-10 md:w-10 text-[var(--color-astraprimary)]" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-astrablack)]">
                  ICS-ASTRA
                </h2>
              </div>
              <p className="text-[var(--color-astradarkgray)] max-w-2xl mx-auto px-2">
                ASTRA stands for <b>A</b>lumni <b>S</b>ynced <b>T</b>racking for{" "}
                <b>R</b>elations and <b>A</b>dvancement. Meet the brilliant
                minds behind our mission to connect with the alumni of the
                Institute of Computer Science at UPLB.
              </p>
              <div className="flex gap-1">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ rotate: 0 }}
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    >
                      <Star
                        className="h-6 w-6 text-[var(--color-astraprimary)]"
                        fill="currentColor"
                      />
                    </motion.div>
                  ))}
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex justify-center overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex justify-center mb-6 md:mb-8 flex-wrap gap-2">
                {Object.keys(contributors).map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setActiveTab(category)}
                    className={`
                    flex items-center gap-1 md:gap-2 text-xs md:text-sm px-3 py-1.5 rounded-full
                    border border-[var(--color-astralightgray)]
                    ${activeTab === category ? "bg-[var(--color-astraprimary)] text-white" : "bg-[var(--color-astradirtywhite)] text-[var(--color-astradarkgray)]"}
                    transition-all duration-200
                    hover:scale-105 hover:bg-[var(--color-astraprimary)] hover:text-white
                  `}
                    whileTap={{ scale: 0.95 }}
                  >
                    {getTabIcon(category)}
                    <span className="font-medium">
                      {getTabLabel(category)}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
            {/* Contributors grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
              >
                {contributors[activeTab].map((contributor, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{
                      y: -5,
                      boxShadow:
                        "0 10px 25px -5px rgba(var(--color-astraprimary-rgb), 0.3)",
                    }}
                  >
                    <Card className="h-full bg-white border-[var(--color-astradirtywhite)] overflow-hidden rounded-xl transition-all duration-300">
                      <CardContent className="p-5 md:p-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="relative w-full">
                            <div className="absolute inset-0"></div>
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto rounded-full overflow-hidden border-2 border-[var(--color-astraprimary)] shadow-lg shadow-[var(--color-astraprimary)]/20">
                              <img
                                src={contributor.avatar || "/placeholder.svg"}
                                alt={contributor.name}
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                              />
                            </div>
                          </div>
                          <div className="space-y-2 pt-2">
                            <h3 className="text-base md:text-lg font-bold text-[var(--color-astrablack)]">
                              {contributor.name}
                            </h3>
                            <div className="flex items-center justify-center">
                              <div className="h-0.5 w-6 bg-[var(--color-astraprimary)]/30 rounded-full mr-2"></div>
                              <p className="text-sm md:text-base text-[var(--color-astradarkgray)]">
                                {contributor.role}
                              </p>
                              <div className="h-0.5 w-6 bg-[var(--color-astraprimary)]/30 rounded-full ml-2"></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Scroll to top button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-[var(--color-astraprimary)] text-white shadow-lg shadow-[var(--color-astraprimary)]/20 z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
      </motion.button>
    </main>
  );
}

//helper function for chevron down icon
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
