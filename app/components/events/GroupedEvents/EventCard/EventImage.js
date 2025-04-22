import Image from "next/image";

export default function EventImage({ src, title }) {
  return (
    <div className="relative w-full lg:w-[320px] h-[220px] lg:h-auto overflow-hidden">
      <Image
        src={src}
        alt={title}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-500 group-hover:scale-110"
      />
    </div>
  );
}
