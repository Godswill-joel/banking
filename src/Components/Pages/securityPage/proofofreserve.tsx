import Image from "next/image";

export default function ProofOfReserves() {
  return (

      <section className="w-full bg-[#0d0d0d] text-white py-28 px-6 md:px-24 flex flex-col items-center gap-20">
      <h1 className="text-3xl md:text-5xl font-semibold text-center">
        Unparalleled transparency with Proof of Reserves
      </h1>
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-16 bg-[#111] rounded-3xl py-16 px-10 md:px-16 border border-[#1d1d1d]">
        <div className="flex-1 max-w-xl space-y-6">
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-white">
            Verify your bitcoin holdings
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
            River publishes monthly Proof of Reserves so you can verify that we
            hold the bitcoin we say we do. We do not lend out your bitcoin.
          </p>
          <button className="bg-[#d3a867] hover:bg-[#ba8e50] transition text-black font-medium px-6 py-3 rounded-xl shadow-md">
            Verify River&apos;s reserves
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center  py-1 px-1 text-center shadow-xl">
          <div >
            <Image
              src="/assets/proof-of-reserves.webp"
              alt="Reserve Badge"
              width={680}
              height={150}
              className="object-contain right-13"
            />
          </div>
        </div>
      </div>
    </section>

  );
}