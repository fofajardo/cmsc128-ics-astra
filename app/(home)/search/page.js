'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import eventsVector from '../../assets/search.gif';
import { Table } from '@/components/TableBuilder';
import SkillTag from '@/components/SkillTag';
import { ActionButton } from '@/components/Buttons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { alumniData } from '@/components/DummyDataSearch'; // Import the data
import Pagination from '@/components/search/GroupedEvents/Pagination';

const ITEMS_PER_PAGE = 10; // Adjusted to 4 items per page for demonstration

export default function Page() {
  // Use alumniData directly
  const initialAlumniList = useMemo(() => alumniData, []);

  const [alumList, setAlumList] = useState(initialAlumniList);
  const [sortBy, setSortBy] = useState('');
  const [filters, setFilters] = useState({
    minGradYear: '',
    maxGradYear: '',
    location: '',
    skills: '',
  });
  const [appliedFilters, setAppliedFilters] = useState({
    minGradYear: '',
    maxGradYear: '',
    location: '',
    skills: '',
  });
  const [showFilters, setShowFilters] = useState({
    graduationYear: false,
    location: false,
    skills: false,
  });
  const [currentPage, setCurrentPage] = useState(1);

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

  const filteredAlumList = useMemo(() => {
    return alumList.filter((alum) => {
      const withinMinYear =
        !appliedFilters.minGradYear ||
        (alum.year_graduated &&
          parseInt(alum.year_graduated.substring(0, 4), 10) >=
            parseInt(appliedFilters.minGradYear, 10));
      const withinMaxYear =
        !appliedFilters.maxGradYear ||
        (alum.year_graduated &&
          parseInt(alum.year_graduated.substring(0, 4), 10) <=
            parseInt(appliedFilters.maxGradYear, 10));
      const matchesLocation =
        !appliedFilters.location ||
        (alum.location &&
          alum.location.toLowerCase().includes(appliedFilters.location.toLowerCase()));
      const skillsMatch =
        !appliedFilters.skills ||
        (alum.skills && alum.skills.toLowerCase().includes(appliedFilters.skills.toLowerCase()));
      return withinMinYear && withinMaxYear && matchesLocation && skillsMatch;
    });
  }, [alumList, appliedFilters]);

  const sortedAlumList = useMemo(() => {
    let sortedList = [...filteredAlumList];
    if (sortBy === 'name') {
      sortedList.sort((a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`));
    }
    if (sortBy === 'graduationYear' && sortedList[0]?.year_graduated) {
      sortedList.sort(
        (a, b) =>
          parseInt(a.year_graduated.substring(0, 4), 10) -
          parseInt(b.year_graduated.substring(0, 4), 10)
      );
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

  const cols = [
    { label: 'Image:label-hidden', justify: 'center', visible: 'all' },
    {
      label: 'Name',
      justify: 'start',
      visible: 'all',
      sortable: true,
      onSort: () => handleSort('name'),
    },
    {
      label: 'Graduation Year',
      justify: 'center',
      visible: 'md',
      sortable: true,
      onSort: () => handleSort('graduationYear'),
    },
    { label: 'Location', justify: 'center', visible: 'lg' },
    { label: 'Skills', justify: 'center', visible: 'md' },
    { label: 'Quick Actions', justify: 'center', visible: 'all' },
  ];

  function handleSort(column) {
    setCurrentPage(1); // Reset to the first page when sorting
    setSortBy(column);
  }

  function createRows(alumList) {
    return alumList.map((alum) => ({
      'Image:label-hidden': renderAvatar(alum.image, `${alum.first_name} ${alum.last_name}`),
      Name: renderName(`${alum.first_name} ${alum.last_name}`, alum.email),
      'Graduation Year': renderText(alum.year_graduated ? alum.year_graduated.substring(0, 4) : 'N/A'),
      Location: renderText(alum.location || 'N/A'),
      Skills: renderSkills(alum.skills ? alum.skills.split(', ') : []),
      'Quick Actions': renderActions(alum.id),
    }));
  }

  function renderAvatar(image, name) {
    return (
      <div className="flex justify-center p-2">
        <div className="w-12 h-12 m-3">
          <img
            src={image}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>
    );
  }

  function renderName(name, email) {
    return (
      <div>
        <div className="font-rb p-2">{name}</div>
        <div className="font-s text-astradarkgray">{email}</div>
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
            <SkillTag key={index} text={skill} margin={'m-1'} />
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
  function renderActions(id) {
    return (
      <div className="flex justify-center p-2">
        <ActionButton label="View" color="gray" route={`/search/${id}`} />
      </div>
    );
  }

  // --- ADD THESE CONSOLE LOGS FOR DEBUGGING ---
  console.log('sortedAlumList length:', sortedAlumList.length);
  console.log('ITEMS_PER_PAGE:', ITEMS_PER_PAGE);
  console.log('totalPages:', totalPages);
  console.log('currentPage:', currentPage);
  // --- END OF CONSOLE LOGS ---

  return (
    <div className="w-full bg-astradirtywhite">
      <div className="h-auto" />
      <>
        {/* Hero */}
        <div
          className="relative w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/blue-bg.png')" }}
        >
          <div className="max-w-[1440px] mx-auto px-12 py-20 flex flex-col lg:flex-row items-center justify-between text-astrawhite gap-10">
            <div className="max-w-[600px] space-y-6 text-center lg:text-left animate-slide-up">
              <h1 className="font-h1 text-astrawhite leading-[1.1]">
                Search for Alumni <br /> & Connections
              </h1>
              <p className="font-l text-astrawhite">
                Discover, connect, and engage with alumni to expand your network!
              </p>
              <button className="blue-button mt-4">Explore Now</button>
            </div>
            <div className="w-full lg:w-[550px] flex justify-center animate-fade-in">
              <div className="relative w-full h-auto max-w-[550px]">
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
        {/* Other content of your page can go here */}
        <section className="py-24 relative">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center max-lg:gap-4 justify-between w-full">
              <h2 className="font-h2">Search for Alumni</h2>
              <div className="relative w-full max-w-sm">
                <svg
                  className="absolute top-1/2 -translate-y-1/2 left-4 z-50"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.5555 3.33203H3.44463C2.46273 3.33203 1.66675 4.12802 1.66675 5.10991C1.66675 5.56785 1.84345 6.00813 2.16004 6.33901L6.83697 11.2271C6.97021 11.3664 7.03684 11.436 7.0974 11.5068C7.57207 12.062 7.85127 12.7576 7.89207 13.4869C7.89728 13.5799 7.89728 13.6763 7.89728 13.869V16.251C7.89728 17.6854 9.30176 18.6988 10.663 18.2466C11.5227 17.961 12.1029 17.157 12.1029 16.251V14.2772C12.1029 13.6825 12.1029 13.3852 12.1523 13.1015C12.2323 12.6415 12.4081 12.2035 12.6683 11.8158C12.8287 11.5767 13.0342 11.3619 13.4454 10.9322L17.8401 6.33901C18.1567 6.00813 18.3334 5.56785 18.3334 5.10991C18.3334 4.12802 17.5374 3.33203 16.5555 3.33203Z"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="relative w-full max-w-sm flex space-x-2">
                  <input
                    type="text"
                    id="Offer"
                    placeholder="Search..."
                    className="border border-astragray p-2 pl-4 w-full h-12 flex-grow"
                  />
                  <select
                    className="border border-astragray p-2 w-32 h-12 bg-white"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="" hidden>
                      Sort by...
                    </option>
                    <option value="name">Name</option>
                    <option value="graduationYear">Graduation Year</option>
                  </select>
                </div>
                <svg
                  className="absolute top-1/2 -translate-y-1/2 right-4 z-50"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.0002 5.99845L8.00008 9.99862L3.99756 5.99609"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <svg
              className="my-7 w-full"
              xmlns="http://www.w3.org/2000/svg"
              width="1216"
              height="2"
              viewBox="0 0 1216 2"
              fill="none"
            >
              <path className="stroke-astragray" d="M0 1H1216" />
            </svg>
            <div className="grid grid-cols-12">
              <div className="col-span-12 md:col-span-3 w-full max-md:max-w-md max-md:mx-auto">
                <div className="rounded-xl border border-astragray bg-astrawhite p-6 w-full md:max-w-sm space-y-5">
                  {/* Filter Buttons */}
                  <div className="space-y-2">
                    <div className="pb-2 border-b border-astragray">
                      <button
                        className="w-full py-2 rounded-md text-astrablack font-medium text-left focus:outline-none focus:ring-2 focus:ring-astraprimary"
                        onClick={() => toggleFilter('graduationYear')}
                      >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" /> Graduation Year
                      </button>
                      {showFilters.graduationYear && (
                        <div className="flex items-center gap-1">
                          <div className="relative w-full">
                            <input
                              type="text"
                              id="minGradYear"
                              name="minGradYear"
                              placeholder="From"
                              className="border border-astragray p-2 pl-4 w-full h-12"
                              value={filters.minGradYear}
                              onChange={handleFilterChange}
                            />
                          </div>
                          <p className="px-1 font-normal text-sm leading-6 text-astradarkgray">to</p>
                          <div className="relative w-full">
                            <input
                              type="text"
                              id="maxGradYear"
                              name="maxGradYear"
                              placeholder="To"
                              className="border border-astragray p-2 pl-4 w-full h-12"
                              value={filters.maxGradYear}
                              onChange={handleFilterChange}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="pb-2 border-b border-astragray">
                      <button
                        className="w-full py-2 rounded-md text-astrablack font-medium text-left focus:outline-none focus:ring-2 focus:ring-astraprimary"
                        onClick={() => toggleFilter('location')}
                      >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" /> Location
                      </button>
                      {showFilters.location && (
                        <div className="relative w-full">
                          <input
                            type="text"
                            id="location"
                            name="location"
                            placeholder="Enter Location"
                            className="border border-astragray p-2 pl-4 w-full h-12"
                            value={filters.location}
                            onChange={handleFilterChange}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="pb-2 border-b border-astragray">
                      <button
                        className="w-full py-2 rounded-md text-astrablack font-medium text-left focus:outline-none focus:ring-2 focus:ring-astraprimary"
                        onClick={() => toggleFilter('skills')}
                      >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" /> Skills
                      </button>
                      {showFilters.skills && (
                        <div className="relative w-full">
                          <input
                            type="text"
                            id="skills"
                            name="skills"
                            placeholder="Enter Skills"
                            className="border border-astragray p-2 pl-4 w-full h-12"
                            value={filters.skills}
                            onChange={handleFilterChange}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    className="blue-button w-full py-2.5 flex items-center justify-center gap-2 rounded-full text-sm font-semibold shadow-sm shadow-transparent transition-all duration-300 hover:bg-astradark hover:shadow-astraprimary/20"
                    onClick={handleApplyFilters}
                  >
                    Apply
                  </button>
                </div>
              </div>
              <div className="col-span-12 md:col-span-9">
                {/* Table will be rendered here */}
                <div className="pl-4">
                  <Table cols={cols} data={createRows(paginatedAlumList)} />
                  {/* Pagination component */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </div>
  );
}