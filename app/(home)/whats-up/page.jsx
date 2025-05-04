"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import Next.js router
import { HeroSection } from "./components/HeroSection";
import { NewsItem } from "./components/NewsItem";
import { PaginationControls } from "./components/PaginationControls";
import { YearFilter } from "./components/YearFilter";
import { NewsletterArchive } from "./components/NewsletterArchive";
import animations from "./styles/animations.module.css";
import { FileText } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function WhatsUpPage() {
  const router = useRouter(); // Initialize router

  const [loading, setLoading] = useState(true);
  const [newsList, setNewsList] = useState([]);


  useEffect(() => {
    // Add staggered animation to news items
    const items = document.querySelectorAll(".news-item");
    items.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.2}s`;
    });
  }, []);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/announcements`,
          {
            params: {

            }
          }
        );
        if (response.data.status === "OK") {
          console.log("Fetched news:", response.data);
          const updatedNewsList = await Promise.all(
            response.data.list.map(async (news) => {
              const newsData = {
                id: news.post_id,
                category: news.category,
                files: news.files,
                title: news.content_data.title,
                details: news.content_data.details,
                // Placeholder for image URL
                imageUrl: news.content_data.image_url || "https://cdn.builder.io/api/v1/image/assets/7687333fb4bb4909a4eab75308bcf09b/950fa1cdac6430480b31ef36a44036380a994f87?placeholderIfAbsent=true"
              }
              // TODO: FETCH IMAGE PROPERLY

              return newsData;
            })

          )
          setNewsList(updatedNewsList);
          console.log("Updated news list:", updatedNewsList);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);


  return (
    <main className={animations.fadeSlideUp}>
      <div className="flex flex-col w-full bg-slate-100 max-md:max-w-full">
        <HeroSection />

        <section className="flex flex-col self-center px-4 w-full max-w-[1200px] pb-20">
          <div className="h-[100px]" />
          <h2 className="self-start text-3xl font-bold text-slate-900 max-md:max-w-full max-md:text-2xl">
            Latest News and Announcements
          </h2>

          <p className="mt-6 text-lg leading-7 text-slate-500 max-md:mt-4 max-md:mr-2.5 max-md:max-w-full">
            Stay updated with the latest happenings, announcements, and
            achievements from our vibrant community. From academic milestones to
            student success stories, discover what&apos;s making headlines.
          </p>

          <div className="mt-12 w-full max-md:mt-8 max-md:max-w-full">
            {/* News items grid */}
            <div className="flex flex-col gap-8 max-md:gap-6">
              {renderNewsItems(newsList, loading)}
            </div>
          </div>

          {/* <PaginationControls />

          <h2 className="self-start mt-24 text-3xl font-bold text-slate-900 max-md:mt-8 max-md:max-w-full max-md:text-2xl">
            Newsletter Archives
          </h2>

          <p className="mt-6 text-lg leading-7 text-slate-500 max-md:mt-4 max-md:max-w-full">
            Browse through our collection of past newsletters to stay informed
            about historical events, developments, and stories that have shaped
            our community over the years.
          </p>

          <YearFilter />
          <NewsletterArchive /> */}
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

function renderNewsItems(newsItems, loading) {
  return (
    <div className="relative">
      <LoadingOverlay loading={loading} coverContainer={true} />
      {!loading ? (
        newsItems.length > 0 ? (
          <div className="flex flex-col gap-8 max-md:gap-6">
            {newsItems.map((item) => newsItemBuilder(item))}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-64">
            No news available at the moment.
          </div>
        )
      ) : null}
    </div>
  );

}

function newsItemBuilder(item) {
  return (
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
        <p className="mt-3 text-base text-slate-500">{item.description}</p>
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
  );
}
