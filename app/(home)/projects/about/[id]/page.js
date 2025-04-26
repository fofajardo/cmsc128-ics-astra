'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function ProjectDetails() {
  const router = useRouter();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const shareUrl = 'https://icsastra.com/f0b2ffa6';
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const searchParams = useSearchParams();
const isCompleted = searchParams.get('completed') === 'true';

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
    <button
     onClick={() =>{
      setIsContactModalOpen(true);
      setIsSubmitted(false);
     }}
     className="mt-3 sm:mt-0 border border-[var(--color-astraprimary)] text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-100 transition">
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
            <button
             onClick={() => setIsShareModalOpen(true)}
             className="flex-1 bg-astrablack text-astrawhite hover:bg-[var(--color-astraprimary)] px-4 py-2 text-sm rounded">
              Share
            </button>
            <button 
              onClick={() =>{
                if (isCompleted) router.push('/projects/donate');
               }}
               disabled={isCompleted}
              className={`flex-1 px-4 py-2 text-sm rounded transition ${
                isCompleted
                ? 'bg-astralightgray-300 text-astradarkgray-500 cursor-not-allowed'
                : 'bg-[var(--color-astraprimary)] text-astrawhite hover:bg-[var(--color-astraprimary)]'
              }`}
                >
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
      {isShareModalOpen && (
  <div className="fixed inset-0 bg-blur bg-astrawhite/60 bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-astralightgray rounded-xl p-6 w-[90%] max-w-md relative">
      <button
        onClick={() => setIsShareModalOpen(false)}
        className="absolute top-4 left-4 text-xl text-astrablack"
      >
        ←
      </button>
      <h2 className="text-lg font-bold text-center mb-6">Quick share</h2>
      <div className="flex items-center bg-white rounded-md shadow px-4 py-3">
        <div className="flex-1">
          <p className="text-xs text-astrablack mb-1">Your unique link</p>
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full font-medium text-sm bg-transparent focus:outline-none"
          />
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(shareUrl);
            alert('Link copied to clipboard!');
          }}
          className="ml-4 text-sm font-semibold text-blue-600 hover:underline"
        >
          Copy link
        </button>
      </div>
    </div>
  </div>
)}
  {isContactModalOpen && (
  <div className="fixed inset-0 backdrop-blur-sm bg-astrawhite/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-[90%] max-w-md relative shadow-xl">
      {/* Back Button */}
      <button
        onClick={() => setIsContactModalOpen(false)}
        className="absolute top-4 left-4 text-xl text-gray-700"
      >
        ←
      </button>

      <h2 className="text-lg font-bold text-center mb-4">Contact</h2>

      {/* Organizer Info */}
      <div className="flex items-center gap-3 mb-6">
        <Image src="/avatar.png" alt="Organizer" width={40} height={40} className="rounded-full" />
        <div>
          <p className="text-sm font-semibold">Mirella Arguelles</p>
          <p className="text-xs text-astrablack">Organizer</p>
          <p className="text-xs text-astrablack">Los Baños, Laguna</p>
        </div>
      </div>

      {/* Success Message */}
      {isSubmitted ? (
        <div className="text-center text-green-600 font-medium mb-4">
          ✅ Your message has been sent!
        </div>
      ) : (
        <>
          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsSubmitted(true);
              setFormData({ name: '', email: '', message: '' });
            }}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded-md px-4 py-2 text-sm focus:outline-none"
              required
            />
            <input
              type="email"
              placeholder="Your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border rounded-md px-4 py-2 text-sm focus:outline-none"
              required
            />
            <textarea
              placeholder="Your message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full border rounded-md px-4 py-2 text-sm resize-none focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-[var(--color-astraprimary)] text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </>
      )}
    </div>
  </div>
)}

    </div>

  );
}
