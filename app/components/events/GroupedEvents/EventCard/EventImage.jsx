import Image from "next/image";

export default function EventImage({ src, title }) {
  return (
    <div className="relative w-full lg:w-[320px] h-[220px] lg:h-auto overflow-hidden">
      <img
        src={src}
        alt={title}
        // layout="fill"
        // objectFit="cover"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}