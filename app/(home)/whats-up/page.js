"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // Import Next.js router
import { HeroSection } from "./components/HeroSection";
import { NewsItem } from "./components/NewsItem";
import { PaginationControls } from "./components/PaginationControls";
import { YearFilter } from "./components/YearFilter";
import { NewsletterArchive } from "./components/NewsletterArchive";
import animations from "./styles/animations.module.css";
import { FileText } from "lucide-react";
import Link from "next/link";

export default function WhatsUpPage() {
  const router = useRouter(); // Initialize router

  useEffect(() => {
    // Add staggered animation to news items
    const items = document.querySelectorAll('.news-item');
    items.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.2}s`;
    });
  }, []);

  // Sample news data for demonstration
  const newsItems = [
    {
      id: 1,
      title: "News Title 1",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/7687333fb4bb4909a4eab75308bcf09b/950fa1cdac6430480b31ef36a44036380a994f87?placeholderIfAbsent=true"
    },
    {
      id: 2,
      title: "News Title 2",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/7687333fb4bb4909a4eab75308bcf09b/950fa1cdac6430480b31ef36a44036380a994f87?placeholderIfAbsent=true"
    },
    {
      id: 3,
      title: "News Title 3",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/7687333fb4bb4909a4eab75308bcf09b/950fa1cdac6430480b31ef36a44036380a994f87?placeholderIfAbsent=true"
    },
    {
      id: 4,
      title: "News Title 4",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/7687333fb4bb4909a4eab75308bcf09b/950fa1cdac6430480b31ef36a44036380a994f87?placeholderIfAbsent=true"
    },
    {
      id: 5,
      title: "News Title 5",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/7687333fb4bb4909a4eab75308bcf09b/950fa1cdac6430480b31ef36a44036380a994f87?placeholderIfAbsent=true"
    }
  ];

  return (
    <main className={animations.fadeSlideUp}>
      <div className="flex flex-col pb-20 w-full bg-slate-100 max-md:pb-12 max-md:max-w-full">
        <HeroSection />

        {/* Add Request Info button */}
        <div className="flex justify-end px-4 mt-8 max-w-[1200px] mx-auto w-full">
          <Link 
            href="/whats-up/request-info"
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Request Alumni Information
          </Link>
        </div>

        <section className="flex flex-col self-center mt-16 mb-0 w-full max-w-[1200px] max-md:mt-8 max-md:mb-2 max-md:max-w-full px-4">

          <h2 className="self-start text-3xl font-bold text-slate-900 max-md:max-w-full max-md:text-2xl">
            Latest News and Announcements
          </h2>

          <p className="mt-6 text-lg leading-7 text-slate-500 max-md:mt-4 max-md:mr-2.5 max-md:max-w-full">
            Stay updated with the latest happenings, announcements, and
            achievements from our vibrant community. From academic milestones to
            student success stories, discover what's making headlines.
          </p>

          <div className="mt-12 w-full max-md:mt-8 max-md:max-w-full">
            {/* News items grid */}
            <div className="flex flex-col gap-8 max-md:gap-6">
              {newsItems.map((item) => (
                <div
                  key={item.id}
                  className={`news-item ${animations.staggered} flex flex-row gap-6 bg-white rounded-lg shadow-sm hover:shadow-xl hover:scale-102 transition-all duration-300 max-md:flex-col`}
                >
                  <div className="w-2/5 max-md:w-full">
                    <img
                      src={item.imageUrl}
                      alt={`News thumbnail for ${item.title}`}
                      className="object-cover w-full h-full rounded-l-lg max-md:rounded-t-lg max-md:rounded-b-none"
                    />
                  </div>
                  <div className="w-3/5 p-6 flex flex-col justify-center max-md:w-full">
                    <h3 className="text-2xl font-bold text-slate-900 max-md:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-base text-slate-500">
                      {item.description}
                    </p>
                    <div className="mt-4">
                      <button
                        onClick={() => router.push(`/whats-up/article/${item.id}`)} // Navigate to article page
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Read more →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <PaginationControls />

          <h2 className="self-start mt-24 text-3xl font-bold text-slate-900 max-md:mt-8 max-md:max-w-full max-md:text-2xl">
            Newsletter Archives
          </h2>

          <p className="mt-6 text-lg leading-7 text-slate-500 max-md:mt-4 max-md:max-w-full">
            Browse through our collection of past newsletters to stay informed
            about historical events, developments, and stories that have shaped
            our community over the years.
          </p>

          <YearFilter />
          <NewsletterArchive />
        </section>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes pageFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-page-fade-in {
          animation: pageFadeIn 1s ease-in-out;
        }

        .hover:scale-105 {
          transition: transform 0.3s ease-in-out;
        }

        .hover:shadow-md {
          transition: box-shadow 0.3s ease-in-out;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </main>
  );
}