'use client';

import { useState } from 'react';

export default function EventActions({ status, onGoingClick, onInterestClick, isGoing, isInterested }) {
  if (status === "Closed") {
    return (
      <div className="text-center space-y-2">
        <button
          disabled
          className="w-full bg-red-200 text-astrared font-semibold py-2 rounded-lg cursor-not-allowed"
        >
          Closed
        </button>
        <p className="text-sm text-red-500 font-medium">
          Applications have already closed.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
        <button
          onClick={onGoingClick}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg font-semibold transition-colors ${
            isGoing
              ? 'bg-green-700 text-white'
              : 'bg-astragray text-astradarkgray hover:bg-astradarkgray hover:text-white'
          }`}
        >
          {isGoing ? "Going ✓" : "Going"}
        </button>

        <button
          onClick={onInterestClick}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
            isInterested ? "bg-astradark" : "bg-astraprimary hover:bg-astradark"
          }`}
        >
          {isInterested ? "Interested ✓" : "Interested"}
        </button>
      </div>

      {isGoing && (
        <p className="text-sm text-green-700 font-medium mt-1 text-center">
          You have successfully confirmed your attendance.
        </p>
      )}

      {isInterested && !isGoing && (
        <p className="text-sm text-blue-600 font-medium mt-1 text-center">
          You have successfully shown interest in this event.
        </p>
      )}
    </div>
  );
}
