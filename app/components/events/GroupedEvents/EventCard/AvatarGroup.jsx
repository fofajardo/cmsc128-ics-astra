import Image from "next/image";

export default function AvatarGroup({ avatars }) {
  return (
    <div className="flex items-center mt-5 space-x-[-10px]">
      {avatars.map((avatar, idx) => (
        <div
          key={idx}
          className="w-9 h-9 rounded-full overflow-hidden border-2 border-astrawhite z-10 hover:z-20 transition-all duration-300 hover:scale-110"
        >
          <Image
            src={avatar}
            alt={`avatar-${idx}`}
            width={36}
            height={36}
            className="object-cover w-full h-full"
          />
        </div>
      ))}
    </div>
  );
}
