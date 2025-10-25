
"use client";

import Image from "next/image";
import Tax from "@/../public/assets/Taxreporting.webp";
import Service from "@/../public/assets/serviceneeded.webp";
const sections = [
  {
    id: 1,
    title: "Clear performance and tax reporting",
    description: [
      "Understand your performance at a glance",
      "Intuitive tax reporting built to save you time",
      "Customize your cost basis method",
    ],
    image: Tax,
  },
  {
    id: 2,
    title: "Seamless integration for businesses",
    description: [
      "Connect your accounts effortlessly",
      "Get automated data sync and detailed insights",
      "Stay compliant with advanced reporting tools",
    ],
    image: Service, 
  }
];

export default function PerformanceSection() {
  return (
    <section className="w-full bg-[#0E0E0E] text-white py-2 px-16 md:px-28">
      <div className="space-y-25 py-10">
        {sections.map((section, index) => {
          const isReversed = index % 2 !== 0; 
          return (
            <div
              key={section.id}
              className={`grid grid-cols-1 md:grid-cols-2 items-center gap-1 ${
                isReversed ? "md:flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex justify-center ${
                  isReversed ? "md:order-2" : "md:order-1"
                }`}
              >
                <div className="w-full max-w-[520px] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={section.image}
                    alt={section.title}
                    width={700}
                    height={600}
                    className="rounded-2xl object-cover"
                  />
                </div>
              </div>

              <div
                className={`space-y-4 ${
                  isReversed ? "md:order-1" : "md:order-2"
                }`}
              >
                <h2 className="text-3xl md:text-6xl font-bold">
                  {section.title}
                </h2>
                <ul className="text-gray-400 space-y-2 mt-4">
                  {section.description.map((text, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-white text-lg">→</span>
                      <p>{text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
