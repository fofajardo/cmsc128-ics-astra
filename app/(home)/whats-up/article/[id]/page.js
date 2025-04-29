"use client";
import React from "react";
import { motion } from "framer-motion";

const ArticleView = () => {
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

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="relative h-[400px] overflow-hidden">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/7687333fb4bb4909a4eab75308bcf09b/1a9fce8de5bbc67cde493dc9047dbf1517e56bb5"
              alt="ICS Faculty Members"
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
              ICS Welcomes New Faculty Members
            </motion.h1>

            <motion.time
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              dateTime="2025-04-01"
              className="block mt-6 text-center text-slate-500 font-medium"
            >
              Published on April 01, 2025
            </motion.time>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 prose prose-lg prose-slate mx-auto"
            >
              <p className="leading-relaxed">
                The Institute of Computer Science (ICS) is delighted to
                announce the addition of several distinguished faculty members
                to its team this academic year...
              </p>
              {/* ...existing content... */}
            </motion.div>
          </div>
        </motion.section>
      </motion.article>
    </div>
  );
};

export default ArticleView;
