"use client";

import Image from "next/image";

export default function AttendeesList({
  attendees,
  interested,
  activeTab,
  itemsPerPage,
  currentPage,
  setCurrentPage
}) {
  const list = activeTab === "going" ? attendees : interested;
  const totalPages = Math.ceil(list.length / itemsPerPage);
  const paginatedList = list.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="hidden md:flex flex-col items-center justify-center w-48 border-r pr-6">
          <div className="text-5xl font-bold text-astrablue">{list.length}</div>
          <div className="text-astradarkgray mt-2 text-center">Attendees</div>
        </div>

        <div className="flex-1">
          {paginatedList.map((person, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b py-4 hover:bg-astragray rounded-lg transition-all px-2"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 relative rounded-full overflow-hidden">
                  <Image
                    src={person.avatar}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="font-semibold text-astrablack">{person.name}</div>
                  <div className="text-sm text-astradarkgray">
                    Alumni | Class of {person.classYear}
                  </div>
                </div>
              </div>
              <div className="text-sm text-astradarkgray text-right">
                {person.title} at {person.company}
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-6 gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-astradarkgray hover:text-astrablue disabled:opacity-50"
              >
                ←
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-full font-semibold ${
                    currentPage === i + 1
                      ? "bg-astrablue text-white"
                      : "text-astradarkgray hover:bg-gray-200"
                  } transition-all`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-astradarkgray hover:text-astrablue disabled:opacity-50"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
