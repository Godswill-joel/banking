"use client";

import { motion } from "framer-motion";


export default function HeroSection() {
  return (
    <section className="relative h-[720] w-full overflow-hidden text-white">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/video/securityhero.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-transparent to-transparent" />
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4 mt-40">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl mt-10 md:text-6xl font-bold mb-4"
        >
          Next-level security for your peace of mind
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-gray-300 text-3xl md:text-3xl max-w-4xl mb-12"
        >
          You worked hard for your bitcoin. Here’s how River keeps it safe.
        </motion.p>
      </div>
    </section>
  );
}
