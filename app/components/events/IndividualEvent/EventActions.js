'use client';

export default function EventActions({ status, isInterested, handleInterestClick }) {
  if (status === "Closed") {
    return (
      <>
        <button
          disabled
          className="bg-red-200 text-astrared font-semibold py-2 rounded-lg cursor-not-allowed"
        >
          Closed
        </button>
        <p className="text-sm text-center text-red-500 font-medium">
          Applications have already closed.
        </p>
      </>
    );
  }

  return (
    <>
      <button
        disabled
        className="bg-astragray text-astradarkgray font-semibold py-2 rounded-lg cursor-not-allowed"
      >
        Going
      </button>
      <button
        onClick={handleInterestClick}
        className={`py-2 rounded-lg font-semibold text-astrawhite transition-colors ${
          isInterested ? "bg-astradark" : "bg-astraprimary hover:bg-astraprimary"
        }`}
      >
        {isInterested ? "Interested ✓" : "Interested"}
      </button>
    </>
  );
}
