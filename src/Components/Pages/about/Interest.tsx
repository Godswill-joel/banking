'use client';

import Image from 'next/image';

export default function InterestPage() {
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
        <section className="bg-[#0f0f0f] text-white  w-full overflow-hidden">
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-[#0f0f0f]">
                <h2 className="text-3xl md:text-7xl font-semibold mb-10">
                    Interest
                </h2>

                {/* Logos Grid */}
                <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 max-w-8xl">
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
    )
};
