"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import invitations from "../../../data/invitations.js";
import Image from "next/image";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import styles from "../styles/animations.module.css";

export function EventInvitations() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleResponse = (eventId, accepted) => {
    console.log(`Event ${eventId} ${accepted ? 'accepted' : 'declined'}`);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {invitations.map((invite, index) => (
          <motion.div
            key={invite.id}
            className={`invitation-card group cursor-pointer ${styles.staggered}`}
            style={{ animationDelay: `${index * 0.2}s` }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedEvent(invite)}
          >
            <div className="relative h-48 w-full">
              <Image
                src={invite.imageSrc}
                alt={invite.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="font-lb text-gray-900 mb-2">{invite.title}</h3>
              <p className="font-s text-gray-600 mb-4">{invite.description}</p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(invite.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {invite.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {invite.attendees}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 ${styles.fadeSlideUp}`}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={selectedEvent.imageSrc}
                  alt={selectedEvent.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h2 className="font-h2 text-gray-900">{selectedEvent.title}</h2>
                  <p className="font-r text-gray-600 mt-2">{selectedEvent.description}</p>
                </div>

                {selectedEvent.host && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Image
                      src={selectedEvent.host.avatar}
                      alt={selectedEvent.host.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-rb text-gray-900">{selectedEvent.host.name}</p>
                      <p className="font-s text-gray-600">{selectedEvent.host.title}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-s text-gray-600">Date</p>
                      <p className="font-rb">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-s text-gray-600">Time</p>
                      <p className="font-rb">{new Date(selectedEvent.date).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-s text-gray-600">Location</p>
                      <p className="font-rb">{selectedEvent.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-s text-gray-600">Capacity</p>
                      <p className="font-rb">{selectedEvent.attendees}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <button
                    onClick={() => handleResponse(selectedEvent.id, false)}
                    className="invitation-button invitation-decline"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleResponse(selectedEvent.id, true)}
                    className="invitation-button invitation-accept"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
