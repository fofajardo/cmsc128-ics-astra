import Image from "next/image";
import NavbarUser from '../../../components/NavbarUser';

export default function ProjectDetails() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <NavbarUser />

      {/* Main Content*/}
      <div className="max-w-6xl mx-auto py-4 px-4 pt-20">
        <button className="text-blue-600 hover:underline">&larr; Back</button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pb-20">
        {/* Left Section */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-semibold mb-4">
            Snacks to Support Student Success
          </h1>

          <Image
            src="/projects/assets/Donation.jpg"
            alt="Fundraiser"
            width={700}
            height={700}
            className="rounded-md object-cover w-full h-64"
          />

          <div className="flex items-center mt-4">
            <Image
              src="/avatar.png"
              alt="Organizer"
              width={40}
              height={40}
              className="rounded-full mr-2"
            />
            <p className="text-sm">
              <strong>Mirella Arguelles</strong> is organizing this fundraiser.
            </p>
          </div>

          <p className="mt-6 text-sm leading-relaxed">
          Help us provide nutritious snacks to students during their long study  sessions and exam preparations. Many students skip meals due to tight  schedules and budget constraints, affecting their academic performance  and overall well-being. Your contribution will help stock our student  pantry with healthy snacks, ensuring students have access to proper  nutrition when they need it most. We aim to provide energy-rich,  brain-boosting snacks that can help maintain focus and productivity  throughout the day. This initiative has already helped hundreds of  students maintain better study habits and achieve better results. Join  us in supporting student success by ensuring no student has to study on  an empty stomach. Your donation will directly impact students' ability  to stay energized, focused, and successful in their academic journey.
          </p>

          {/* Organizer Info */}
          <div className="mt-6">
            <h2 className="font-semibold text-lg mb-2">Organizer</h2>
            <div className="flex items-center gap-2">
              <Image
                src="/avatar.png"
                alt="Organizer"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">Mirella Arguelles</p>
                <p className="text-xs text-gray-500">Organizer</p>
                <p className="text-xs text-gray-500">Los Baños, Laguna</p>
              </div>
              <button className="text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-100 text-sm mt-2">
                Contact
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Created on April 1, 2025</p>
          </div>
        </div>

        {/* Right Section - Fundraising Info */}
        <div className="bg-gray-50 p-6 rounded-md shadow-lg">
          <h3 className="text-3xl font-semibold mb-2">₱35,000 <span className="font-normal text-sm text-gray-600">raised</span></h3>
          <p className="text-sm text-gray-500 mb-4">₱60,000 goal • ₱25,000 remaining</p>
          <p className="text-sm text-gray-600 mb-2">120 Contributors</p>
          <p className="text-sm text-gray-600 mb-4">12 days left</p>
          <div className="flex gap-4">
            <button className="flex-1 bg-[#061A37] text-white hover:bg-[#4b6789] px-4 py-2 text-sm rounded">Share</button>

            <button className="flex-1 bg-[#0E6CF3] text-white hover:bg-blue-700 px-4 py-2 text-sm rounded">Donate</button>
          </div>

          {/* Donation List */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Anonymous</span>
              <span>₱20,000</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Neil</span>
              <span>₱10,000</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Julie</span>
              <span>₱5,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
