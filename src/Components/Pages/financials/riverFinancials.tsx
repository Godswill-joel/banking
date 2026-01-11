
"use client";

export default function WalkThroughFinancials() {
  return (
    <section className="w-full bg-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-12">
          Walk through River&apos;s financials
        </h2>

        {/* Video container */}
        <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_80px_rgba(211,172,106,0.12)] bg-gradient-to-br from-[#0b0b0b] to-[#1a1a1a]">
          {/* Aspect ratio wrapper */}
          <div className="relative w-full pt-[56.25%]">
            <iframe
              className="absolute inset-0 h-full w-full rounded-3xl"
              src="https://www.youtube.com/watch?v=_O3eVy9M-8c&feature=youtu.beD"
              title="Public Financials and Proof of Reserves"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
