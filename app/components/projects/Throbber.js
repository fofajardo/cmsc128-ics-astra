'use client';

import { useState, useEffect } from 'react';

export default function Throbber() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 1));
    }, 40); // ~4s total

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f4f7fe]">
      <div className="w-20 h-20 border-4 border-blue-500 rounded-full animate-spin border-t-transparent mb-8"></div>
      <p className="text-gray-700 font-medium mb-2">Loading...</p>
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-gray-500">{progress}%</p>
    </div>
  );
}
