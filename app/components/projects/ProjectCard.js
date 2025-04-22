'use client';
import Image from 'next/image';
import sampleImage from '../../assets/Donation.jpg';



export default function ProjectCard({
  image = sampleImage,
  title = 'Snacks to Support Student Success',
  description = 'This project aims to provide middle school students the resources they need to excel academically, emotionally, and physically...',
  goal = 'PHP50K',
  raised = 'PHP20K',
  donors = '30K',
}) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <Image src={image} alt={title} className="rounded-xl w-full h-48 object-cover" 
      width={400}
      height= {200}/>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
      <div className="flex justify-between mt-4 text-sm text-gray-700">
        <span>{goal}</span>
        <span>{raised}</span>
        <span>{donors}</span>
      </div>
      <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full">
        Donate
      </button>
    </div>
  );
}
