"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import axios from "axios";
import eventsVector from "../../assets/search.gif";
import { Table } from "@/components/TableBuilder";
import SkillTag from "@/components/SkillTag";
import { ActionButton } from "@/components/Buttons";
import Pagination from "@/components/search/GroupedEvents/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const ITEMS_PER_PAGE = 10;

export default function Page() {
  const [alumList, setAlumList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [filters, setFilters] = useState({
    minGradYear: "",
    maxGradYear: "",
    location: "",
    skills: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    minGradYear: "",
    maxGradYear: "",
    location: "",
    skills: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handlesearch = () => {
    setCurrentPage(1);
    // Apply filters immediately on search for all input fields
    setAppliedFilters(filters);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchAlumniProfiles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/alumni-profiles`,
          {
            params: {
              page: currentPage,
              limit: ITEMS_PER_PAGE,
              search: searchTerm || undefined,
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
                  `Failed to fetch degree programs for user_id: ${idForDegree}`,
                  degreeError
                );
              }

              return alumData;
            })
          );

          setAlumList(updatedAlumList);
        } else {
          console.error("Unexpected response:", response.data);
          setAlumList([]);
        }
      } catch (error) {
        console.error("Failed to fetch alumni:", error);
        setAlumList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumniProfiles();
  }, [currentPage, searchTerm]);

  const filteredAlumList = useMemo(() => {
    let currentFilteredList = alumList;

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      currentFilteredList = currentFilteredList.filter((alum) => {
        const fullName = `${alum.first_name} ${alum.last_name}`.toLowerCase();
        const partialFirstNameMatch = alum.first_name
          .toLowerCase()
          .includes(lowerSearchTerm);
        const partialLastNameMatch = alum.last_name
          .toLowerCase()
          .includes(lowerSearchTerm);
        const fullNameMatch = fullName.includes(lowerSearchTerm);

        return partialFirstNameMatch || partialLastNameMatch || fullNameMatch;
      });
    }

    return currentFilteredList.filter((alum) => {
      const gradYear =
        alum.year_graduated !== "N/A"
          ? parseInt(alum.year_graduated.substring(0, 4), 10)
          : null;

      const withinMinYear =
        !appliedFilters.minGradYear ||
        (gradYear && gradYear >= parseInt(appliedFilters.minGradYear, 10));

      const withinMaxYear =
        !appliedFilters.maxGradYear ||
        (gradYear && gradYear <= parseInt(appliedFilters.maxGradYear, 10));

      const matchesLocation =
        !appliedFilters.location ||
        (alum.location &&
          alum.location.toLowerCase().includes(appliedFilters.location.toLowerCase()));

      const skillsMatch =
        !appliedFilters.skills ||
        alum.skills.some((skill) =>
          skill.toLowerCase().includes(appliedFilters.skills.toLowerCase())
        );

      return withinMinYear && withinMaxYear && matchesLocation && skillsMatch;
    });
  }, [alumList, appliedFilters, searchTerm]);

  const sortedAlumList = useMemo(() => {
    let sortedList = [...filteredAlumList];
    if (sortBy === "firstName") {
      sortedList.sort((a, b) => a.first_name.localeCompare(b.first_name));
    } else if (sortBy === "lastName") {
      sortedList.sort((a, b) => a.last_name.localeCompare(b.last_name));
    } else if (sortBy === "graduationYear") {
      sortedList.sort((a, b) => {
        const yearA =
          a.year_graduated !== "N/A"
            ? parseInt(a.year_graduated.substring(0, 4), 10)
            : 9999;
        const yearB =
          b.year_graduated !== "N/A"
            ? parseInt(b.year_graduated.substring(0, 4), 10)
            : 9999;
        return yearA - yearB;
      });
    }
    return sortedList;
  }, [filteredAlumList, sortBy]);

  const totalPages = useMemo(() => {
    return Math.ceil(sortedAlumList.length / ITEMS_PER_PAGE);
  }, [sortedAlumList.length]);

  const paginatedAlumList = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedAlumList.slice(startIndex, endIndex);
  }, [sortedAlumList, currentPage]);

  const skeletonRows = Array(10)
    .fill({})
    .map(() => ({
      "Image:label-hidden": (
        <div className="flex justify-center p-2">
          <div className="w-12 h-12 m-3 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      ),
      "First Name": (
        <div className="bg-gray-200 h-5 w-24 animate-pulse"></div>
      ),
      "Last Name": (
        <div className="bg-gray-200 h-5 w-24 animate-pulse"></div>
      ),
      "Graduation Year": (
        <div className="text-center bg-gray-200 h-5 w-16 mx-auto animate-pulse"></div>
      ),
      // "Location": (
      //   <div className="text-center bg-gray-200 h-5 w-32 mx-auto animate-pulse"></div>
      // ),
      "Skills": (
        <div className="flex justify-center p-2">
          <div className="bg-gray-200 h-5 w-32 animate-pulse rounded-md"></div>
        </div>
      ),
      "Actions:label-hidden": (
        <div className="flex justify-center p-2">
          {/* <div className="bg-gray-200 h-8 w-16 animate-pulse rounded-md"></div> */}
        </div>
      ),
    }));

  const cols = [
    { label: "Image:label-hidden", justify: "center", visible: "all" },
    {
      label: "First Name",
      justify: "center",
      visible: "sm",
      sortable: true,
      onSort: () => handleSort("firstName"),
    },
    {
      label: "Last Name",
      justify: "center",
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
    // {
    //   label: "Location",
    //   justify: "center",
    //   visible: "lg",
    // },
    {
      label: "Skills",
      justify: "center",
      visible: "lg",
    },
    {
      label: "Actions:label-hidden",
      justify: "center",
      visible: "all",
    },
  ];

  function handleSort(column) {
    setCurrentPage(1);
    setSortBy(column);
  }

  function createRows(alumList) {
    return alumList.map((alum) => ({
      "Image:label-hidden": renderAvatar(
        alum.image,
        `${alum.first_name} ${alum.last_name}`
      ),
      "First Name": renderText(alum.first_name),
      "Last Name": renderText(alum.last_name),
      "Graduation Year": renderText(
        alum.year_graduated !== "N/A" ? alum.year_graduated.substring(0, 4) : "N/A"
      ),
      // "Location": renderText(alum.location),
      "Skills": renderSkills(alum.skills),
      "Actions:label-hidden": <div className="flex justify-center p-2"></div>,
      // "Actions:label-hidden": renderActions(alum.id),
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

  function renderSkills(skills) {
    const visibleSkills = skills.slice(0, 2);
    const remainingCount = skills.length - 2;

    return (
      <div className="relative flex justify-center items-center cursor-default p-2">
        <div className="flex flex-wrap justify-center items-center">
          {visibleSkills.map((skill, index) => (
            <SkillTag key={index} text={skill} margin={"m-1"} />
          ))}
          {remainingCount > 0 && (
            <div className="size-8 flex justify-center items-center rounded-full text-xs font-medium border border-dashed text-astradarkgray bg-astratintedwhite cursor-default">
              +{remainingCount}
            </div>
          )}
        </div>
      </div>
    );
  }

  // function renderActions(id) {
  //   return (
  //     <div className="flex justify-center p-2">
  //       <ActionButton label="View" color="gray" route={`/search/${id}`} />
  //     </div>
  //   );
  // }

  return (
    <div className="w-full bg-astradirtywhite flex flex-col items-center">
      <div className="h-auto" />
      <>
        <div
          className="relative w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/blue-bg.png')" }}
        >
          <div className="max-w-[1440px] mx-auto px-12 py-20 flex flex-col lg:flex-row items-start justify-between text-astrawhite gap-10">
            <div className="max-w-[600px] space-y-6 text-left animate-hero-text">
              <h1 className="text-[60px] font-extrabold leading-[1.1]">
                Alumni Directory
              </h1>
              <p className="text-lg font-medium">
                Discover, connect, and engage with alumni to expand your network!
              </p>
            </div>
            <div className="w-full lg:w-[550px] flex justify-end">
              <div className="relative w-full h-auto max-w-[550px] animate-natural-float">
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
      <section className="py-16 md:py-24 relative w-full flex flex-col items-center">
      <div className="w-full max-w-7xl px-4 md:px-8 flex flex-col items-center"> {/* This div centers its content */}
        <div className="w-full max-w-[1000px] mb-6 md:mb-8 flex flex-col items-center"> {/* Add flex-col items-center here */}
          <div className="flex items-stretch w-full border border-astragray bg-astrawhite">
            <input
              type="text"
              placeholder="Search for alumni"
              className="flex-grow py-4 pl-6 focus:outline-none text-base text-astradark"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <button
              className="px-6 bg-astraprimary hover:bg-astradark text-astrawhite font-semibold transition flex items-center gap-2 cursor-pointer"
              onClick={handlesearch}
            >
              Search
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 justify-center"> {/* Add justify-center here */}
            {/* Graduation Year Inputs */}
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
                onBlur={handlesearch}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {handlesearch();
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
                onBlur={handlesearch}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlesearch();
                  }
                }}
              />
            </div>

            {/* Location Input */}
            <div className="relative">
              <label htmlFor="location" className="sr-only">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Location"
                className="border border-astraprimary p-2 pl-4 h-10 rounded-lg text-sm"
                value={filters.location}
                onChange={handleFilterChange}
                onBlur={handlesearch}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlesearch();
                  }
                }}
              />
            </div>

            {/* Skills Input */}
            <div className="relative">
              <label htmlFor="skills" className="sr-only">Skills</label>
              <input
                type="text"
                id="skills"
                name="skills"
                placeholder="Skills"
                className="border border-astraprimary p-2 pl-4 h-10 rounded-lg text-sm"
                value={filters.skills}
                onChange={handleFilterChange}
                onBlur={handlesearch}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlesearch();
                  }
                }}
              />
            </div>
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