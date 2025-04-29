import Link from "next/link";

export default function ExploreUPLBSection() {
  return (
    <div
      className="relative w-full h-[600px] bg-cover bg-center flex items-center justify-center text-white overflow-hidden group"
      style={{
        backgroundImage: "url('https://media.licdn.com/dms/image/v2/C561BAQHTTyItFp0LnA/company-background_10000/company-background_10000/0/1603683849421/uplbofficial_cover?e=2147483647&v=beta&t=rsKQQawpb1eGGs9FPv5Hb1I2jddO9cxwGG3DFwgM7Xs')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-astradark/70 backdrop-blur-md group-hover:backdrop-blur-lg transition-all duration-500"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <h2 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 relative inline-block after:absolute after:left-0 after:bottom-0 after:h-[4px] after:bg-white after:w-0 group-hover:after:w-full after:transition-all after:duration-500">
          Join the Community
        </h2>
        <p className="max-w-[850px] mx-auto mt-6 text-lg md:text-xl font-medium leading-relaxed">
          Stay connected with your alma mater and fellow alumni through vibrant events,
          lifelong networks, and shared memories. Celebrate the achievements of our UPLB
          community and forge new opportunities together —
          because once a part of UPLB, always a part of UPLB.
        </p>
        <Link href="/whats-up">
          <button className="mt-8 px-10 py-4 bg-white text-astradark font-bold rounded-lg hover:bg-astraprimary hover:text-white transition-all duration-300 shadow-lg hover:shadow-2xl">
            Learn More
          </button>
        </Link>
      </div>

      {/* Subtle Moving Particles */}
      <div className="absolute inset-0 animate-particles"></div>
    </div>
  );
}
