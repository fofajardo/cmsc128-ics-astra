import Image from "next/image"

export default function AboutPage() {
  const timelineItems = [
    {
      year: "1982",
      content:
        "Computer Science was first recognized as a discipline in UPLB when the Institute of Mathematical Sciences and Physics (IMSP) was established with the Division of Computer Science as one of its divisions.",
      position: "left",
    },
    {
      year: "1983",
      content: (
        <>
          <p className="mb-4">
            The Bachelor of Science in Computer Science (BSCS) program at UPLB was established concurrently with the
            Division of Computer Science. The program was officially instituted in 1982, the first students were
            accepted in 1983.
          </p>
          <p>
            When the BSCS program first started, the computer science courses were taught by three professors and
            statistics instructors. They were Dr. Manuel M. Manuel, Dr. Eliezer A. Albacea (then instructor), and Prof.
            Wilfredo E. Cabezon.
          </p>
        </>
      ),
      position: "right",
    },
    {
      year: "1988",
      content:
        "The Master of Science in Computer Science program was established by the Division. This became very popular among the Division's teaching staff.",
      position: "left",
    },
    {
      year: "1995",
      content:
        "In January 26, 1995, the UP Board of Regents separated the Division of Computer Science from IMSP and merged this with the existing Los Baños Computer Center to form the Institute of Computer Science (ICS). Dr. Eliezer A. Albacea then became the first Director of ICS.",
      position: "right",
    },
    {
      year: "1996",
      content: (
        <>
          <p className="mb-4">
            The institute was designated by the Board of Regents as a pilot institute to implement the concept of a
            System Academic Program.
          </p>
          <p className="mb-4">
            Dr. Eliezer A. Albacea was designated System Director for the UP System Computer Science Program. ICS is
            instrumental in the institution of BSCS programs in UP Manila, UP in the Visayas (Cebu, Tacloban, and
            Iloilo), UP College Baguio, and UP Mindanao.
          </p>
          <p>ICS also instituted the Diploma in Computer Science (now discontinued).</p>
        </>
      ),
      position: "left",
    },
    {
      year: "1998",
      content: "The Doctor of Philosophy (PhD) in Computer Science was instituted.",
      position: "right",
    },
    {
      year: "2002",
      content: "The Master of Information Technology was instituted.",
      position: "left",
    },
    {
      year: "2015",
      content:
        "The Institute of Computer Science (ICS) at the University of the Philippines Los Baños (UPLB) was recognized as a Center of Excellence in Information Technology by the Commission on Higher Education (CHED).",
      position: "right",
    },
  ]

  return (
    <main className="min-h-screen bg-[var(--color-astrawhite)]">
      {/* Headline section */}
      <section className="relative h-[600px] md:h-[600px] flex items-center justify-center pt-12 w-full">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/about-bg.png")' }}></div>
        <div className="relative z-20 text-center max-w-4xl px-4">
          <h1 className="text-[var(--color-astrawhite)] text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            Building the Future:
            <br />
            Our Mission and Story
          </h1>
          <p className="text-[var(--color-astrawhite)] text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            The Institute of Computer Science at UPLB is recognized for its commitment to excellence in computer science
            education and research, producing skilled graduates and contributing to the advancement of the field in the
            Philippines.
          </p>
        </div>
      </section>

      {/* Mission section */}
      <section className="py-12 md:py-16 w-full">
        <div className="px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-[var(--color-astraprimary)] text-3xl md:text-4xl font-bold mb-6 md:mb-8">Mission</h2>
              <div className="space-y-4 md:space-y-8 text-justify">
                <p className="text-[var(--color-astrablack)]">
                  To produce the needed quality manpower for the Philippines' software industry and the manpower needed
                  to carry out the information processing functions of private and government institutions.
                </p>
                <p className="text-[var(--color-astrablack)]">
                  To carry out high-level research and development in computer science and computer hardware so as to
                  enhance locally produced computer products.
                </p>
                <p className="text-[var(--color-astrablack)]">
                  To continuously upgrade the computing personnel of industry and government through training.
                </p>
              </div>
            </div>
            <div className="flex justify-center order-1 md:order-2">
              <Image
                src="/ics-logo.png"
                alt="Institute of Computer Science Logo"
                width={300}
                height={300}
                className="max-w-[200px] md:max-w-[250px]"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-md mx-auto border-t border-gray-300 my-8 px-4"></div>

      {/* History Section */}
      <section className="py-12 md:py-16 w-full">
        <div className="px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
          <h2 className="text-[var(--color-astraprimary)] text-3xl md:text-4xl font-bold mb-12 md:mb-16 text-center">
            History of ICS
          </h2>
          <div className="relative pl-4 md:pl-0">
            <div className="absolute left-0 md:hidden w-1 h-full bg-[var(--color-astraprimary)]"></div>{" "}
            {/* Mobile size */}
            <div className="absolute left-1/2 hidden md:block transform -translate-x-1/2 w-1 h-full bg-[var(--color-astraprimary)]"></div>{" "}
            {/* Desktop size */}
            {/* Timeline items; map since it's much easier */}
            {timelineItems.map((item, index) => (
              <div
                key={index}
                className={`
                relative mb-12 last:mb-0
                ${item.position === "right" ? "md:pl-8 md:pr-0" : "md:pr-8 md:pl-0"}
              `}
              >
                <div
                  className={`
                    absolute top-0 left-[22px] w-6 h-6 bg-[var(--color-astraprimary)] rounded-full
                    transform -translate-x-1/2 hidden md:block
                    md:left-1/2 md:w-8 md:h-8
                  `}
                ></div>

                {/* Content container */}
                <div
                  className={`
                md:ml-0
                ${item.position === "right" ? "md:pl-12 md:w-1/2 md:float-right" : "md:pr-12 md:w-1/2 md:float-left"}
              `}
                >
                  <h3 className="text-[var(--color-astraprimary)] text-2xl md:text-3xl font-bold mb-3">{item.year}</h3>
                  <div className="text-[var(--color-astrablack)] space-y-3 text-justify">
                    {typeof item.content === "string" ? <p>{item.content}</p> : item.content}
                  </div>
                </div>
                <div className="clear-both"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
