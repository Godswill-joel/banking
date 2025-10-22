"use client";

import Image from "next/image";
import privateclienthero from "@/../public/assets/privateclienthero.webp";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function PrivateClientHero() {
    return (
        <section className="relative bg-[#0D0D0D]  text-white overflow-hidden">
            <div className="max-w-screen mx-auto lg:px-15 py-34 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">

                <div className="space-y-4 mt-25">
                    <h1 className="text-8xl md:text-6xl font-semibold leading-tight">
                        <span className="text-[#C5A063]"> Personalized service <br />
                        </span>
                        for{" "}

                        large Bitcoin investments

                    </h1>

                    <p className="text-2xl text-gray-300 leading-relaxed max-w-md">
                        Tailored to investment amounts of $100k or more. Onboard you or your
                        entity and start investing in Bitcoin today.
                    </p>

                    <button className="bg-[#C5A063] hover:bg-[#b08a53] text-black font-medium py-3 px-6 rounded-lg transition">
                        Talk to the team
                    </button>

                    <div className="grid grid-cols-2 gap-4 pt-6 text-gray-300 text-2xl">
                        <div className="flex items-center gap-2">
                            <CheckCircleIcon className="w-4 h-4 text-[#C5A063]" />
                            Family offices
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircleIcon className="w-4 h-4 text-[#C5A063]" />
                            Trusts
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircleIcon className="w-4 h-4 text-[#C5A063]" />
                            Personal investment vehicles
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircleIcon className="w-4 h-4 text-[#C5A063]" />
                            HNWIs
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE — Image Section */}
                <div className="relative">
                    <div className="relative rounded-2xl overflow-hidden shadow-lg rounded-br-[20px] w-180 mx-auto">
                        <Image
                            src={privateclienthero}
                            alt="Private Client Team"
                            className="object-cover w-full h-full"
                            priority
                        />
                        {/* Soft fade to match River’s dark overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] from-19% via-transparent to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0a] from-15% via-transparent to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/50 via-transparent to-transparent" />
                    </div>
                </div>
            </div>
        </section>
    );
}
