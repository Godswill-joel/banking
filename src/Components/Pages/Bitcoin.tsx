// components/Hero.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

import { useEffect, useState } from "react";

type Props = {
  href?: string;
};

export default function Hero({ href }: Props) {

 const hero = {
    title: "Buy bitcoin for your\nbusiness today",
    ctaLabel: "Open an account",
    ctaHref: "/signup", 
    image: "/assets/banner2.webp",
    imageAlt: "Decorative gold wave lines",
  };
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      aria-label="Hero"
      className="relative bg-[#0b0b0b] text-white overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none ">
        <Image
          src={hero.image}
          alt={hero.imageAlt ?? ""}
          fill
          priority
          sizes="(min-width: 1024px) 1200px, 100vw"
          className="object-cover object-right-bottom opacity-80 dark:opacity-80"
          aria-hidden={hero.imageAlt === "" ? "true" : "false"}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/10" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 py-20 md:py-28 lg:py-36">
        <div className="flex flex-col items-center text-center">
          <h1
            className={`whitespace-pre-line text-3xl md:text-5xl lg:text-6xl font-semibold leading-tight max-w-3xl ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
            } transition-all duration-600`}
            style={{ transitionDuration: "600ms" }}
          >
            {hero.title}
          </h1>
          <div className="mt-10">
            <Link
              href={href ?? hero.ctaHref}
              className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium
                bg-gradient-to-b from-yellow-400 to-yellow-600 text-black shadow-md
                hover:from-yellow-500 hover:to-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-500/40
                transform transition-all duration-200 active:scale-95`}
              aria-label={hero.ctaLabel}
            >
              {hero.ctaLabel}
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
