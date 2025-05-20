"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams } from "next/navigation";

const ArticleView = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // Fetch the article content
        const contentResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`);
        if (contentResponse.data.status === "OK") {
          setArticle(contentResponse.data.content);
        }

        // Get the photo from localStorage directly
        try {
          const photoUrl = localStorage.getItem(`article_photo_${id}`);
          if (photoUrl) {
            setPhoto(photoUrl);
            console.log("Photo URL:", photoUrl);
          }
        } catch (photoError) {
          console.error("Failed to get article photo from localStorage:", photoError);
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  useEffect(() => {
    // Log the photo whenever it changes
    console.log("Current photo state:", photo);
  }, [photo]);

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div role="main" className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-8 max-w-5xl"
      >
        <nav className="mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="group flex items-center gap-3 text-lg font-medium text-slate-700 hover:text-sky-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Articles
          </motion.button>
        </nav>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
          </div>
        ) : article ? (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="relative h-[400px] overflow-hidden">
              <img
                src={photo || "https://cdn.builder.io/api/v1/image/assets/7687333fb4bb4909a4eab75308bcf09b/1a9fce8de5bbc67cde493dc9047dbf1517e56bb5"}
                alt={article.title}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            <div className="px-8 md:px-16 py-12">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-5xl font-bold text-slate-800 text-center leading-tight"
              >
                {article.title}
              </motion.h1>

              <motion.time
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                dateTime={new Date(article.created_at).toISOString()}
                className="block mt-6 text-center text-slate-500 font-medium"
              >
                Published on {new Date(article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </motion.time>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-12 prose prose-lg prose-slate mx-auto"
              >
                <p className="leading-relaxed">
                  {article.details}
                </p>
              </motion.div>
            </div>
          </motion.section>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-800">Article not found</h2>
            <p className="mt-4 text-slate-600">The article you're looking for doesn't exist or has been removed.</p>
          </div>
        )}
      </motion.article>
    </div>
  );
};

export default ArticleView;
