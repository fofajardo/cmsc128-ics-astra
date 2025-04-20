import NavbarUser from '../../components/NavbarUser';
import Footer from '../../components/Footer';
import ProjectCard from '../../components/projects/ProjectCard';


export default function ProjectsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarUser />

      {/* Hero Section */}
      <section className="relative bg-[url('/blue-bg.png')] bg-cover bg-center text-white text-center py-32">
  {/*<div className="absolute inset-0 bg-black bg-opacity-20 z-0" />*/}
  <div className="relative z-10">
    <h2 className="text-xl font-medium">Equal access to tech futures</h2>
    <h1 className="text-4xl font-bold mt-2">Debug the <br /> opportunity gap</h1>
    <button className="mt-6 bg-white text-blue-700 font-semibold py-2 px-6 rounded shadow hover:bg-gray-100 transition">
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
    {/* Completed Fundraisers Section */}
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



      <Footer />
    </div>
  );
}
