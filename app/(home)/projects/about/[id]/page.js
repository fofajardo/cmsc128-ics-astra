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
      {/* Share modal */}
      {isShareModalOpen && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
    <div className="bg-gradient-to-br from-white to-astralightgray rounded-2xl p-8 w-[90%] max-w-md relative shadow-xl border border-white/20 animate-scaleIn">
      <div className="absolute -top-3 -right-3">
        <button
          onClick={() => setIsShareModalOpen(false)}
          className="bg-white text-astrablack h-10 w-10 rounded-full flex items-center justify-center shadow-md hover:bg-astralightgray transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className="mb-7 text-center">
        <div className="flex justify-center mb-3">
          <div className="bg-astraprimary/10 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-astraprimary">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
          </div>
        </div>
        <h2 className="font-rb text-xl font-bold text-astrablack">Share Your Project</h2>
        <p className="text-sm text-gray-500 mt-1">Copy the link below to share with others</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-inner p-1">
        <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3 overflow-hidden">
          <div className="flex-shrink-0">
            <div className="bg-astraprimary/10 p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-astraprimary">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>
          </div>
          <input
            type="text"
            readOnly
            value={project.urlLink}
            className="w-full text-sm py-1 bg-transparent focus:outline-none text-gray-700 overflow-hidden text-ellipsis"
          />
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => {
            navigator.clipboard.writeText(project.urlLink);
            
            // Show success animation in button
            const btn = document.getElementById('copyBtn');
            btn.classList.remove('bg-astraprimary');
            btn.classList.add('bg-green-500');
            btn.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Copied!
            `;
            
            setToast({
              type: "success",
              message: "Share link copied to clipboard!",
            });
            
            setTimeout(() => setIsShareModalOpen(false), 1500);
          }}
          id="copyBtn"
          className="bg-astraprimary text-white py-3 px-6 rounded-xl flex items-center justify-center font-medium shadow-lg shadow-astraprimary/30 hover:shadow-astraprimary/40 hover:bg-astraprimary/90 transition-all duration-200 w-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy Link
        </button>
      </div>
      
      <div className="mt-5 pt-5 border-t border-gray-100 flex justify-center">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-3">Or share directly to</p>
          <div className="flex space-x-4 justify-center">
  <a 
    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(project.urlLink)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  </a>
  <a 
    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(project.urlLink)}&text=Check out this project!`}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-500 transition-colors"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  </a>
  <a 
    href={`https://api.whatsapp.com/send?text=Check out this project! ${encodeURIComponent(project.urlLink)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  </a>
  <a 
    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(project.urlLink)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  </a>
</div>
        </div>
      </div>
    </div>
  </div>
)}

<style jsx global>{`
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
  
  .animate-scaleIn {
    animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`}</style>
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
