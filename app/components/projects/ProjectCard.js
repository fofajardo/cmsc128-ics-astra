'use client';
import Image from 'next/image';
import sampleImage from '../../assets/Donation.jpg';
import { useRouter } from 'next/navigation';



export default function ProjectCard({
  image = sampleImage,
  title = "Snacks to Support Student Success",
  description = "This project aims to provide middle school students the resources they need to excel academically, emotionally, and physically...",
  goal = "PHP50K",
  raised = "PHP20K",
  donors = "30K",
  showDonate= true
}) {
  const router = useRouter();
  return (
    <div className="bg-astrawhite rounded-2xl shadow p-4  border-2 border-transparent transition-all duration-300 hover:border-[var(--color-astraprimary)]">
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
      <div className="grid grid-cols-3 gap-2 text-center mt-4">
  <div>
    <p className="text-xs text-astradarkgray">Goal</p>
    <p className="font-medium">{goal}</p>
  </div>
  <div>
    <p className="text-xs text-astradarkgray">Raised</p>
    <p className="font-medium">{raised}</p>
  </div>
  <div>
    <p className="text-xs text-astradarkgray">Donors</p>
    <p className="font-medium">{donors}</p>
  </div>
</div>

    {showDonate &&(
      <button
      onClick={() => router.push('/projects/donate')}
      className="mt-4 blue-button w-full">
       Donate
     </button>
    )}
      
      
    </div>
  );
}
