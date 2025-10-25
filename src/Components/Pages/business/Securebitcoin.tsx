"use client"

import Image from 'next/image';
import Earn from "@/../public/assets/Earnbitcoin.webp";
import Buy from "@/../public/assets/zerobuys.webp";
import transact from "@/../public/assets/transactbitcoin.webp";
import { Button } from '@headlessui/react';



export default function BusinessFuturePage() {
  const features = [
    {
      id: 1,
      image: transact,
      title: 'Buy, sell, and transact in bitcoin',
      description:
        'All the tools you need to manage your bitcoin portfolio, in one easy-to-use platform.',
    },
    {
      id: 2,
      image: Earn,
      title: 'Zero-fee recurring bitcoin buys',
      description:
        'Automatically buy bitcoin every hour, day, week, or month, with zero fees after 7 days.',
    },
    {
      id: 3,
      image: Buy,
      title: 'Earn 3.75% on cash, paid in bitcoin',
      description:
        'Keep up with inflation by earning Bitcoin interest on Cash. Your cash is FDIC insured up to $250,000.',
    },
  ]

  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white py-26 px-16 md:px-15 lg:px-29">
      <section className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-10">
          Secure your business's future today
        </h1>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-10">
          {features.map((f) => (
            <article
              key={f.id}
              className="bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.03)]"
            >
              <div className="rounded-xl overflow-hidden bg-[#111] mb-6">
                <div className="relative w-full h-48 md:h-44 lg:h-60 flex items-center justify-center">
                  <Image
                    src={f.image}
                    alt={f.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
              </div>

              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-center">{f.title}</h3>
              <p className="text-sm md:text-base text-gray-300 text-center">{f.description}</p>
            </article>
          ))}
        </div>
        <div className="flex justify-center">
          <Button
            className="mt-4 inline-block rounded-full px-6 py-3 md:px-8 md:py-4 bg-gradient-to-b from-[#d2a765] to-[#c39047] text-black font-medium shadow-lg hover:brightness-95 transition"
            aria-label="Open business account"
          >
            Open business account
          </Button>
        </div>
      </section>
    </main>
  )
}
