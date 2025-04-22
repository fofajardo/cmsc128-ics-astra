'use client';
import Image from 'next/image';

export default function HeaderImage({ imageSrc, title }) {
  return (
    <Image
      src={imageSrc}
      alt={title}
      width={800}
      height={400}
      className="rounded-xl w-full h-[300px] object-cover"
    />
  );
}
