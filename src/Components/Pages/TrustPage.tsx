'use client';

import Image from 'next/image';

export default function ContactTrustPage() {
  const logos = [
    '/Logo/Foundation.webp',
    '/Logo/Lightning.webp',
    '/Logo/KC.webp',
    '/Logo/mudsocial.webp',
    '/Logo/HRFlogo.webp',
    '/Logo/Doctorisland.webp',
    '/Logo/collier.webp',

  ];

  return (
    <section className="bg-[#1D1D1D] text-white  w-full overflow-hidden">  
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-[#0D0D0D]">
        <h2 className="text-3xl md:text-5xl font-semibold mb-10">
          Trusted by over 3,000 visionary <br className="hidden md:block" />
          American businesses
        </h2>

        {/* Logos Grid */}
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 max-w-5xl">
          {logos.map((logo, index) => (
            <div key={index} className="grayscale opacity-80 hover:opacity-100 transition-opacity duration-300">
              <Image
                src={logo}
                alt={`Logo ${index + 1}`}
                width={160}
                height={80}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
)};
