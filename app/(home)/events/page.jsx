"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { useState,useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import EventCard from "@/components/events/GroupedEvents/EventCard/EventCard";
import FilterDropdown from "@/components/events/GroupedEvents/FilterDropdown";
import DateFilter from "@/components/events/GroupedEvents/DateFilter";
import Pagination from "@/components/events/GroupedEvents/Pagination";
import EventCarousel from "@/components/events/GroupedEvents/CardCarousel/EventCarousel";
import ExploreUPLBSection from "@/components/events/GroupedEvents/ExploreUPLBSection";
import UPLBImageCollage from "@/components/events/GroupedEvents/UPLBImageCollage";

import eventsVector from "../../assets/events-vector.png";
import venue1 from "../../assets/venue1.jpg";
import venue2 from "../../assets/venue2.jpeg";
import { useSignedInUser } from "@/components/UserContext";

export default function EventsPage() {
  const user = useSignedInUser();
  const itemsPerPage = 4;
  console.log("user: ", user);

  const [eventList, setEventList] = useState([]);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [sortFilter,setSortFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const fetchUserName = async (id) => {
    try{
      const response = await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/${id}`);

      console.log(response);
      if (response.data.status === "OK") {
        const selectEventName = response.data.user.username;
        console.log("select event name:",selectEventName, "type", typeof(selectEventName));
        return selectEventName;
      } else {
        console.error("Unexpected response:", response.data);
      }
    }catch(error){
      console.error("Failed to get content:", error);
    }
    return "Unknown";
  };

  const fetchAttendees = async (id) => {
    try{
      console.log("in fetch attendees..:", user);
      console.log("id in fetch attendees: ",id);
      if( user?.state?.isAlumnus || user?.state?.isAdmin||user?.state?.isModerator){
        console.log("fetchingg attendees...");
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/event-interests/content/${id}`);

        console.log("fetched attendees:", response);
        if (response.data.status === "OK"){
          const interestedUserNames = await Promise.all(
            response.data.list.map(async (user) => {
              const name = await fetchUserName(user.user_id);
              return name;
            })
          );

          return interestedUserNames;
        }
      }
    }catch(error){
      console.log("error at fetching attendees", error);
    }
    return [];
  };

  const fetchEventPhoto = async (contentId) => {
    try {
      console.log(" currently fetching photo");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/event/${contentId}`
      );

      if (response.data.status === "OK" && response.data.photo) {
        // console.log("photo url", response.data);
        if(response.data.photo == "/events/default-event.jpg") return venue2.src; //added this since the default-event.jpg not working
        return response.data.photo;
      }
    } catch (error) {
      console.log(`Failed to fetch photo for event_id ${contentId}:`, error);
    }
    console.log("default photo: ", venue2);
    return venue2.src; // Return default image if fetch fails
  };

  const fetchData = async () => {
    try {

      console.log("=======START OF FETCHING DATA ==========");
      const [eventsRes, contentsRes,] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/events`, {
          params: { page: 1, limit: 100 },
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents`, {
          params: { page: 1, limit: 100 },
        }),
      ]);

      if (eventsRes.data.status === "OK" && contentsRes.data.status === "OK") {
        const contentMap = new Map();
        contentsRes.data.list.forEach(content => {
          contentMap.set(content.id, content);
        });


        // array of promises to fetch event photos
        const eventsPromises = eventsRes.data.list.map(async (event) => {
          console.log(event);
          console.log("event id in event promises: ", event.event_id);
          const matchedContent = contentMap.get(event.event_id) || {};
          const photoUrl = await fetchEventPhoto(event.event_id);
          console.log("in fetch data, fetching user:", user);
          console.log("event id in event promises: ", event.event_id);
          return {
            id: event.event_id,
            event_id: event.event_id,
            imageSrc: photoUrl || venue2,  // Use fetched photo or default
            title: matchedContent.title || "Untitled",
            description: matchedContent.details || "No description",
            date: new Date(event.event_date).toDateString(),
            isOnline: event.online,
            location: event.venue,
            attendees: await fetchAttendees(event.event_id),
            status: new Date(event.event_date) < new Date() ? "Closed" : "Open",
            avatars: [],
          };
        });

        const mergedEvents = await Promise.all(eventsPromises);

        setEventList(mergedEvents);
        console.log("mergedEvents:",mergedEvents);
        setTotalPages(Math.ceil(mergedEvents.length / itemsPerPage));

        fetchUpcomingEvent(contentMap);
      }
    } catch (error) {
      console.log("Failed fetching events or contents:", error);
      setEventList([]);
    }
  };

  const fetchUpcomingEvent = async (contentMap) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/upcoming-events`);

      if (response.data.status === "OK"){
        const upcomingEventsPromises = response.data.list.map(async (event) => {
          console.log("upcoming event: ",event);
          // const matchedContent = contentMap.get(event.event_id) || {};
          const photoUrl = await fetchEventPhoto(event.event_id);
          console.log("in fetch data, fetching user:", user);
          let defaultVenue = Math.random() < 0.5 ? venue1.src : venue2.src; // Cycle between venue1 and venue2
          return {
            id: event.event_id,
            event_id: event.event_id,
            imageSrc: photoUrl || defaultVenue,  // Use fetched photo or default
            title: event.title || "Untitled",
            description: event.details || "No description",
            date: new Date(event.event_date).toDateString(),
            isOnline: event.online,
            location: event.venue,
            attendees: event.event_id ? await fetchAttendees(event.event_id) : [],
            status: new Date(event.event_date) < new Date() ? "Closed" : "Open",
            avatars: [],
          };
        });

        const mergedUpcommingEvents = await Promise.all(upcomingEventsPromises);
        setUpcomingEvents(mergedUpcommingEvents);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    console.log("Filtering triggered:", {
      eventList,
      searchQuery,
      sortFilter,
      locationFilter,
      statusFilter,
      startDateFilter,
      endDateFilter
    });

    let filteredResults = [...eventList];


    if (searchQuery !== "") {
      console.log("searching...: ", searchQuery);
      filteredResults = filteredResults.filter(event =>
        event.title && event.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (locationFilter) {
      console.log("location...: ", locationFilter);
      filteredResults = filteredResults.filter(event => {
        if (locationFilter.label === "Online") {
          return event.isOnline === true;
        } else if (locationFilter.label === "In-person") {
          return event.isOnline === false;
        }
        return true;
      });
    }


    if (statusFilter?.label) {
      console.log("label...:", statusFilter);
      const now = new Date();

      filteredResults = filteredResults.filter(event => {
        const eventDate = new Date(event.date);

        if (statusFilter.label === "Upcoming") {
          return eventDate > now;
        } else if (statusFilter.label === "Ongoing") {
          return eventDate.toDateString() === now.toDateString();
        } else if (statusFilter.label === "Completed") {
          return eventDate < now;
        }
        return true;
      });
    }

    if (startDateFilter) {
      console.log("startDateFilder...:", new Date(startDateFilter));
      const startDate = new Date(startDateFilter);
      filteredResults = filteredResults.filter(event =>
        new Date(event.date) >= startDate
      );
    }

    if (endDateFilter) {
      console.log("endDateFilder...:", endDateFilter);
      const endDate = new Date(endDateFilter);
      filteredResults = filteredResults.filter(event =>
        new Date(event.date) <= endDate
      );
    }
    console.log("sortFilter...:", sortFilter);
    if (sortFilter?.label === "Newest First") {
      filteredResults.sort((a, b) => new Date(b.date) - new Date(a.date));
      console.log("mpst recent", filteredResults);
    } else if (sortFilter?.label === "Oldest First") {
      filteredResults.sort((a, b) => new Date(a.date) - new Date(b.date));
      console.log("oldest", filteredResults);
    } else if (sortFilter?.label === "Popular") {
      filteredResults.sort((a, b) => (b.attendees.length || 0) - (a.attendees.length || 0));
      console.log("popular", filteredResults);
    }

    setFilteredEvents(filteredResults);
    setCurrentPage(1);
  }, [
    eventList,
    searchQuery,
    sortFilter,
    locationFilter,
    statusFilter,
    startDateFilter,
    endDateFilter
  ]);

  useEffect(() => {
    setCurrentEvents(
      filteredEvents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    );
  }, [currentPage, filteredEvents, itemsPerPage]);

  useEffect(() => {
    const pages = Math.ceil(filteredEvents.length / itemsPerPage);
    setTotalPages(pages);
  }, [filteredEvents, itemsPerPage]);

  return (
    <div className="w-full bg-astradirtywhite">
      {/* Hero Section */}
      <div
        className="relative w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/blue-bg.png')" }}
      >
        <div className="max-w-[1440px] mx-auto px-12 py-20 flex flex-col lg:flex-row items-center justify-between text-astrawhite gap-10">
          <div className="max-w-[600px] space-y-6 text-center lg:text-left animate-hero-text">
            <h1 className="text-[60px] font-extrabold leading-[1.1]">
              User Event <br /> & Management
            </h1>
            <p className="text-lg font-medium">
              Discover, manage, and dive into campus events in a whole new way!
            </p>
            <button className="mt-4 px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-astraprimary rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
              Explore Now
            </button>
          </div>
          <div className="w-full lg:w-[550px] flex justify-center">
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

      {/* Filters Section */}
      <div className="relative z-20 bg-astradirtywhite w-full py-14 -mt-10 border-t border-astradarkgray">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-8 px-4">
          <div className="w-full max-w-[1000px]">
            <div className="flex items-stretch w-full border border-astragray bg-astrawhite">
              <input
                type="text"
                placeholder="Search for event"
                className="flex-grow py-4 pl-6 focus:outline-none text-base text-astradark"
                value={searchQuery}
                onChange={(e)=>setSearchQuery(e.target.value)}
              />
              <button className="px-6 bg-astraprimary hover:bg-astradark text-astrawhite font-semibold transition flex items-center gap-2 cursor-pointer"

              >
                Search
              </button>
            </div>
          </div>

          <div className="w-full max-w-[1000px] flex flex-wrap justify-center gap-4 text-sm font-medium z-20">
            <FilterDropdown
              icon="material-symbols:location-on"
              options={[
                { label: "Clear", icon: "mdi:close-circle-outline" },
                { label: "Online", icon: "mdi:wifi" },
                { label: "In-person", icon: "mdi:account-group" },
              ]}
              placeholder="Location"
              value={locationFilter}
              onChange={(selected) =>
                selected.label === "Clear" ? setLocationFilter(null) : setLocationFilter(selected)
              }
            />

            <FilterDropdown
              icon="fluent:status-20-filled"
              options={[
                { label: "Clear", icon: "mdi:close-circle-outline" },
                { label: "Upcoming", icon: "mdi:clock-outline" },
                { label: "Ongoing", icon: "mdi:progress-clock" },
                { label: "Completed", icon: "mdi:check-circle-outline" },
              ]}
              placeholder="Status"
              value={statusFilter}
              onChange={(selected) =>
                selected.label === "Clear" ? setStatusFilter(null) : setStatusFilter(selected)
              }
            />

            <DateFilter
              placeholder="Start Date"
              value={startDateFilter}
              onChange={(date) => date === setStartDateFilter(date)}
            />

            <DateFilter
              placeholder="End Date"
              value={endDateFilter}
              onChange={(date) => {
                console.log("date:", date);
                setEndDateFilter(date);
              }}
            />

            <FilterDropdown
              icon="material-symbols:sort"
              options={[
                { label: "Clear", icon: "mdi:close-circle-outline" },
                { label: "Newest First", icon: "mdi:sort-calendar-descending" },
                { label: "Oldest First", icon: "mdi:sort-calendar-ascending" },
                { label: "Popular", icon: "mdi:star-outline" },
              ]}
              placeholder="Sort"
              value={sortFilter}
              onChange={(selected) =>
                selected.label === "Clear" ? setSortFilter(null) : setSortFilter(selected)
              }

            />

          </div>
        </div>
      </div>

      {/* All Events */}
      <div className="max-w-[1440px] mx-auto px-12 mt-20 relative z-10">
        <h1 className="text-[28px] font-extrabold text-astradarkgray mb-10">
          All Events
        </h1>
        <div className="space-y-10 transition-all duration-700 ease-in-out">
          {currentEvents.map((event, index) => (
            <EventCard
              key={index}
              id={event.event_id}
              imageSrc={event.imageSrc}
              title={event.title}
              description={event.description}
              date={event.date}
              location={event.location}
              attendees={event.attendees}
              status={event.status}
              avatars={event.avatars}
            />
          ))}

        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Carousel */}
      <div className="max-w-[1440px] mx-auto px-12 mt-24 pb-20 bg-astradirtywhite">
        <EventCarousel events={upcomingEvents} />
      </div>

      {/* Explore UPLB Section */}
      <ExploreUPLBSection />

      {/* UPLB Image Collage */}
      <UPLBImageCollage />

      {/* Animations */}
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

