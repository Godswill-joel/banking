// components/CustomerStories.tsx
"use client";

import { useState } from "react";
import { storiesData } from "../../data/data";

export default function CustomerStories() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStory = storiesData[activeIndex];

  return (
    <section className="bg-[#0f0f0f] text-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold mb-10">
          See why leading businesses are choosing River
        </h2>
        <nav
          className="flex justify-center items-center space-x-8 border-b border-gray-700 mb-12"
          role="tablist"
        >
          {storiesData.map((story, index) => (
            <button
              key={story.id}
              role="tab"
              aria-selected={activeIndex === index}
              onClick={() => setActiveIndex(index)}
              className={`pb-3 text-base font-medium transition-colors ${
                activeIndex === index
                  ? "text-[#b89c4a] border-b-2 border-[#b89c4a] text-2xl"
                  : "text-gray-400 hover:text-gray-200 text-lg"
              }`}
            >
              {story.label}
            </button>
          ))}
        </nav>

        {/* Active Story Content */}
        <article
          key={activeStory.id}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center text-left"
        >
          {/* Video Section */}
          <div className="w-full">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                src={`https://www.youtube.com/embed/${activeStory.youtubeId}`}
                title={activeStory.label}
                loading="lazy"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>

          {/* Quote Section */}
          <div className="space-y-4">
            <p className="text-xl md:text-3xl font-semibold leading-relaxed">
              “{activeStory.quote}”
            </p>
            <p className="text-gray-400 text-sm md:text-base">
              {activeStory.author}, {activeStory.role}
            </p>

          </div>
        </article>
      </div>
    </section>
  );
}
