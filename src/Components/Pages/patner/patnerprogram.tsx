"use client";

import Image from "next/image";

export default function PartnerProgramSection() {
    return (
        <section className="relative w-full bg-gradient-to-br from-black to-[#111] text-white py-20 px-6">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-40"
                style={{ backgroundImage: "url('assets/glow-effect-4.svg')" }}
            ></div>
            <h2 className="text-6xl md:text-7xl font-bold text-center mb-16">
                What is the River partner program?
            </h2>
            <div className="max-w-7xl mx-auto bg-[#0F0F0F] border border-[#1f1f1f] rounded-3xl p-10 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-14">

                <div>
                    <div className="w-12 h-12 bg-[#2b2b2b] flex items-center justify-center rounded-lg mb-6">
                        <Image src="/assets/nav_people.svg" alt="group icon" />
                    </div>

                    <h3 className="text-3xl font-semibold mb-4">Who is it for?</h3>

                    <p className="text-gray-300 mb-8 max-w-md">
                        For those who can refer 50+ clients or generate $5M+ in bitcoin buys
                    </p>

                    <ul className="space-y-6 text-gray-300">
                        <li>
                            <span className="text-[#D3AC6A] mr-2">✔</span>
                            <span className="font-semibold text-white">
                                Educators and content creators
                            </span>
                            <br />
                            <span className="text-gray-400">
                                Who grow Bitcoin adoption through their platform.
                            </span>
                        </li>

                        <li>
                            <span className="text-[#D3AC6A] mr-2">✔</span>
                            <span className="font-semibold text-white">
                                Leaders, advisors, and organizations
                            </span>
                            <br />
                            <span className="text-gray-400">
                                With strong networks interested in Bitcoin.
                            </span>
                        </li>

                        <li>
                            <span className="text-[#D3AC6A] mr-2">✔</span>
                            <span className="font-semibold text-white">River advocates</span>
                            <br />
                            <span className="text-gray-400">
                                Who want to grow Bitcoin together.
                            </span>
                        </li>
                    </ul>
                </div>


                <div className="flex justify-center lg:justify-end items-center">
                    <div className="w-[350px] h-[350px] md:w-[420px] md:h-[420px] rounded-full bg-[#151515] border border-[#222] flex items-center justify-center">
                        <Image
                            src="/assets/Who-is-it-For.svg"
                            alt="Partner program illustration"
                            className="w-120 h-120 object-contain opacity-90"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
