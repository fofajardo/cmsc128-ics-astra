"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "../../components/projects/ProjectCard";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Filter, User } from "lucide-react";
import axios from "axios";
import { PROJECT_STATUS, PROJECT_STATUS_LABELS, PROJECT_TYPE, REQUEST_STATUS } from "../../../common/scopes";
import { capitalizeName } from "@/utils/format.jsx";
import { useSignedInUser } from "@/components/UserContext.jsx";
import { LoadingSpinner } from "@/components/LoadingSpinner.jsx";
import FilterDropdown from "@/components/events/GroupedEvents/FilterDropdown";
import Image from "next/image";
import donationVector from "../../assets/donation-vector.png";
import { ParticlesBackground } from "@/components/ParticlesBackground";

export default function ProjectsPage() {
  const user = useSignedInUser();
  const [visibleCount, setVisibleCount] = useState(6);
  const [startIndex, setStartIndex] = useState(0);
  const finishedVisibleCount = 3;

  // Filter modal state
  const [showFilter, setShowFilter] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [tempSelectedType, setTempSelectedType] = useState(selectedType);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectPhotos, setProjectPhotos] = useState({});

  useEffect(() => {
    const fetchApprovedProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/requests/projects`, {
          params: { status: REQUEST_STATUS.APPROVED }
        });
        const projectData = response.data;
        if (projectData.status === "OK") {
          // extract project id's
          const projectIds = projectData.list.map(project => project.projectData.project_id);

          // map for photos initialization
          const photoMap = {};

          // fetch individual project photos
          const photoPromises = projectIds.map(async (projectId) => {
            try {
              const photoResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/project/${projectId}`
              );

              if (photoResponse.data.status === "OK" && photoResponse.data.photo) {
                photoMap[projectId] = photoResponse.data.photo;
              }
            } catch (error) {
              ; // console.error(`Failed to fetch photo for project_id ${projectId}:`, error);
            }
          });

          await Promise.all(photoPromises);
          setProjectPhotos(photoMap);

          setProjects(
            projectData.list.map(
              project => ({
                id: project.projectData.project_id,
                title: project.projectData.title,
                description: project.projectData.details,
                image: photoMap[project.projectData.project_id] || "/projects/assets/Donation.jpg",
                goal: project.projectData.goal_amount.toString(),
                raised: project.projectData.total_donations.toString(),
                donors: project.projectData.number_of_donors,
                type: project.projectData.type,
                endDate: project.projectData.due_date,
                project_status: project.projectData.project_status,
                donationLink: project.projectData.donation_link,
                requester: project.requesterData.full_name,
                dateCompleted: project.projectData.date_complete,
                status: project.status,
                request_id: project.request_id,
              })
            )
          );
        } else {
          ; // console.error("Unexpected response:", projectData);
        }
      } catch (error) {
        ; // console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedProjects();
  }, []);

  const toggleFilter = () => {
    setTempSelectedType(selectedType); // reset modal input to current selection
    setShowFilter((prev) => !prev);
  };

  // Navigate Left for finished projects carousel
  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  // Navigate Right for finished projects carousel
  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + 1, finishedProjects.length - finishedVisibleCount)
    );
  };

  const allProjects = projects;

  const finishedProjects = allProjects.filter(project => project.project_status === PROJECT_STATUS.FINISHED);

  // Filter projects based on type and search term
  const filteredProjects = allProjects.filter((project) => {
    const matchesType = !selectedType || !selectedType.label || selectedType.label.toLowerCase() === project.type.toLowerCase();
    const matchesSearch = !searchTerm || project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || PROJECT_STATUS_LABELS[project.project_status] === selectedStatus.label;

    // Check if project is past due date
    const isPastDueDate = new Date(project.endDate) < new Date();
    const isActive = !isPastDueDate && project.project_status !== PROJECT_STATUS.FINISHED;

    // If project is past due date and not already marked as finished, it should be considered inactive
    if (isPastDueDate && project.project_status !== PROJECT_STATUS.FINISHED) {
      project.project_status = PROJECT_STATUS.FINISHED;
    }

    return matchesType && matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (!sortOrder || sortOrder.label === "Most Recent") {
      return new Date(a.endDate) - new Date(b.endDate);
    } else if (sortOrder.label === "Oldest") {
      return new Date(b.endDate) - new Date(a.endDate);
    }
    return 0;
  });

  const visibleCompletedProjects = finishedProjects.slice(
    startIndex,
    startIndex + finishedVisibleCount
  );

  return (
    <div className="w-full bg-astradirtywhite">
      {/* Hero Section */}
      <div className="relative w-full bg-cover bg-center" style={{ backgroundImage: "url('/blue-bg.png')" }}>
        <ParticlesBackground count={40} />
        <div className="max-w-[1440px] mx-auto px-12 py-20 flex flex-col lg:flex-row items-center justify-between text-astrawhite gap-10">
          <div className="max-w-[600px] space-y-6 text-center lg:text-left animate-hero-text">
            <h1 className="text-[60px] font-extrabold leading-[1.1]">
              Donations & <br /> Fundraising Projects
            </h1>
            <p className="text-lg font-medium">
              Discover, support, and contribute to meaningful causes initiated by people like you.
            </p>
            {!user.state.isGuest && (
              <Link href="/projects/request/goal" passHref>
                <button className="mt-4 px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-astraprimary rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
                  Request a Project
                </button>
              </Link>
            )}
          </div>
          <div className="w-full lg:w-[550px] flex justify-center">
            <div className="relative w-full h-auto max-w-[550px] animate-natural-float">
              <Image
                src={donationVector}
                alt="Projects Illustration"
                className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="relative z-20 bg-astradirtywhite w-full py-14 -mt-10 border-t border-astradarkgray">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-8 px-4">
          <div className="w-full max-w-[1000px]">
            <div className="flex items-stretch w-full border border-astragray bg-astrawhite">
              <input
                type="text"
                placeholder="Search for a project"
                className="flex-grow py-4 pl-6 focus:outline-none text-base text-astradark"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="px-6 bg-astraprimary hover:bg-astradark text-astrawhite font-semibold transition flex items-center gap-2 cursor-pointer">
                Search
              </button>
            </div>
          </div>

          <div className="w-full max-w-[1000px] flex flex-wrap justify-center gap-4 text-sm font-medium z-20">
            <FilterDropdown
              icon="ri-search-line"
              placeholder="Type"
              value={selectedType}
              options={[
                { label: "Clear", icon: "mdi:close-circle-outline" },
                { label: capitalizeName(PROJECT_TYPE.FUNDRAISING), icon: "mdi:currency-usd" },
                { label: capitalizeName(PROJECT_TYPE.SCHOLARSHIP), icon: "mdi:school-outline" },
                { label: capitalizeName(PROJECT_TYPE.DONATION_DRIVE), icon: "mdi:gift-outline" },
              ]}
              onChange={(selected) => selected.label === "Clear" ? setSelectedType(null) : setSelectedType(selected)}
            />

            <FilterDropdown
              icon="ri-time-line"
              placeholder="Status"
              value={selectedStatus}
              options={[
                { label: "Clear", icon: "mdi:close-circle-outline" },
                { label: PROJECT_STATUS_LABELS[PROJECT_STATUS.AWAITING_BUDGET], icon: "mdi:clipboard-list-outline" },
                { label: PROJECT_STATUS_LABELS[PROJECT_STATUS.ONGOING], icon: "mdi:progress-clock" },
                { label: PROJECT_STATUS_LABELS[PROJECT_STATUS.FINISHED], icon: "mdi:check-circle-outline" },
              ]}
              onChange={(selected) => selected.label === "Clear" ? setSelectedStatus(null) : setSelectedStatus(selected)}
            />

            <FilterDropdown
              icon="ri-filter-2-line"
              placeholder="Sort By"
              value={sortOrder}
              options={[
                { label: "Clear", icon: "mdi:close-circle-outline" },
                { label: "Most Recent", icon: "mdi:sort-calendar-descending" },
                { label: "Oldest", icon: "mdi:sort-calendar-ascending" },
              ]}
              onChange={(selected) => selected.label === "Clear" ? setSortOrder(null) : setSortOrder(selected)}
            />
          </div>
        </div>
      </div>

      <section className="bg-astradirtywhite py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="bg-astradirtywhite p-6 rounded-b-xl flex items-center justify-center">
              <LoadingSpinner className="h-15 w-15" />
            </div>
          ) : (
            filteredProjects.length > 0 ? (
              <>
                {/* Dynamic Grid*/}
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
                  style={{
                    gridAutoRows: "1fr",
                  }}
                >
                  {filteredProjects.slice(0, visibleCount).map((project) => (
                    <div className="block h-full"
                      key={project.id}
                    >
                      <ProjectCard
                        id={project.id}
                        image={project.image}
                        title={project.title}
                        description={project.description}
                        goal={project.goal}
                        raised={project.raised}
                        donors={project.donors}
                        endDate={project.endDate}
                        type={project.type}
                        requestId={project.request_id}
                        donationLink={project.donationLink}
                        showDonate={user?.state?.user && project.project_status !== PROJECT_STATUS.FINISHED ? true : false}
                      />
                    </div>
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
                    setSelectedType(null);
                    setSearchTerm("");
                    setSelectedStatus(null);
                    setSortOrder(null);
                  }}
                  className="mt-4 blue-button"
                >
                  Reset Filters
                </button>
              </div>
            )
          )}

          {/* See More Button */}
          {visibleCount < filteredProjects.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setVisibleCount(filteredProjects.length)}
                className="my-6 hover:text-astrawhite border border-astraprimary rounded-lg relative flex h-9 w-28 items-center justify-center overflow-hidden bg-astrawhite text-astraprimary transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-astraprimary before:duration-500 before:ease-out hover:before:h-40 hover:before:w-40"
              >
                <span className="relative z-10 text-sm md:text-md font-medium">See More</span>
              </button>
            </div>
          )}

          {/* My Projects Section */}
          {user?.state?.user && <div className="mt-10 bg-astralightgray/30 py-10 px-6 rounded-xl shadow-md">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <h3 className="font-lb text-2xl text-astrablack mb-3">Track Your Fundraisers</h3>
                <p className="text-astradarkgray max-w-xl">
                  View the status of your submitted fundraisers, respond to messages, and manage your fundraising projects in one place.
                </p>
              </div>
              <Link href={`/projects/my-projects/${encodeURI(user?.state?.user?.id)}`} passHref>
                <button className="px-8 py-4 bg-astraprimary text-astrawhite rounded-lg hover:bg-astraprimary/90 transition flex items-center gap-2 font-medium">
                  <User className="w-5 h-5" />
                  My Projects
                </button>
              </Link>
            </div>
          </div>}

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
      <section className="bg-astralightgray/30 pt-20 pb-40 px-4 text-center">
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

      {/* Finished Fundraisers*/}
      <section className="bg-astralightgray/30 pt-20 pb-30">
        <div className="max-w-7xl mx-auto px-4 relative">
          <h2 className="font-h2 text-astrablack mb-3">
            Inactive Projects
          </h2>
          <p className="text-astrablack font-r mb-10">
            See the projects we&apos;ve brought to life together.
          </p>

          <div className="relative">
            {/* Left Arrow*/}
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
                  href={`/projects/about/${project.request_id}`}
                  key={index}
                  className="block"
                >
                  <ProjectCard
                    id={project.id}
                    image={project.image}
                    title={project.title}
                    description={project.description}
                    goal={project.goal}
                    raised={project.raised}
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
                startIndex >= finishedProjects.length - finishedVisibleCount
              }
              className={`absolute -right-6 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md hover:bg-astragray transition-all p-2 rounded-full hidden md:flex items-center justify-center ${
                startIndex >= finishedProjects.length - finishedVisibleCount
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
                finishedProjects.length / finishedVisibleCount
              ),
            }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setStartIndex(idx * finishedVisibleCount)}
                className={`mx-1 w-2 h-2 rounded-full ${
                  startIndex === idx * finishedVisibleCount
                    ? "bg-astraprimary"
                    : "bg-astragray"
                }`}
              />
            ))}
          </div>

          {/* Responsive finishedVisibleCount adjustment */}
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
        @keyframes particles {
          0% { background-position: 0 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-natural-float { animation: naturalFloat 8s ease-in-out infinite; }
        .animate-fade-bounce { animation: fadeBounce 1.5s ease forwards; }
        .animate-hero-text { animation: fadeBounce 2s ease-in-out; }
        .animate-particles {
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          animation: particles 60s linear infinite;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}