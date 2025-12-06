"use client";
// import Patner from "../../../../public/assets/partner-hero-.webp";

export default function HeroPartnerSection() {
  return (
    <section className="relative w-full bg-gradient-to-br from-black to-[#111] text-white py-28 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-5xl font-semibold leading-tight mb-6">
            Earn <span className="text-[#D3AC6A]">25%</span><br />
            referee fees as<br />
            a River partner
          </h1>

          <p className="text-gray-300 max-w-md mb-10 leading-relaxed">
            We are on a mission to accelerate the adoption of Bitcoin.
            By partnering with River, you will play a key role in helping us
            achieve our mission.
          </p>

          <button className="bg-[#D3AC6A] text-black px-6 py-3 rounded-xl font-medium hover:bg-[#c39a58] transition">
            Apply now
          </button>
        </div>

      
        <div className="flex justify-center lg:justify-end">

         
            <img src="/assets/partner-hero-.webp" alt="Partner img" className="h-100  w-100 self-center" />
         

        </div>
      </div>
    </section>
  );
}
