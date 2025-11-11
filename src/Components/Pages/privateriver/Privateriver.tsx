"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import privateclienthero from "@/../public/assets/privateclienthero.webp";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "@headlessui/react";

export default function PrivateClientHero() {
  return (
    <section className="relative bg-[#0D0D0D] text-white overflow-hidden">
      <div className="max-w-8xl mx-auto min-h-screen px-6 sm:px-10 lg:px-20 py-20 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20">
        {/* LEFT SIDE — Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-6 mt-10 lg:mt-0 text-center lg:text-left"
        >
          <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight">
            <span className="text-[#C5A063]">Personalized service</span>
            <br />
            for large Bitcoin investments
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed max-w-md mx-auto lg:mx-0">
            Tailored to investment amounts of $100k or more. Onboard you or your
            entity and start investing in Bitcoin today.
          </p>

          <Button className="bg-[#C5A063] hover:bg-[#b08a53] text-black font-medium py-3 px-6 rounded-lg transition text-lg">
            Talk to the team
          </Button>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-6 text-gray-300 text-lg sm:text-xl md:text-2xl">
            {[
              "Family offices",
              "Trusts",
              "Personal investment vehicles",
              "HNWIs",
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index, duration: 0.8 }}
                viewport={{ once: true }}
                className="flex items-center justify-center lg:justify-start gap-2"
              >
                <CheckCircleIcon className="w-5 h-5 text-[#C5A063]" />
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true, amount: 0.4 }}
          className="relative mt-16 lg:mt-0 flex justify-center"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-lg rounded-br-[20px] w-full max-w-xl">
            <Image
              src={privateclienthero}
              alt="Private Client Team"
              className="object-cover w-full h-auto"
              priority
            />
            {/* Keep all your gradient overlays intact */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] from-19% via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0a] from-15% via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/50 via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
