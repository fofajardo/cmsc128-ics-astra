import Image from "next/image";

export default function EventImage({ imageSrc, title }) {
  return (
    <div className="w-full h-[160px]">
      <Image
        src={imageSrc?.src || imageSrc}
        alt={title}
        width={300}
        height={160}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
