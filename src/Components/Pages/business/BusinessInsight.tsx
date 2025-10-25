"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

const INSIGHTS = [
  {
    id: 1,
    title: "Discover why business bitcoin adoption grew by 30% in 2024",
    image: "/assets/earth-40.webp",
    link: "#",
  },
  {
    id: 2,
    title: "Learn how to invest in bitcoin with your business",
    image: "/assets/house-.webp",
    link: "#",
  },
];

export default function BusinessInsights() {
  return (
    <section className="bg-[#0E0E0E] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto text-center space-y-12">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
          Take your business to the next <br className="hidden sm:block" /> level with bitcoin
        </h2>

        {/* Card Grid */}
        <div className="grid sm:grid-cols-2 gap-8">
          {INSIGHTS.map(({ id, title, image, link }) => (
            <div
              key={id}
              className="group bg-[#1A1918] rounded-2xl overflow-hidden border border-[#2E2B28]/60 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-500"
            >
              {/* Image */}
              <div className="relative w-full h-60 sm:h-74 overflow-hidden p-3">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141210]/70 to-transparent rounded-xl z-0" />
                </div>
              </div>

              {/* Text Content */}
              <div className="p-6 sm:p-8 flex flex-col justify-between h-full">
                <h3 className="text-lg sm:text-4xl font-semibold leading-snug text-left mb-6">
                  {title}
                </h3>

                {/* Button */}
                <div className="">
                  <button
                    onClick={() => window.open(link, "_blank")}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C5A063] to-[#B18C4D] text-black font-semibold py-2.5 px-5 rounded-full text-sm transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#C5A063]/60 focus:ring-offset-2 focus:ring-offset-[#1A1918]"
                    aria-label={`Read more about: ${title}`}
                  >
                    Read now
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
