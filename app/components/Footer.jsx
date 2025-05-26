import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail } from "lucide-react";

export default function Footer() {
  const services = [
    { text: "Home", link: "/home" },
    { text: "About", link: "/about" },
    { text: "Events", link: "/events" },
    { text: "Jobs", link: "/jobs" },
    {text:"Request Alumni Info", link:"/whats-up/request-info"}
  ];
  const helpers = [
    { text: "UPLB", link: "http://uplb.edu.ph/" },
    { text: "OVCAA UPLB", link: "https://ovcaa.uplb.edu.ph/" },
    { text: "Graduate School", link: "https://uplb.edu.ph/college/graduate-school/" },
  ];
  const contacts = [
    { key: 1, icon: "lucide:map-pin", text: "Physical Sciences Building, Harold Cuzner Royal Palm Ave, Los Baños" },
    { key: 2, icon: "lucide:mail", text: "astratech@gmail.com" },
  ];

  return (
    <footer className="w-full font-display overflow-hidden bg-white text-astrablack">
      <div className="mx-auto w-full max-w-screen-xl px-6 py-10 sm:px-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-5">
              <Image width={70} height={70} src={"/astra-logo.png"} alt="ICS-ASTRA Logo" />
              <h1 className="text-2xl font-bold text-astraprimary">ICS-ASTRA</h1>
            </div>
            <p className="text-sm text-astradarkgray">
              Welcome to our official platform where alumni and students stay connected. Register now and stay updated on upcoming events, access exclusive job opportunities, and explore our growing network.
            </p>
          </div>

          {/* Right Side - Services and Contact Us */}
          <div className="flex flex-col lg:flex-row gap-8 flex-2">
            <div className="flex flex-wrap gap-4 flex-1">
              <div className="flex-1 min-w-[140px]">
                <h2 className="text-xl font-semibold text-astraprimary mb-4">Services</h2>
                <ul className="text-sm text-astradarkgray space-y-4">
                  {services.map((service) => (
                    <li key={service.text} className="hover:text-astraprimary hover:scale-105 cursor-pointer transition-all duration-200 ease-linear">
                      <Link href={service.link}>{service.text}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Learn More */}
              <div className="flex-1 min-w-[140px]">
                <h2 className="text-xl font-semibold text-astraprimary mb-4">Learn More</h2>
                <ul className="text-sm text-astradarkgray space-y-4">
                  {helpers.map((helper) => (
                    <li key={helper.text} className="hover:text-astraprimary hover:scale-105 cursor-pointer transition-all duration-200 ease-linear">
                      <Link href={helper.link} target="_blank">{helper.text}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>


            {/* Contact Us (Right Side, Separate Below) */}
            <div className="flex flex-col w-full lg:w-auto lg:ml-auto flex-1">
              <h2 className="text-xl font-semibold text-astraprimary mb-4">Contact Us</h2>
              <ul className="text-sm text-astradarkgray space-y-4">
                {contacts.map((contact) => (
                  <li key={contact.key} className="flex items-start gap-3">
                    <span className="text-astraprimary">
                      {contact.icon === "lucide:map-pin" ? <MapPin size={20} /> : <Mail size={20} />}
                    </span>
                    <span>{contact.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-astraprimary w-full py-4 text-white">
        <div className="flex justify-center items-center max-w-screen-xl mx-auto text-sm">
          <p className="text-center">Copyright © 2025 ICS-ASTRA Team</p>
        </div>
      </div>
    </footer>
  );
}
