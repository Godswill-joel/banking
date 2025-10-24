import Image from "next/image";
import herobg from "../../../../public/assets/hero-bgg.svg";
import table from "../../../../public/assets/bitcoin-interest-table.webp";

export default function Hero() {
  return (
    <section
      className="relative bg-[#0D0D0D] text-white px-6 lg:px-24 py-28 flex flex-col items-center text-center overflow-hidden"
      style={{
        backgroundImage: `url(${herobg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.95,
      }}
    >
      <div className="absolute inset-0 bg-black/50 z-0" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          <span className="text-[#C5A063]">3.75%</span> interest on cash.{" "}
          <span className="text-[#C5A063]">Paid in Bitcoin.</span>
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed">
          ✓ FDIC insured USD <br />
          ✓ No hidden fees or minimums <br />
          ✓ Withdraw your cash at any time
        </p>

        <button className="px-10 py-4 bg-[#C5A063] text-black font-medium rounded-lg hover:bg-[#b6934c] transition">
          Start earning Bitcoin
        </button>

        <div className="relative w-full max-w-4xl mx-auto mt-16">
          <Image
            src={table}
            alt="Bitcoin Interest Table"
            className="rounded-xl shadow-lg"
          />
        </div>

        <p className="text-gray-500 text-sm mt-6 max-w-xl mx-auto">
          Data is historical from August 8th, 2019 to October 7th, 2024.{" "}
          <a href="#" className="underline text-[#C5A063] hover:text-[#b6934c]">
            See how this table is calculated.
          </a>
        </p>
      </div>
    </section>
  );
}
