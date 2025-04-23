"use client";
import Image from "next/image";
import sampleImage from "../../assets/Donation.jpg";

export default function ProjectCard({
  image = sampleImage,
  title = "Snacks to Support Student Success",
  description = "This project aims to provide middle school students the resources they need to excel academically, emotionally, and physically...",
  goal = "PHP50K",
  raised = "PHP20K",
  donors = "30K",
}) {
  return (
    <div className="bg-astrawhite rounded-2xl shadow p-4  border-2 border-transparent transition-all duration-300 hover:border-astraprimary">
      <div className="rounded-xl overflow-hidden">
        <Image
          src={image}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          width={400}
          height={200}
        />
      </div>
      <h3 className="mt-4 font-lb">{title}</h3>
      <p className="text-astradarkgray font-s mt-2">{description}</p>
      <div className="flex justify-between mt-4 font-s text-astradarkgray">
        <span>{goal}</span>
        <span>{raised}</span>
        <span>{donors}</span>
      </div>
      <button className="mt-4 blue-button w-full">Donate</button>
    </div>
  );
}
