"use client";
import Image from "next/image";
import img from "../../../public/assets/wallet-hero.webp";

export default function WalletHero() {
  return (
    <section className="bg-[#0D0D0D] text-white py-20 px-6 lg:px-24 flex flex-col lg:flex-row items-center justify-between gap-12">
      <div className="flex-1 space-y-6 text-center lg:text-left">
        <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
          Use and store your Bitcoin <span className="text-[#C5A063]">like never before</span>
        </h1>

        <ul className="list-disc list-inside text-gray-400 text-lg space-y-2">
          <li>Instant transfers powered by the Lightning Network</li>
          <li>Industry-leading security through multisig and cold storage</li>
          <li>Create a legacy plan with beneficiaries</li>
          <li>Tax optimization through tax-lot tracking</li>
        </ul>

        <button className="mt-6 px-8 py-3 bg-[#C5A063] text-black font-medium text-lg rounded-lg hover:bg-[#b6934c] transition">
          Install the app
        </button>
      </div>

      <div className="flex-1 flex justify-center">
        <Image
          src={img}
          alt="Bitcoin Wallet App"
          className="w-64 md:w-80 lg:w-[420px] h-auto object-contain drop-shadow-2xl"
          priority
        />
      </div>
    </section>
  );
}
