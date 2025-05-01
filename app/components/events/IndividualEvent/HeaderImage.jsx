"use client";
import Image from "next/image";

export default function HeaderImage({ imageSrc, title }) {
  if (!imageSrc) {
    return (
      <div className="rounded-xl w-full h-[500px] bg-gray-100 flex items-center justify-center text-gray-400">
        No image uploaded
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={title}
      width={800}
      height={500}
      className="rounded-xl w-full h-[350px] object-cover"
    />
  );
}
