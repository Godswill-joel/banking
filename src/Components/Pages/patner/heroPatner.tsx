"use client";

export default function HeroPartnerSection() {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-black to-[#111] text-white px-5 pt-28 sm:pt-32 lg:pt-60 pb-16 overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none"
        style={{ backgroundImage: "url('/assets/glow-effect-4.svg')" }}
      ></div>

      <div className="relative max-w-7xl mx-auto flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

          {/* LEFT CONTENT */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-6">
              Earn <span className="text-[#D3AC6A]">25%</span><br />
              referee fees as<br />
              a River partner
            </h1>

            <p className="text-gray-300 text-lg sm:text-xl max-w-md mx-auto lg:mx-0 mb-10 leading-relaxed">
              We are on a mission to accelerate the adoption of Bitcoin.
              By partnering with River, you will play a key role in helping us
              achieve our mission.
            </p>

            <button className="bg-[#D3AC6A] text-black px-8 py-3 rounded-xl font-medium hover:bg-[#c39a58] transition">
              Apply now
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center lg:justify-end">
            <img
              src="/assets/partner-hero-.webp"
              alt="Partner img"
              className="w-[260px] sm:w-[320px] md:w-[420px] lg:w-[600px] xl:w-[650px] object-contain mx-auto lg:mx-0"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
