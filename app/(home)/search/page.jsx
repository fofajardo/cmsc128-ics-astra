"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import axios from "axios";
import eventsVector from "../../assets/search.gif";
import { Table } from "@/components/TableBuilder";
// import SkillTag from "@/components/SkillTag";
import { ActionButton } from "@/components/Buttons";
import Pagination from "@/components/search/GroupedEvents/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChevronDown, faSort, faFilter } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "@iconify/react";
import FilterDropdown from "@/components/events/GroupedEvents/FilterDropdown";

const ITEMS_PER_PAGE = 10;

export default function Page() {
  // Replace dummy data with API data
  const [alumList, setAlumList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({
    minGradYear: "",
    maxGradYear: "",
    // location: "",
    // skills: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    minGradYear: "",
    maxGradYear: "",
    // location: "",
    // skills: "",
  });
  const [showFilters, setShowFilters] = useState({
    graduationYear: false,
    // location: false,
    // skills: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const toggleFilter = (filterName) => {
    setShowFilters((prevShowFilters) => ({
      ...prevShowFilters,
      [filterName]: !prevShowFilters[filterName],
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to the first page when filters are applied
    setAppliedFilters(filters);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset page on search
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      // If clicking the same column, toggle the order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If clicking a new column, set it as the sort column and default to ascending
      setSortBy(column);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const sortOptions = [
    { label: "Clear", icon: "mdi:close-circle-outline" },
    { label: "First Name", icon: "mdi:sort-alphabetical-ascending", id: "firstName" },
    { label: "Last Name", icon: "mdi:sort-alphabetical-ascending", id: "lastName" },
    { label: "Graduation Year", icon: "mdi:sort-numeric-ascending", id: "graduationYear" }
  ];

  const handleSortChange = (selected) => {
    if (selected.label === "Clear") {
      setSortBy("");
      setSortOrder("asc");
    } else {
      handleSort(selected.id);
    }
  };

  useEffect(() => {
    const fetchAlumniProfiles = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/alumni-profiles`,
          {
            params: {
              // Only paginate when not searching
              page: searchTerm ? null : currentPage,
              limit: searchTerm ? null : ITEMS_PER_PAGE,
              search: searchTerm ? null : searchTerm, // We'll handle search on client side for better flexibility
            },
          }
        );


        if (response.data.status === "OK") {
          const updatedAlumList = await Promise.all(
            response.data.list.map(async (alum) => {
              const alumData = {
                id: alum.alum_id,
                first_name: alum.first_name,
                last_name: alum.last_name,
                email: alum.email,
                year_graduated: "N/A",
                location: alum.location || "N/A",
                field: alum.primary_work_experience?.field || "N/A",
                skills: alum.skills ? alum.skills.split(",") : [],
                image: "https://cdn-icons-png.flaticon.com/512/145/145974.png",
              };

              try {
                const photoResponse = await axios.get(
                  `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/alum/${alum.alum_id}`
                );
                if (
                  photoResponse.data.status === "OK" &&
                  photoResponse.data.photo
                ) {
                  alumData.image = photoResponse.data.photo;
                }
              } catch (photoError) {
                console.log(
                  `Failed to fetch photo for alum_id ${alum.alum_id}:`,
                  photoError
                );
              }

              try {
                const idForDegree = alum.user_id || alum.alum_id;
                if (idForDegree) {
                  console.log("Fetching degree programs for user_id:", idForDegree);
                  const degreeResponse = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/v1/degree-programs/alumni/${idForDegree}`
                  );
                  if (
                    degreeResponse.data.status === "OK" &&
                    degreeResponse.data.degreePrograms?.length > 0
                  ) {
                    const sortedPrograms = [
                      ...degreeResponse.data.degreePrograms,
                    ].sort(
                      (a, b) =>
                        new Date(b.year_graduated) -
                        new Date(a.year_graduated)
                    );
                    alumData.year_graduated = sortedPrograms[0].year_graduated;
                  }
                }
              } catch (degreeError) {
                console.error(
                  `Failed to fetch degree programs for user_id: ${alum.user_id || alum.alum_id}`,
                  degreeError
                );
              }

              return alumData;
            })
          );

          // Store the complete list without filtering
          setAlumList(updatedAlumList);
          setLoading(false);
        } else {
          console.error("Unexpected response:", response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch alumni:", error);
        setLoading(false);
      }
    };

    fetchAlumniProfiles();
  }, [currentPage, searchTerm]);

  const filteredAlumList = useMemo(() => {
    return alumList.filter(alum => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      let searchMatch = true;

      if (searchTerm) {
        const fullName = `${alum.first_name} ${alum.last_name}`.toLowerCase();

        // Only match if the search term appears as a consecutive substring
        const partialFirstNameMatch = alum.first_name.toLowerCase().includes(lowerSearchTerm);
        const partialLastNameMatch = alum.last_name.toLowerCase().includes(lowerSearchTerm);
        const fullNameMatch = fullName.includes(lowerSearchTerm);

        searchMatch = partialFirstNameMatch || partialLastNameMatch || fullNameMatch;

        const initials = `${alum.first_name[0]}${alum.last_name[0]}`.toLowerCase();
        const matchesInitials = initials === lowerSearchTerm;

        searchMatch = searchMatch || matchesInitials;
      }

      const gradYear = alum.year_graduated !== "N/A"
        ? parseInt(alum.year_graduated.substring(0, 4), 10)
        : null;

      const withinMinYear = !appliedFilters.minGradYear || !gradYear ||
        gradYear >= parseInt(appliedFilters.minGradYear, 10);

      const withinMaxYear = !appliedFilters.maxGradYear || !gradYear ||
        gradYear <= parseInt(appliedFilters.maxGradYear, 10);

      // const matchesLocation = !appliedFilters.location ||
      //   (alum.location && alum.location.toLowerCase().includes(appliedFilters.location.toLowerCase()));

      // const skillsMatch = !appliedFilters.skills ||
      //   alum.skills.some(skill =>
      //     skill.toLowerCase().includes(appliedFilters.skills.toLowerCase())
      //   );

      // return searchMatch && withinMinYear && withinMaxYear && matchesLocation && skillsMatch;
      return searchMatch && withinMinYear && withinMaxYear;
    });
  }, [alumList, appliedFilters, searchTerm]);

  // Apply sorting only (don't filter here)
  const sortedAlumList = useMemo(() => {
    let sortedList = [...filteredAlumList];
    if (sortBy === "firstName") {
      sortedList.sort((a, b) => {
        const comparison = a.first_name.localeCompare(b.first_name);
        return sortOrder === "asc" ? comparison : -comparison;
      });
    }
    if (sortBy === "lastName") {
      sortedList.sort((a, b) => {
        const comparison = a.last_name.localeCompare(b.last_name);
        return sortOrder === "asc" ? comparison : -comparison;
      });
    }
    if (sortBy === "graduationYear") {
      sortedList.sort((a, b) => {
        const yearA = a.year_graduated !== "N/A" ? parseInt(a.year_graduated.substring(0, 4), 10) : 0;
        const yearB = b.year_graduated !== "N/A" ? parseInt(b.year_graduated.substring(0, 4), 10) : 0;
        return sortOrder === "asc" ? yearA - yearB : yearB - yearA;
      });
    }
    return sortedList;
  }, [filteredAlumList, sortBy, sortOrder]);

  const totalPages = useMemo(() => {
    return Math.ceil(sortedAlumList.length / ITEMS_PER_PAGE);
  }, [sortedAlumList.length]);

  const paginatedAlumList = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedAlumList.slice(startIndex, endIndex);
  }, [sortedAlumList, currentPage]);

  // Define skeleton rows for loading state
  const skeletonRows = Array(10).fill({}).map(() => ({
    "Image:label-hidden": <div className="flex justify-center p-2"><div className="w-12 h-12 m-3 bg-gray-200 rounded-xl animate-pulse"></div></div>,
    "First Name": <div className="bg-gray-200 h-5 w-24 animate-pulse"></div>,
    "Last Name": <div className="bg-gray-200 h-5 w-24 animate-pulse"></div>,
    "Graduation Year": <div className="text-center bg-gray-200 h-5 w-16 mx-auto animate-pulse"></div>,

    // uncomment if you want to show location, skills, and actions
    // "Location": <div className="text-center bg-gray-200 h-5 w-20 mx-auto animate-pulse"></div>,
    // "Skills": <div className="flex justify-center"><div className="bg-gray-200 h-6 w-32 animate-pulse"></div></div>,
    // "Quick Actions": <div className="flex justify-center"><div className="bg-gray-200 h-8 w-16 rounded animate-pulse"></div></div>,
  }));

  // Column definitions
  const cols = [
    { label: "Image:label-hidden", justify: "center", visible: "all" },
    {
      label: "First Name",
      justify: "center",
      // justify: "start",
      visible: "sm",
      sortable: true,
      onSort: () => handleSort("firstName"),
    },
    {
      label: "Last Name",
      justify: "center",
      // justify: "start",
      visible: "sm",
      sortable: true,
      onSort: () => handleSort("lastName"),
    },
    {
      label: "Graduation Year",
      justify: "center",
      visible: "md",
      sortable: true,
      onSort: () => handleSort("graduationYear"),
    },

    // Uncomment if you want to show location, skills, and actions
    // { label: "Location", justify: "center", visible: "lg" },
    // { label: "Skills", justify: "center", visible: "md" },
    // { label: "Quick Actions", justify: "center", visible: "all" },
  ];

  function createRows(alumList) {
    return alumList.map((alum) => ({
      "Image:label-hidden": renderAvatar(alum.image, `${alum.first_name} ${alum.last_name}`),
      "First Name": renderText(alum.first_name),
      "Last Name": renderText(alum.last_name),
      "Graduation Year": renderText(alum.year_graduated !== "N/A" ? alum.year_graduated.substring(0, 4) : "N/A"),
      // Location: renderText(alum.location || "N/A"),
      // Skills: renderSkills(alum.skills || []),
      // "Quick Actions": renderActions(alum.id),
    }));
  }

  function renderAvatar(image, name) {
    return (
      <div className="flex justify-center p-2">
        <div className="w-12 h-12 m-3">
          <img
            src={image}
            className="w-full h-full object-cover rounded-xl"
            alt={name}
          />
        </div>
      </div>
    );
  }

  function renderText(text) {
    return <div className="text-center font-s text-astradarkgray p-2">{text}</div>;
  }

  function renderActions(id) {
    return (
      <div className="flex justify-center p-2">
        <ActionButton label="View" color="gray" route={`/search/${id}`} />
      </div>
    );
  }

  return (
    <div className="w-full bg-astradirtywhite">
      <div className="h-auto" />
      <>
        {/* Hero */}
        <div
          className="relative w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/blue-bg.png')" }}
        >
          <div className="max-w-[1440px] mx-auto px-6 py-10 md:px-12 md:py-16 lg:px-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between text-astrawhite gap-6 lg:gap-10">
            <div className="max-w-[600px] space-y-4 text-center lg:text-left animate-slide-up">
              <h1 className="font-h1 text-astrawhite leading-[1.1] text-3xl md:text-4xl lg:text-5xl">
                Alumni Directory
              </h1>
              <p className="font-l text-astrawhite text-sm md:text-base">
                Discover, connect, and engage with alumni to expand your network!
              </p>
            </div>
            <div className="w-full lg:w-[550px] flex justify-center animate-fade-in">
              <div className="relative w-full h-auto max-w-[400px] md:max-w-[550px]">
                <Image
                  src={eventsVector}
                  alt="Events Illustration"
                  className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Section */}
        <section className="py-16 md:py-24 relative w-full flex flex-col items-center">
          <div className="w-full max-w-7xl px-4 md:px-8 flex flex-col items-center">
            <div className="w-full max-w-[1000px] mb-6 md:mb-8 flex flex-col items-center">
              <div className="flex items-stretch w-full border border-astragray bg-astrawhite">
                <input
                  type="text"
                  placeholder="Search for alumni"
                  className="flex-grow py-4 pl-6 focus:outline-none text-base text-astradark"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button
                  className="px-6 bg-astraprimary hover:bg-astradark text-astrawhite font-semibold transition flex items-center gap-2 cursor-pointer"
                  onClick={handleApplyFilters}
                >
                  Search
                </button>
              </div>

              <div className="flex flex-wrap gap-4 mt-4 justify-start items-end">
                {/* Graduation Year Inputs */}
                <div className="flex flex-col items-start gap-2">
                  <p className="font-medium text-sm text-astradarkgray">Graduation Year</p>
                  <div className="flex items-center gap-2">
                    <label htmlFor="minGradYear" className="sr-only">Min Graduation Year</label>
                    <input
                      type="text"
                      id="minGradYear"
                      name="minGradYear"
                      placeholder="Min Year"
                      className="border border-astraprimary p-2 pl-4 h-10 rounded-lg text-sm"
                      value={filters.minGradYear}
                      onChange={handleFilterChange}
                      onBlur={handleApplyFilters}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleApplyFilters();
                        }
                      }}
                    />
                    <p className="font-normal text-sm leading-6 text-astradarkgray">to</p>
                    <label htmlFor="maxGradYear" className="sr-only">Max Graduation Year</label>
                    <input
                      type="text"
                      id="maxGradYear"
                      name="maxGradYear"
                      placeholder="Max Year"
                      className="border border-astraprimary p-2 pl-4 h-10 rounded-lg text-sm"
                      value={filters.maxGradYear}
                      onChange={handleFilterChange}
                      onBlur={handleApplyFilters}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleApplyFilters();
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Sort Dropdown */}
                <FilterDropdown
                  icon="material-symbols:sort"
                  options={sortOptions}
                  placeholder="Sort by"
                  value={sortBy ? sortOptions.find(opt => opt.id === sortBy) : null}
                  onChange={handleSortChange}
                />
              </div>
            </div>

            <svg
              className="my-4 md:my-7 w-full"
              xmlns="http://www.w3.org/2000/svg"
              width="1216"
              height="2"
              viewBox="0 0 1216 2"
              fill="none"
            >
              <path className="stroke-astragray" d="M0 1H1216" />
            </svg>

            <div className="overflow-x-auto w-full max-w-7xl">
              {loading ? (
                <Table cols={cols} data={skeletonRows} />
              ) : (
                <>
                  <Table cols={cols} data={createRows(paginatedAlumList)} />
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </>
    </div>
  );
}