import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail } from "lucide-react";

export default function Footer() {
  const websiteLinks = [
    {text:"Home", link:"/home"},
    {text:"About", link:"/about"},
    {text:"Get in touch", link:"#"},
    {text:"FAQs", link:"#"},
    {text:"Request Alumni Info", link:"/whats-up/request-info"} // Added new link
  ];
  const services = [{text:"Alumni Search", link:"/home"},{text:"Event Management", link:"/events"},{text:"Job Posting", link:"/jobs"},{text:"Reports Summary", link:"/reports"}]
  const helpers = [{text:"UPLB", link:"http://uplb.edu.ph/"},{text:"OVCAA UPLB", link:"https://ovcaa.uplb.edu.ph/"},{text:"Graduate School", link:"https://uplb.edu.ph/college/graduate-school/"}]
  const contacts = [{key: 1, icon: "lucide:map-pin", text:"Physical Sciences Building, Harold Cuzner Royal Palm Ave, Los Baños"},
                    {key: 2, icon: "lucide:mail", text:"astratech@gmail.com"}]
  const socmeds = [{key: 1, icon: "/icons/facebook.svg", link: "https://facebook.com"}, {key: 2, icon: "/icons/instagram.svg", link: "https://instagram.com"}, {key: 3, icon: "/icons/linkedin.svg", link: "https://linkedin.com"}]


  return (
    <footer className="w-full font-display overflow-hidden">
      <div className="mx-auto w-full max-w-screen-xl px-15 py-10 flex flex-row flex-wrap justify-between items-start sm:flex-row">

        {/* Website Information */}
        <div className="flex flex-col gap-5 justify-between lg:w-1/2 lg:pr-20 sm:w-full">
          {/* Website Title */}
          <div className="flex flex-row justify-start items-center gap-5">
            <Image width={70} height={70} src={'/astra-logo.png'} alt="ICS-ASTRA Logo"></Image>
            <h1 className="text-xl text-astra-astrablack font-semibold">ICS-ASTRA</h1>
          </div>
          {/* Paragraph */}
          <p className="text-astradarkgray text-base">Welcome to our official platform where alumni and students stay connected. Stay updated on upcoming events, access exclusive job opportunities, and explore our growing network. Subscribe now and be part of our mission to empower the UPLB community through innovation and collaboration.</p>
          {/* Newsletter Signup */}
          <form className="flex flex-row items-center flex-wrap gap-2 sm:gap-5">
            <input type="email" placeholder="Enter your email address" className="text-astradarkgray placeholder-astradarkgray text-sm bg-astratintedwhite border-astradarkgray border-1 outline-none pl-3 py-1.5 w-75"></input>
            <input type="submit" value="Subscribe" className="text-astradark text-xs border-astradark border-1 py-2 w-25 hover:cursor-pointer hover:scale-[1.05] transition-all duration-150 ease-in"></input>
          </form>
        </div> 

        {/* Links */}
        <div className="lg:w-14/30 w-full flex flex-wrap flex-row justify-between">
          {/* Other Website Links */}
          <div className="w-1/3 min-w-20">
            <h2 className="text-xl font-semibold text-astrablack my-5">Website Links</h2>
            <ul className="text-base text-astradarkgray space-y-5">
              {websiteLinks.map((weblink)=>{
                return (
                <li key={weblink.text} className="hover:text-astrablack hover:scale-[1.02] cursor-pointer transition-all duration-200 ease-linear">
                    <Link href={weblink.link}>{weblink.text}</Link>
                </li>
              )})}
            </ul>
          </div >
          {/* ICS-ASTRA Main Pages */}
          <div className="w-1/3 min-w-20">
            <h2 className="text-xl font-semibold text-astrablack my-5">Services</h2>
            <ul className="text-base text-astradarkgray space-y-5">
              {services.map((service)=>{
                return (
                <li key={service.text} className="hover:text-astrablack hover:scale-[1.02] cursor-pointer transition-all duration-200 ease-linear">
                    <Link href={service.link}>{service.text}</Link>
                </li>
              )})}
            </ul>
          </div>
          {/* Learn More Column (Related UPLB Websites) */}
          <div className="w-1/3 min-w-20">
            <h2 className="text-xl font-semibold text-astrablack my-5">Learn More</h2>
            <ul className="text-base text-astradarkgray space-y-5">
              {helpers.map((helper)=>{
                return (
                <li key={helper.text} className="hover:text-astrablack hover:scale-[1.02] cursor-pointer transition-all duration-200 ease-linear">
                    <Link href={helper.link} target="_blank">{helper.text}</Link>
                </li>
              )})}
            </ul>
          </div>
        </div>
      </div>
      {/* Contacts */}
      <div className="mx-auto w-full max-w-screen-xl px-15 pb-10">
        <h1 className="font-bold text-astrablack text-lg">Contact Us</h1>
          <div className="text-astradarkgray text-base flex flex-row gap-3 items-center py-3">
            <MapPin size={24}/>
            <p className="max-w-75 leading-5">{contacts[0].text}</p>
          </div>
          <div className="text-astradarkgray text-base flex flex-row gap-3 items-center py-3">
            <Mail size={24}/>
            <p className="max-w-75 leading-5">{contacts[1].text}</p>
          </div>
      </div>
      {/* Copyright and Socmeds */}
      <div className="flex flex-col justify-end bg-astraprimary w-full h-30 lg:h-20 md:h-20">
        <div className="mx-25 pt-4 pb-2 border-white border-t-1 flex flex-row justify-center text-white text-sm flex-wrap sm:justify-between">
          <div className="flex flex-row gap-5 items-end ml-2">
            {socmeds.map((socmed) => {
              return (
                <Link key={socmed.key} href={socmed.link} target="_blank"><Image src={socmed.icon} width={26} height={26} alt={socmed.link} className="shrink-0"></Image></Link>
            )})}
          </div>
          <p className="mt-3 text-center sm:mt-0">Copyrighted © 2025 Designed and Developed by Astra</p>
        </div>
      </div>
    </footer>
  );
}