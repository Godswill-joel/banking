// components/SecurityCards.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

type Card = {
    id: number;
    title: string;
    subtitle?: string;
    img: string;
    link: string;
};

const cards: Card[] = [
    {
        id: 1,
        title: "Do your due diligence",
        img: "/assets/due-dilligence.webp",
        link: "/articles/due-diligence",
    },
    {
        id: 2,
        title: "River's first-principles approach to protecting your bitcoin",
        img: "/assets/custody-ground-up.webp",
        link: "/reports/bitcoin-custody",
    },
];

export default function SecurityCards() {
    return (
        <section className="w-full bg-[#0d0d0d] text-white py-20 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-10">
                    Ask your Bitcoin exchange the hard security questions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {cards.map((card) => (
                        <Link
                            href={card.link}
                            key={card.id}
                            className="relative rounded-3xl overflow-hidden border border-[#202020] shadow-lg bg-[#141414]"
                        >
                            <div className="relative h-[500px]  md:h-[500px] w-full flex items-center justify-center">
                                <Image
                                    src={card.img}
                                    alt={card.title}
                                    width={480}          
                                    height={150}          
                                    className="object-contain"  
                                    priority={false}
                                />
                                <div className="absolute inset-0 rounded-3xl ring-1 ring-black/20 pointer-events-none" />
                            </div>

                            <div className="px-8 py-10 bg-black/45 backdrop-blur-sm">
                                <p className="text-sm text-[#C5A063] mb-2">{card.subtitle}</p>

                                <h3 className="text-2xl md:text-3xl font-semibold leading-tight text-white mb-4">
                                    {card.title}
                                </h3>

                                <span className="inline-block text-sm text-[#E8CFA1]">
                                    Read more →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
}
