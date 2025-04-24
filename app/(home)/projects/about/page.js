'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProjectDetails() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-astrawhite text-astrablack-800">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto pt-24 px-4">
        <button
          onClick={() => router.back()}
          className="text-sm text-astrablack hover:text-blue-600 transition"
        >
          &larr; Back
        </button>
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 pb-20 mt-4">
        {/* Left Column */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">
            Snacks to Support Student Success
          </h1>

          <Image
            src="/projects/assets/Donation.jpg"
            alt="Fundraiser"
            width={900}
            height={500}
            className="rounded-md object-cover w-full h-64"
          />

          {/* Organizer Line */}
          <div className="flex items-center mt-6 border-b border-astrablack pb-4">
            <Image
              src="/avatar.png"
              alt="Organizer"
              width={40}
              height={40}
              className="rounded-full mr-2"
            />
            <p className="text-sm text-astrablack">
              <strong className="text-astrablack-800">Mirella Arguelles</strong> is organizing this fundraiser.
            </p>
          </div>

          {/* Description */}
          <p className="mt-6 text-sm leading-relaxed  border-b border-astrablack pb-6">
            Help us provide nutritious snacks to students during their long study sessions and exam preparations.
            Many students skip meals due to tight schedules and budget constraints, affecting their academic performance and overall well-being.
            Your contribution will help stock our student pantry with healthy snacks, ensuring students have access to proper nutrition when they need it most.
            We aim to provide energy-rich, brain-boosting snacks that can help maintain focus and productivity throughout the day.
            This initiative has already helped hundreds of students maintain better study habits and achieve better results.
            Join us in supporting student success by ensuring no student has to study on an empty stomach.
            Your donation will directly impact students' ability to stay energized, focused, and successful in their academic journey.
          </p>

         {/* Organizer Section */}
<div className="pt-6">
  <h2 className="font-semibold text-lg mb-3">Organizer</h2>
  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
    <div className="flex items-center gap-4">
      <Image
        src="/avatar.png"
        alt="Organizer"
        width={50}
        height={50}
        className="rounded-full"
      />
      <div>
        <p className="text-sm font-medium">Mirella Arguelles</p>
        <p className="text-xs text-astrablack">Organizer</p>
        <p className="text-xs text-astrablack">Los Baños, Laguna</p>
      </div>
    </div>
    <button className="mt-3 sm:mt-0 border border-[var(--color-astraprimary)] text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-100 transition">
      Contact
    </button>
  </div>
  <p className="text-xs text-astrablack mt-2">Created on April 1, 2025</p>
</div>

        </div>

        {/* Right Column - Donation Card */}
        <div className="bg-astrawhite p-6 rounded-lg shadow-md border border-gray-200 h-fit">
          <h3 className="text-xl font-semibold text-astrablack-800">
            ₱35,000 <span className="font-normal text-sm text-astrablack">raised</span>
          </h3>
          <p className="text-sm text-astrablack mb-4">₱60,000 goal • ₱25,000 remaining</p>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-200 rounded mb-4">
            <div className="h-full bg-[var(--color-astraprimary)]-600 rounded" style={{ width: '58%' }}></div>
          </div>

          <p className="text-sm text-astrablack">120 Contributors</p>
          <p className="text-sm text-astrablack mb-6">📅 12 days left</p>

          <div className="flex gap-2 mb-6">
            <button className="flex-1 bg-astrablack text-astrawhite hover:bg-[var(--color-astraprimary)] px-4 py-2 text-sm rounded">
              Share
            </button>
            <button 
              onClick={() => router.push('/projects/donate')}
              className="flex-1 bg-[var(--color-astraprimary)] text-astrawhite hover:[var(--color-astraprimary)] px-4 py-2 text-sm rounded">
              Donate
            </button>
          </div>

          {/* Donor List */}
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <Image src="/avatar.png" alt="user" width={20} height={20} />
                <span>Anonymous</span>
              </div>
              <span className="text-astrablack">₱200 <span className="text-xs">Recent Donation</span></span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <Image src="/avatar.png" alt="user" width={20} height={20} />
                <span>Neil</span>
              </div>
              <span className="text-astrablack">₱5,000 <span className="text-xs">Top Donation</span></span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <Image src="/avatar.png" alt="user" width={20} height={20} />
                <span>Juls</span>
              </div>
              <span className="text-astrablack">₱50 <span className="text-xs">First Donation</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
