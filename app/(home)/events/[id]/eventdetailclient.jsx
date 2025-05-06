"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import AttendeesSection from "@/components/events/IndividualEvent/AttendeesSection";
import EventDetails from "@/components/events/IndividualEvent/EventDetails";
import BackButton from "@/components/events/IndividualEvent/BackButton";
import HeaderEvent from "@/components/events/IndividualEvent/HeaderEvent";
import axios from "axios";
import { isValidUUID } from "../../../../api/utils/validators";
import venue2 from "../../../assets/venue2.jpeg";
import { useSignedInUser } from "@/components/UserContext";

export default function EventDetailClient() {
  const user = useSignedInUser();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isInterested, setIsInterested] = useState(false);
  const [isGoing, setIsGoing] = useState(false);
  const [eventList, setEventList] = useState([]);
  const [numOfInterested, setNumOfInterested] = useState(0);

  const user_id = user?.state?.user?.id;

  const fetchEvent = async () => {
    try {
      if (!isValidUUID(id)) return;

      const [eventRes, contentRes, interestStatsRes, interestRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/${id}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/event-interests/${id}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/event-interests/content/${id}`),
      ]);

      if (
        eventRes.data.status === "OK" &&
        contentRes.data.status === "OK" &&
        interestStatsRes.data.status === "OK" &&
        interestRes.data.status === "OK"
      ) {
        const event = eventRes.data;
        const content = contentRes.data;
        const interests = interestRes.data.list;
        const interestStats = interestStatsRes.data.list;

        let interestedUsers = [];
        if (user?.state?.isAlumnus || user?.state?.isAdmin || user?.state?.isModerator) {
          const isCurrentUserInterested = interests.some((u) => u.user_id === user_id);
          setIsInterested(isCurrentUserInterested);
          interestedUsers = await Promise.all(
            interests.map(async (u) => ({
              id: u.user_id,
              name: await fetchUserName(u.user_id),
            }))
          );
        }

        const photoUrl = await fetchEventPhoto(event.event.event_id);

        const mergedEvent = {
          id: event.event.event_id,
          event_id: event.event.event_id,
          imageSrc: photoUrl || venue2,
          title: content.content.title || "Untitled",
          description: content?.content.details || "No description",
          date: new Date(event.event.event_date).toDateString(),
          location: event.event.venue,
          attendeesList: interestedUsers,
          status: event.event.online ? "Online" : "Offline",
          avatars: [],
        };

        setEvent(mergedEvent);
        setNumOfInterested(interestStats.interest_count);
      }
    } catch (error) {
      console.error("Failed fetching event, content, or interests:", error);
      setEvent(null);
    }
  };

  const fetchUserName = async (id) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/${id}`);
      if (response.data.status === "OK") {
        return response.data.user.username;
      }
    } catch (error) {
      console.error("Failed to get user name:", error);
    }
    return "Unknown";
  };

  const fetchEventPhoto = async (contentId) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/photos/event/${contentId}`);
      if (response.data.status === "OK" && response.data.photo) {
        return response.data.photo;
      }
    } catch (error) {
      console.log(`Failed to fetch photo for event_id ${contentId}:`, error);
    }
    return venue2.src;
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  useEffect(() => {
    setEvent(eventList.find((e) => e.id === id));
  }, [eventList]);

  const handleSave = (updatedEvent) => setEvent(updatedEvent);

  const addDeleteInterest = async (newIsInterested) => {
    if (!user?.state?.isAlumnus && !user?.state?.isAdmin && !user?.state?.isModerator) return;

    try {
      const interest = { user_id: user_id, content_id: event.id };

      if (newIsInterested) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/event-interests`, interest);
      } else {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/event-interests/${interest.user_id}/${interest.content_id}`);
      }
    } catch (error) {
      console.log("error at addDeleteInterest: ", error.message);
    }
  };

  const [isInterestedLoading, setIsInterestedLoading] = useState(false);
  const [isGoingLoading, setIsGoingLoading] = useState(false);

  const handleInterestClick = async () => {
    if (isInterestedLoading || isGoingLoading) return;

    try {
      setIsInterestedLoading(true);
      const newIsInterested = !isInterested;
      setIsInterested(newIsInterested);

      if (isGoing && newIsInterested) setIsGoing(false);

      await addDeleteInterest(newIsInterested);
      await fetchEvent();
    } catch (error) {
      console.error("Failed to update interest:", error);
      setIsInterested(!isInterested);
    } finally {
      setIsInterestedLoading(false);
    }
  };

  const handleGoingClick = () => {
    setIsGoing((prev) => !prev);
    if (isInterested) setIsInterested(false);
    fetchEvent();
  };

  if (!event) {
    return <div className="p-10 text-center text-xl">Event not found.</div>;
  }

  return (
    <div className="bg-astradirtywhite min-h-screen px-6 sm:px-12 py-6 max-w-screen-xl mx-auto">
      <BackButton />
      <div className="flex flex-col lg:flex-row gap-6">
        <HeaderEvent event={event} onSave={handleSave} />
        <EventDetails
          event={event}
          isInterested={isInterested}
          handleInterestClick={handleInterestClick}
          isGoing={isGoing}
          handleGoingClick={handleGoingClick}
        />
      </div>
      <AttendeesSection
        event={user?.state?.isUnlinked || user?.state?.isAdmin ? event : { ...event, attendees: [] }}
      />
    </div>
  );
}
