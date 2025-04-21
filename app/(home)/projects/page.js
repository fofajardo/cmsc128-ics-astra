'use client';

import { useState } from 'react';
import NavbarUser from '../../components/NavbarUser';
import Footer from '../../components/Footer';
import ProjectCard from '../../components/projects/ProjectCard';
import Image from 'next/image';
import Logo from '../../assets/logo.png';


export default function ProjectsPage() {
  const [showRequestPanel, setShowRequestPanel] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [amount, setAmount] = useState('');
  const [zip, setZip] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleReset = () => {
    setShowRequestPanel(false);
    setStep(1);
    setSelectedOption(null);
    setAmount('');
    setZip('');
    setTitle('');
    setDescription('');
    setImage(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarUser />

      {/* Hero Section */}
      <section className="relative bg-[url('/blue-bg.png')] bg-cover bg-center text-white text-center py-32">
        <div className="relative z-10">
          <h2 className="text-xl font-medium">Equal access to tech futures</h2>
          <h1 className="text-4xl font-bold mt-2">Debug the <br /> opportunity gap</h1>
          <button
            onClick={() => setShowRequestPanel(true)}
            className="mt-6 bg-white text-blue-700 font-semibold py-2 px-6 rounded shadow hover:bg-gray-100 transition"
          >
            Request a Fundraiser
          </button>
        </div>
      </section>

      {/* Project Grid */}
      <section className="bg-gray-100 py-16 px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Fund the future of technology</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[...Array(6)].map((_, i) => (
            <ProjectCard key={i} />
          ))}
        </div>
      </section>

      {/* See More Button */}
      <div className="flex justify-center mt-6">
        <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-100 transition">
          See More
        </button>
      </div>

      {/* Why Your Support Matters */}
      <section className="bg-blue-100 mt-16 py-16 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-2">Why Your Support Matters</h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-12">
          Your generosity, at any amount, powers real change—tracked, reported, and celebrated.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { title: 'Immediate Impact', desc: 'Your donation powers urgent aid—where it matters most.' },
            { title: 'Sustainable Solutions', desc: 'Building self-sufficient futures, not quick fixes.' },
            { title: 'Transparent Operations', desc: 'Accountability you can compile and run.' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Donation Process */}
      <section className="bg-gray-100 py-16 px-4">
        <h2 className="text-2xl font-semibold text-center mb-12">Donation Process</h2>
        <div className="max-w-3xl mx-auto space-y-8 relative">
          {[
            {
              step: 'Visit Our Donation Page',
              desc: 'Navigate to our secure donation platform where you can review our mission and impact.',
              sub: '🔒 Secure and encrypted connection',
            },
            {
              step: 'Choose a project to support',
              desc: 'Choose from a number of causes to support.',
              sub: '💳 Flexible payment options',
            },
            {
              step: 'Fill up the form',
              desc: 'Fill in your contact details and payment information. This helps us process your donation and send you a receipt.',
              sub: '📝 Protected and confidential',
            },
            {
              step: 'Receive Confirmation',
              desc: 'After your donation is processed, you’ll receive a confirmation after we verify your payment.',
              sub: '📧 Confirmation',
            },
          ].map((item, index) => (
            <div key={index} className="relative pl-10">
              <div className="absolute left-0 top-1 text-white bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
              <h4 className="font-bold text-lg">{item.step}</h4>
              <p className="text-gray-700">{item.desc}</p>
              <p className="text-sm text-blue-600 mt-1">{item.sub}</p>
              {index < 3 && (
                <div className="absolute left-2.5 top-6 w-1 h-16 bg-blue-300"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Completed Fundraisers */}
      <section className="bg-blue-100 py-12">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Completed Fundraisers</h2>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, index) => (
            <ProjectCard
              key={index}
              image="/projects/assets/Donation.jpg"
              title="Snacks to Support Student Success"
              description="This project aims to provide snacks to students to encourage attendance and enhance focus."
              amountRaised="PHP20K"
              goalAmount="PHP50K"
              donors="30K"
              buttonText="Read story"
            />
          ))}
        </div>
      </section>

      {/* Request Fundraiser Modal */}
      {/* Request Fundraiser Modal */}
{showRequestPanel && (
  <div className="fixed inset-0 z-50 backdrop-blur-sm flex justify-center items-center">
    <div className="bg-white w-full max-w-4xl flex rounded-lg shadow-lg overflow-hidden">
      {/* Left Panel */}
<div className="w-1/3 bg-[#d7e4f7] p-6 flex flex-col relative">
  {/* Logo in top-left */}
  <div className="absolute top-4 left-4">
    <Image
      src={Logo}
      alt="Brand Logo"
      width={80}
      height={80}
      className="object-contain"
    />
  </div>

  {/* Content Centered Vertically */}
  <div className="flex flex-col items-center justify-center text-center flex-1">
    <div className="bg-white p-4 rounded-full mb-4">
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h2 className="text-lg font-semibold mb-2">
      {step === 1 && "Tell us who you're raising funds for"}
      {step === 2 && "Tell us how much you'd like to raise"}
      {step === 3 && "Tell us more about your fundraiser"}
      {step === 4 && "Share a photo of your fundraiser with us"}
      {step === 5 && "Send a request for your fundraiser"}
    </h2>
    <p className="text-sm text-gray-700 px-2">
      {step === 1 && "This information helps us get to know you and your fundraising needs."}
      {step === 2 && "This helps us understand your goal and location."}
      {step === 3 && "Add more details so donors know what they're supporting."}
      {step === 4 && "Photos help build trust and tell your story better."}
      {step === 5 && "Review your details before sending the request."}
    </p>
    <p className="text-xs text-gray-600 mt-4">Step {step} of 5</p>
  </div>
</div>


      {/* Right Panel */}
      <div className="w-2/3 p-6 flex flex-col justify-between min-h-[500px] max-h-[600px]">
        <div className="flex-1 overflow-auto pr-2">

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Who are you fundraising for?</h3>
              <div className="space-y-4">
                {[
                  { label: 'Yourself', desc: 'Funds are delivered to your bank account for your own use' },
                  { label: 'Someone else', desc: 'You’ll link a beneficiary to receive funds or distribute them yourself' },
                  { label: 'Charity', desc: 'Funds are delivered to your chosen charity for you' },
                ].map((option) => (
                  <div
                    key={option.label}
                    onClick={() => setSelectedOption(option.label)}
                    className={`border rounded-lg p-4 cursor-pointer shadow-sm hover:shadow-md transition ${
                      selectedOption === option.label ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <h4 className="font-semibold text-blue-900">{option.label}</h4>
                    <p className="text-sm text-gray-600">{option.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Fundraiser details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    How much would you like to raise?
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    placeholder="Enter Amount in Pesos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Where are you fundraising?
                  </label>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    placeholder="Enter your ZIP code"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Describe why you're fundraising</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Give your fundraiser a title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    placeholder="e.g. Help Paul attend college"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Describe your need and situation
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2 h-28"
                    placeholder="Hey everyone, I'm fundraising to ..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Almost done. Add a fundraiser photo</h3>
              <p className="text-sm text-gray-600 mb-4">
                A high-quality photo or video will help tell your story and build trust with donors
              </p>
              <div className="border-2 border-dashed border-blue-400 rounded-lg p-6 text-center">
                <label className="cursor-pointer text-blue-600 hover:underline">
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  Add photo or video
                </label>
                {image && (
                  <div className="mt-4">
                    <Image src={image} alt="Preview" width={200} height={200} className="rounded-md mx-auto" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5 */}
          {step === 5 && (
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-6">Fundraiser preview</h3>
              {image && (
                <Image
                  src={image}
                  alt="Preview"
                  width={300}
                  height={300}
                  className="rounded-md mx-auto mb-4 object-cover"
                />
              )}
              <h4 className="font-bold text-lg">{title || 'Help these kids eat'}</h4>
              <p className="text-sm text-gray-600 mt-1 max-w-sm mx-auto">{description}</p>
              <div className="mt-4 text-sm text-left max-w-sm mx-auto">
                <p><strong>Goal:</strong> ₱{amount || 'PHP50K'}</p>
                <p><strong>ZIP Code:</strong> {zip || '0000'}</p>
                <p><strong>For:</strong> {selectedOption || 'Yourself'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => (step === 1 ? handleReset() : setStep(step - 1))}
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            &larr; Back
          </button>
          <button
            disabled={
              (step === 1 && !selectedOption) ||
              (step === 2 && (!amount || !zip)) ||
              (step === 3 && (!title || !description)) ||
              (step === 4 && !image)
            }
            onClick={() => (step === 5 ? handleReset() : setStep(step + 1))}
            className={`px-6 py-2 rounded text-white font-semibold ${
              (step === 1 && selectedOption) ||
              (step === 2 && amount && zip) ||
              (step === 3 && title && description) ||
              (step === 4 && image) ||
              step === 5
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-300 cursor-not-allowed'
            }`}
          >
            {step === 5 ? 'Request' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  </div>
)}




      <Footer />
    </div>
  );
}
