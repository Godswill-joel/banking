"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";
import Background from "@/../public/assets/hero-bg.webp";
import heroImaage from "@/../public/assets/businesshero.webp";

const features = [
  "Free onboarding within 24 hours",
  "Dedicated Relationship Manager",
  "Licensed and regulated",
];

export default function BusinessHero() {
  return (
    <section className="relative min-h-full mt-10 overflow-hidden bg-[#0e0e0e] text-white">
      <div className="absolute inset-0 ">
        <Image
          src={Background}
          alt="background image"
          fill
          className="object-cover object-center opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/10 to-black/20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-2 lg:py-32 grid grid-cols-1 md:grid-cols-2 gap-15 items-center">
        {/* LEFT SIDE */}
        <div className="space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            Buying <span className="text-[#d1ab5a]">bitcoin</span> could be one
            of your best business decisions
          </h1>

          <ul className="space-y-4">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center text-gray-300 text-lg">
                <CheckCircle className="text-white  w-5 h-5 mr-3" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4 pt-4">
            <button className="bg-gradient-to-r from-[#d1ab5a] to-[#b88c3d] text-black font-semibold px-6 py-3 rounded-full shadow-md hover:opacity-90 transition">
              Open an account
            </button>
            <button className="bg-[#1c1c1c]/80 border border-[#2e2e2e] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#2a2a2a] transition">
              Talk to the team
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative flex justify-center md:justify-end">
          <div className="relative w-[840px] h-[620px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={heroImaage}
              alt="Businessman analyzing bitcoin returns"
              fill
              className="object-cover w-full"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
