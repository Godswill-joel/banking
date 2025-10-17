import Image from "next/image";

export default function HeroPage() {
  return (
    <main className="bg-[#0D0D0D] text-white min-h-[90vh] flex flex-col lg:flex-row items-center justify-between px-6 lg:px-24 pt-24">
      {/* Left Section */}
      <div className="max-w-xl text-center lg:text-left space-y-6">
        <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
          Invest in <span className="text-[#C5A063]">Bitcoin</span> with confidence
        </h1>

        <ul className="text-[#9A9A9A] text-lg space-y-1">
          <li>Zero-fee recurring buys</li>
          <li>U.S.-based human support</li>
          <li>Proven full reserve custody</li>
          <li>3.75% Bitcoin interest on cash</li>
        </ul>

        <button className="mt-6 px-8 py-3 text-lg text-black  font-bold bg-[#C1A578]  rounded-lg transition-colors">
          Buy Bitcoin
        </button>
      </div>

      {/* Right Section */}
      <div className="mt-12 lg:mt-0">
        <Image
          src="/assets/hero-asset.webp"
          alt="Bitcoin illustration"
          width={600}
          height={400}
          className="w-full max-w-lg mx-auto drop-shadow-2xl"
          priority
        />
      </div>
    </main>
  );
}
