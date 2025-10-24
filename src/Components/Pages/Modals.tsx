"use client";
import Image from "next/image";
import modal1 from "../../../public/assets/bitcoin-interest-modal.png";

export function InterestModal() {
    return (
        <section className="relative bg-[#0D0D0D] text-white py-20 px-6 flex items-center justify-center">
            <div className="relative w-full max-w-4xl h-80 sm:h-96 md:h-[28rem] rounded-2xl overflow-hidden">
                <Image
                    src={modal1}
                    alt="Bitcoin Interest Modal"
                    fill
                    className="object-cover rounded-2xl"
                    priority
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-10">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug">
                        How does my cash earn{" "}
                        <span className="text-[#C5A063]">interest</span>?
                    </h2>
                    <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed mt-4 max-w-2xl">
                        Cash is held in an account with{" "}
                        <span className="text-white font-medium">Lead Bank</span>, where it
                        earns interest and is FDIC insured up to{" "}
                        <span className="text-[#C5A063]">$250,000</span>.
                    </p>
                </div>
            </div>
        </section>
    );
}
