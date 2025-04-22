"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import invitations from "../../../data/invitations.js";

export function EventInvitations() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: '40%' });

  useEffect(() => {
    const handleScroll = () => {
      if (selectedEvent) {
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;
        const viewportPosition = scrollY + (windowHeight * 0.4);
        setModalPosition({ top: `${viewportPosition}px` });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedEvent]);

  const handleResponse = (eventId, accepted) => {
    console.log(`Event ${eventId} ${accepted ? 'accepted' : 'declined'}`);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {invitations.map((invite) => (
          <motion.div
            key={invite.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            <button
              onClick={() => setSelectedEvent(invite)}
              className="w-full text-left"
            >
              <div className="p-4">
                <h3 className="font-semibold">{invite.title}</h3>
                <p className="text-sm text-gray-600">{invite.description}</p>
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
            <motion.div
              initial={{ opacity: 0, y: 20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 20, x: '-50%' }}
              style={{
                position: 'absolute',
                left: '50%',
                ...modalPosition,
                transform: 'translate(-50%, -50%)'
              }}
              className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
              
              <h2 className="text-xl font-bold mb-4">{selectedEvent.title}</h2>
              <div className="space-y-4">
                {selectedEvent.host && (
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedEvent.host.avatar || '/avatars/default.png'}
                      alt={selectedEvent.host.name || 'Event Host'}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{selectedEvent.host.name || 'Event Host'}</p>
                      <p className="text-sm text-gray-600">{selectedEvent.host.title || 'Host'}</p>
                    </div>
                  </div>
                )}
                <div className="mt-4">
                  <p className="text-gray-600"><span className="font-medium">Date:</span> {selectedEvent.date}</p>
                  <p className="text-gray-600"><span className="font-medium">Time:</span> {selectedEvent.time}</p>
                  <p className="text-gray-600"><span className="font-medium">Location:</span> {selectedEvent.location}</p>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => handleResponse(selectedEvent.id, false)}
                    className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleResponse(selectedEvent.id, true)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
