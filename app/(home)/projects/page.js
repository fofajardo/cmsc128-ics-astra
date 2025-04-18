import Navbar from '@/components/NavbarUser';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-blue-700 text-white text-center py-20 relative">
        <div className="absolute inset-0 bg-black bg-opacity-40" />
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

      <Footer />
    </div>
  );
}
