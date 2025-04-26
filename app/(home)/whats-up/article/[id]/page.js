"use client";
import React from "react";

const ArticleView = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div role="main" className="rounded-none">
      <article className="flex flex-col items-center px-20 pt-16 pb-28 w-full bg-slate-100 max-md:px-5 max-md:pb-24 max-md:max-w-full">
        <div className="flex flex-col mb-0 w-full max-w-[1709px] max-md:mb-2.5 max-md:max-w-full">
          <nav className="mb-8">
            <button
              onClick={handleBack}
              className="flex gap-5 self-start text-3xl font-semibold whitespace-nowrap text-sky-950 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-md"
              aria-label="Go back to previous page"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/7687333fb4bb4909a4eab75308bcf09b/bb6816c8cf7179e97150735a20a241594827c17c?placeholderIfAbsent=true"
                alt="Back arrow icon"
                className="object-contain shrink-0 aspect-[1.04] w-[29px]"
              />
              <span className="my-auto">Back</span>
            </button>
          </nav>

          <section className="px-20 pt-28 pb-52 mt-8 bg-white rounded-2xl shadow-sm text-slate-400 max-md:px-5 max-md:py-24 max-md:max-w-full">
            <div className="flex flex-col mb-0 max-md:mb-2.5 max-md:max-w-full">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/7687333fb4bb4909a4eab75308bcf09b/1a9fce8de5bbc67cde493dc9047dbf1517e56bb5?placeholderIfAbsent=true"
                alt="ICS Faculty Members"
                className="object-contain w-full rounded-none aspect-[3.01] max-md:max-w-full"
              />

              <h1 className="self-center mt-14 text-4xl font-bold leading-snug text-center text-gray-700 max-md:mt-10 max-md:max-w-full">
                ICS Welcomes New Faculty Members
              </h1>

              <time
                dateTime="2025-04-01"
                className="self-center mt-6 ml-2.5 text-base"
              >
                Published on April 01, 2025
              </time>

              <div className="mt-20 text-2xl leading-9 text-justify max-md:mt-10 max-md:max-w-full">
                <p className="mb-8">
                  The Institute of Computer Science (ICS) is delighted to
                  announce the addition of several distinguished faculty members
                  to its team this academic year...
                </p>
                {/* ...remaining content... */}
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
};

export default ArticleView;
