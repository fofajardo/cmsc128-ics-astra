"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import HeaderUser from "../../components/HeaderUser.jsx";
import ProjectCard from "../../components/projects/ProjectCard";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Filter } from "lucide-react";

export default function ProjectsPage({ projects }) {
  const [visibleCount, setVisibleCount] = useState(6);
  const [startIndex, setStartIndex] = useState(0);
  const completedVisibleCount = 3;

  // Filter modal state
  const [showFilter, setShowFilter] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [tempSelectedType, setTempSelectedType] = useState(selectedType);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("Recent");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);




  const toggleFilter = () => {
    setTempSelectedType(selectedType); // reset modal input to current selection
    setShowFilter((prev) => !prev);
  };



  // Navigate Left for completed projects carousel
  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  // Navigate Right for completed projects carousel
  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + 1, completedProjects.length - completedVisibleCount)
    );
  };

  // Sample all projects data
  const allProjects = [...Array(12).keys()].map((i) => ({
    id: i,
    title: `${i % 2 === 0 ? "Scholarship" : "Fundraiser"} Project ${i + 1}`,
    description: `This project aims to provide middle school students the resources they need to excel academically, emotionally, and physically... ${
      i + 1
    }`,
    image: "/projects/assets/Donation.jpg",
    goal: "₱50,000",
    raised: i % 3 === 0 ? "₱10,000" : i % 3 === 1 ? "₱35,000" : "₱48,000",
    donors: "30",
    type: i % 2 === 0 ? "Scholarship" : "Fundraiser",
    endDate: "2025-06-30",
    statud: i % 3 === 0 ? "Completed" : "Ongoing"
  }));
    //completed projects data
    //const completedProjects = allProjects.filter(project => project.status === "Completed");

  // Sample completed projects data
  const completedProjects =
  projects ||
  Array(6).fill({
    image: "/projects/assets/Donation.jpg",
    title: "tapos na",
    description: "This project aims to provide snacks to students to encourage attendance and enhance focus.",
    amountRaised: "₱10,000",
    goalAmount: "₱30,000",
    donors: "32",
    buttonText: "Read story",
  });

  // Filter projects based on type and search term
  const filteredProjects = allProjects.filter((project) => {
    const matchesType = selectedType === "All" || project.type === selectedType;
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const visibleCompletedProjects = completedProjects.slice(
    startIndex,
    startIndex + completedVisibleCount
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Filter Modal */}
      {showFilter && (
        <div
          onClick={toggleFilter}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-astrawhite p-8 rounded-xl w-80"
          >
            <h3 className="font-lb text-xl mb-4">Filter Projects</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="font-s text-astradarkgray mb-2 block">
                  Project Type
                </label>
                <select
                  className="w-full p-2 border border-astragray rounded-lg"
                  value={tempSelectedType}
                  onChange={(e) => setTempSelectedType(e.target.value)}
                >
                  <option value="All">All Projects</option>
                  <option value="Fundraiser">Fundraisers</option>
                  <option value="Scholarship">Scholarships</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="px-4 py-2 border border-astragray text-astradarkgray rounded-lg"
                  onClick={toggleFilter}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-astraprimary text-astrawhite rounded-lg"
                  onClick={() => {
                    setSelectedType(tempSelectedType); // apply the filter
                    toggleFilter();
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          <Link href="/projects/request/goal" passHref>
            <button className="mt-12 border-2 border-astrawhite text-astrawhite hover:bg-astrawhite hover:text-astraprimary rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer w-[200px] h-[60px]">
              Request a Fundraiser
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Project Grid - Dynamic */}
      <section className="bg-astrawhite py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="font-h2 text-center mb-8">Fund the future of technology</h2>

            {/* Search Bar */}
            <div className="flex w-full gap-0 mb-6">
              <input
                type="text"
                placeholder="Search for project"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 p-3 border border-astraprimary rounded-l-md focus:outline-none"
              />
              <button className="px-6 py-3 bg-astraprimary text-astrawhite rounded-r-md flex items-center gap-2">
                <i className="ri-search-line"></i> Search
              </button>
            </div>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center">
              {/* Type Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowTypeDropdown(!showTypeDropdown);
                    setShowStatusDropdown(false);
                    setShowSortDropdown(false);
                  }}
                  className="flex items-center gap-2 border-2 border-astraprimary px-4 py-2 rounded-md text-[#0E6CF3] font-medium"
                >
                  <i className="ri-map-pin-line"></i> Type
                  <i className="ri-arrow-down-s-line"></i>
                </button>
                {showTypeDropdown && (
                  <div className="absolute mt-2 bg-white border border-gray-300 rounded shadow-md z-10 w-48">
                    <button onClick={() => { setSelectedType("All"); setShowTypeDropdown(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">All Projects</button>
                    <button onClick={() => { setSelectedType("Fundraiser"); setShowTypeDropdown(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Fundraiser</button>
                    <button onClick={() => { setSelectedType("Scholarship"); setShowTypeDropdown(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Scholarship</button>
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowStatusDropdown(!showStatusDropdown);
                    setShowTypeDropdown(false);
                    setShowSortDropdown(false);
                  }}
                  className="flex items-center gap-2 border-2 border-astraprimary px-4 py-2 rounded-md text-astraprimary font-medium"
                >
                  <i className="ri-time-line"></i> Status
                  <i className="ri-arrow-down-s-line"></i>
                </button>
                {showStatusDropdown && (
                  <div className="absolute mt-2 bg-white border border-gray-300 rounded shadow-md z-10 w-48">
                    <button onClick={() => { setSelectedStatus("All"); setShowStatusDropdown(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">All</button>
                    <button onClick={() => { setSelectedStatus("Ongoing"); setShowStatusDropdown(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Ongoing</button>
                    <button onClick={() => { setSelectedStatus("Completed"); setShowStatusDropdown(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Completed</button>
                  </div>
                )}
              </div>

              {/* Sort Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSortDropdown(!showSortDropdown);
                    setShowTypeDropdown(false);
                    setShowStatusDropdown(false);
                  }}
                  className="flex items-center gap-2 border-2 border-astraprimary px-4 py-2 rounded-md text-astraprimary font-medium"
                >
                  <i className="ri-filter-2-line"></i> Sort
                  <i className="ri-arrow-down-s-line"></i>
                </button>
                {showSortDropdown && (
                  <div className="absolute mt-2 bg-white border border-gray-300 rounded shadow-md z-10 w-48">
                    <button onClick={() => { setSortOrder("Recent"); setShowSortDropdown(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Most Recent</button>
                    <button onClick={() => { setSortOrder("Oldest"); setShowSortDropdown(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Oldest</button>
                  </div>
                )}
              </div>
            </div>

          </div>


          {/* Project type indicator */}
          {selectedType !== "All" && (
            <div className="mb-4 flex items-center">
              <span className="bg-astraprimary text-astrawhite px-3 py-1 rounded-lg text-sm">
                {selectedType}
              </span>
              <button
                onClick={() => setSelectedType("All")}
                className="ml-2 text-astradarkgray hover:text-astraprimary"
              >
                <Icon icon="ic:round-close" className="text-xl" />
              </button>
            </div>
          )}

          {filteredProjects.length > 0 ? (
            <>
              {/* Dynamic Grid*/}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
                style={{
                  gridAutoRows: "1fr",
                }}
              >
                {filteredProjects.slice(0, visibleCount).map((project) => (
                  <Link
                    href={`/projects/about/${project.id}`}
                    key={project.id}
                    className="block h-full"
                  >
                    <ProjectCard
                      id={project.id}
                      image={project.image}
                      title={project.title}
                      description={project.description}
                      goal={project.goal}
                      raised={project.raised}
                      donors={project.donors}
                      type={project.type}
                      endDate={project.endDate}
                    />
                  </Link>
                ))}
              </div>

              {/* Loading Indicator for large datasets */}
              {visibleCount < filteredProjects.length &&
                filteredProjects.length > 20 && (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-pulse text-astradarkgray">
                    Loading more projects...
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-astradarkgray font-s text-lg">
                No projects found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedType("All");
                  setSearchTerm("");
                }}
                className="mt-4 blue-button"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* See More Button */}
          {visibleCount < filteredProjects.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setVisibleCount(filteredProjects.length)}
                className="px-6 py-2 font-r bg-astrawhite border border-astraprimary text-astraprimary rounded hover:bg-blue-100 transition cursor-pointer flex items-center gap-2"
              >
                <span>Show All</span>
                <span className="bg-astraprimary text-astrawhite px-2 py-0.5 rounded-full text-sm">
                  {filteredProjects.length - visibleCount} more
                </span>
              </button>
            </div>
          )}

          {/*to handle resizing*/}
          <script
            dangerouslySetInnerHTML={{
              __html: `
        // Dynamic grid management
        function handleGridResponsiveness() {
          const cards = document.querySelectorAll('.grid > a');
          const width = window.innerWidth;
          
          // Reset heights first
          cards.forEach(card => {
            card.style.height = 'auto';
          });
          
          // Set initial visible count based on screen size
          if (width < 640) {
            setVisibleCount(prev => prev < 3 ? 3 : prev);
          } else if (width < 1024) {
            setVisibleCount(prev => prev < 4 ? 4 : prev);
          } else {
            setVisibleCount(prev => prev < 6 ? 6 : prev);
          }
          
          // Lazy load images for performance
          if ('IntersectionObserver' in window) {
            const imgObserver = new IntersectionObserver((entries, observer) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  const img = entry.target;
                  const src = img.getAttribute('data-src');
                  if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                  }
                  observer.unobserve(img);
                }
              });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
              imgObserver.observe(img);
            });
          }
        }
        
        window.addEventListener('resize', handleGridResponsiveness);
        handleGridResponsiveness();
      `,
            }}
          />
        </div>
      </section>

      {/* Why Your Support Matters*/}
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
              desc: "Accountability you can compile and run.",
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

      {/* Donation Process*/}
      <section className="bg-astrawhite pt-20 pb-40 px-4">
        <h2 className="font-h2 mb-2 text-astrablack text-center">
          Donation Process
        </h2>
        <div className="px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
          <div className="relative pl-4 md:pl-0">
            {/* Vertical timeline line */}
            <div className="absolute left-0 md:hidden w-1 h-full bg-[var(--color-astraprimary)]"></div>
            <div className="absolute left-1/2 hidden md:block transform -translate-x-1/2 w-1 h-full bg-[var(--color-astraprimary)]"></div>

            {/* Timeline items */}
            {[
              {
                step: "Visit Our Donation Page",
                desc: "Navigate to our secure donation platform where you can review our mission and impact.",
                sub: "🔒 Secure and encrypted connection",
                position: "left",
              },
              {
                step: "Choose a project to support",
                desc: "Choose from a number of causes to support.",
                sub: "💳 Flexible payment options",
                position: "right",
              },
              {
                step: "Fill up the form",
                desc: "Fill in your contact details and payment information. This helps us process your donation and send you a receipt.",
                sub: "📝 Protected and confidential",
                position: "left",
              },
              {
                step: "Receive Confirmation",
                desc: "After your donation is processed, you'll receive a confirmation after we verify your payment.",
                sub: "📧 Confirmation",
                position: "right",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`
            relative mb-12 last:mb-0
            ${item.position === "right" ? "md:pl-8 md:pr-0" : "md:pr-8 md:pl-0"}
          `}
              >
                {/* Timeline dot */}
                <div
                  className={`
              absolute top-0 left-[22px] w-6 h-6 bg-astraprimary rounded-full
              transform -translate-x-1/2 hidden md:block
              md:left-1/2 md:w-8 md:h-8
            `}
                >
                  {/* Step number inside the dot */}
                  <div className="w-full h-full flex items-center justify-center text-astrawhite text-sm font-semibold">
                    {index + 1}
                  </div>
                </div>

                {/* Mobile view step number */}
                <div className="absolute left-0 top-1 text-astrawhite bg-astraprimary rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold md:hidden">
                  {index + 1}
                </div>

                {/* Content container */}
                <div
                  className={`
              md:ml-0 pl-10 md:pl-0
              ${
              item.position === "right"
                ? "md:pl-12 md:w-1/2 md:float-right"
                : "md:pr-12 md:w-1/2 md:float-left"
              }
            `}
                >
                  <h4 className="font-lb text-lg">{item.step}</h4>
                  <p className="text-astradarkgray font-r mt-2">{item.desc}</p>
                  <p className="font-s text-astraprimary mt-1">{item.sub}</p>
                </div>
                <div className="clear-both"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Completed Fundraisers*/}
      <section className="bg-astralightgray pt-20 pb-30">
        <div className="max-w-7xl mx-auto px-4 relative">
          <h2 className="font-h2 text-astrablack mb-3">
            Completed Fundraisers
          </h2>
          <p className="text-astrablack font-r mb-10">
            See the fundraisers and scholarships we&apos;ve brought to life together.
          </p>

          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className={`absolute -left-6 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md hover:bg-astragray transition-all p-2 rounded-full hidden md:flex items-center justify-center ${
                startIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <Icon
                icon="ic:baseline-keyboard-arrow-left"
                className="text-3xl"
              />
            </button>

            {/* Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ease-in-out">
              {visibleCompletedProjects.map((project, index) => (
                <Link
                  href={`/projects/about/${index}`}
                  key={index}
                  className="block"
                >
                  <ProjectCard
                    id={index}
                    image={project.image}
                    title={project.title}
                    description={project.description}
                    goal={project.goalAmount}
                    raised={project.amountRaised}
                    donors={project.donors}
                    endDate={project.endDate || "2025-01-01"}
                    type={project.type || "Fundraiser"}
                    showDonate={false}
                  />
                </Link>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              disabled={
                startIndex >= completedProjects.length - completedVisibleCount
              }
              className={`absolute -right-6 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md hover:bg-astragray transition-all p-2 rounded-full hidden md:flex items-center justify-center ${
                startIndex >= completedProjects.length - completedVisibleCount
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <Icon
                icon="ic:baseline-keyboard-arrow-right"
                className="text-3xl"
              />
            </button>
          </div>

          {/* Mobile-only Pagination Dots */}
          <div className="flex justify-center mt-6 md:hidden">
            {Array.from({
              length: Math.ceil(
                completedProjects.length / completedVisibleCount
              ),
            }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setStartIndex(idx * completedVisibleCount)}
                className={`mx-1 w-2 h-2 rounded-full ${
                  startIndex === idx * completedVisibleCount
                    ? "bg-astraprimary"
                    : "bg-astragray"
                }`}
              />
            ))}
          </div>

          {/* Responsive completedVisibleCount adjustment */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
        function adjustVisibleCount() {
          const width = window.innerWidth;
          if (width < 640) {
            setCompletedVisibleCount(1);
          } else if (width < 1024) {
            setCompletedVisibleCount(2);
          } else {
            setCompletedVisibleCount(3);
          }
        }
        window.addEventListener('resize', adjustVisibleCount);
        adjustVisibleCount();
        
        // Reset startIndex when count changes to avoid showing blank spaces
        setStartIndex(0);
      `,
            }}
          />
        </div>
      </section>
    </div>
  );
}
