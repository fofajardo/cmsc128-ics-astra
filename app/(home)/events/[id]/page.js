"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import events from "../../../data/events";
import avatar1 from '../../../assets/avatar1.jpg'
import avatar2 from "../../../assets/avatar.png";
import avatar3 from "../../../assets/avatar3.jpg";
import { useState } from "react";
import { Icon } from "@iconify/react";

export default function EventDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const event = events.find((e) => e.id === id);
  
    const [isInterested, setIsInterested] = useState(false);
  
    const handleInterestClick = () => {
      setIsInterested(!isInterested);
    };
  
    const attendees = [
      {
        name: "John Smith",
        title: "Software Engineer at Google",
        year: "Class of 2015 • Alumni",
        avatar: avatar1,
      },
      {
        name: "Sarah Chen",
        title: "Product Manager at Microsoft",
        year: "Class of 2015 • Alumni",
        avatar: avatar2,
      },
      {
        name: "David Lee",
        title: "Data Scientist at Meta",
        year: "Class of 2018 • Alumni",
        avatar: avatar3,
      },
    ];
  
    if (!event) return <div className="p-10 text-center text-xl">Event not found.</div>;
  
    return (
      <div className="pt-[100px] px-6 sm:px-12 py-6 max-w-screen-xl mx-auto">
        {/* Back button */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 font-medium mb-6">
          <Icon icon="mdi:arrow-left" className="text-2xl" />
          Back
        </button>
  
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Image + Description */}
          <div className="flex-1 bg-white rounded-xl shadow-md p-6">
            <Image
              src={event.imageSrc}
              alt={event.title}
              width={800}
              height={400}
              className="rounded-xl w-full h-[300px] object-cover"
            />
            <h1 className="text-2xl font-bold mt-4 flex items-center gap-2 text-gray-900">
              {event.title}
              <Icon icon="mdi:file-document-outline" className="text-blue-500 text-xl" />
            </h1>
            <p className="text-gray-700 mt-2 text-sm leading-relaxed">
              The Alumni Homecoming event is a special occasion to bring past graduates together in celebration of shared experiences and milestones. It serves as a unique opportunity to reconnect with old friends, network with fellow alumni, and reflect on the journey since graduation. The event fosters a sense of belonging and pride, uniting individuals who share a common bond and a deep connection to their alma mater. It’s a time to create new memories while honoring the past, strengthening relationships, and celebrating the achievements of the alumni community.
            </p>
          </div>
  
          {/* Right: Event Details */}
          <div className="w-full lg:w-[300px] bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold mb-4 text-gray-900">Event Details</h2>
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <Icon icon="mdi:clock-outline" className="text-blue-500 text-xl" />
                <span>June 16, 2025 | 11:59 PM</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Icon icon="mdi:map-marker-outline" className="text-red-500 text-xl" />
                <span>ICS Building, Room 401</span>
              </div>
            </div>
  
            <div className="mt-6 flex flex-col gap-2">
              <button disabled className="bg-gray-200 text-gray-500 font-semibold py-2 rounded-lg cursor-not-allowed">
                Going
              </button>
              <button
                onClick={handleInterestClick}
                className={`py-2 rounded-lg font-semibold text-white transition-colors ${
                  isInterested ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isInterested ? "Interested ✓" : "Interested"}
              </button>
            </div>
          </div>
        </div>
  
        {/* Attendees Section */}
        <div className="mt-10 bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div className="text-blue-600 font-semibold">
              Going <span className="text-gray-700">(48 / 50)</span> • Interested (2)
            </div>
            <div className="text-4xl font-bold text-blue-600">48</div>
            <div className="text-sm text-gray-600">Attendees Count</div>
          </div>
  
          <div className="flex flex-col gap-4 mt-4">
            {attendees.map((attendee, index) => (
              <div key={index} className="flex items-center gap-4 bg-gray-100 p-3 rounded-lg">
                <Image src={attendee.avatar} alt={attendee.name} width={48} height={48} className="rounded-full w-12 h-12" />
                <div>
                  <div className="font-medium text-gray-900">{attendee.name}</div>
                  <div className="text-sm text-gray-600">{attendee.title}</div>
                  <div className="text-xs text-gray-500">{attendee.year}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  