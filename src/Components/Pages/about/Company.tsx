"use client";

import Image from "next/image";
import { useState } from "react";
import { executiveTeam } from "@/data/data";

export default function AboutHero() {
  const [openMember, setOpenMember] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenMember((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-[#0f0f0f] text-white py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto mt-40 text-center">
        {/* HERO */}
        <h1 className="text-4xl md:text-8xl font-bold mb-6">About River</h1>
        <p className="text-gray-300 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed">
          River is a client-first Bitcoin-only financial institution that is
          committed to empowering the long-term investor. We focus on providing
          industry-leading security, robust financial services, and a
          world-class client experience to individuals and businesses looking to
          invest in Bitcoin for the long term.
        </p>

        {/* EXECUTIVE TEAM */}
        <div className="mt-24">
          <h2 className="text-3xl md:text-4xl font-semibold mb-12">
            Our Executive Team
          </h2>

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {executiveTeam.map((member) => {
              const isOpen = openMember === member.id;

              return (
                <div key={member.id} className="flex flex-col items-center text-center">
                  {/* Card */}
                  <div className="bg-[#1a1a1a] rounded-2xl shadow-md p-6 flex flex-col items-center text-center w-full transition-transform hover:scale-[1.02]">
                    {/* IMAGE */}
                    <div className="w-32 h-32 mb-4 overflow-hidden rounded-lg">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* NAME & ROLE */}
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-gray-400 mb-2">{member.role}</p>

                    {/* LinkedIn */}
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#b89c4a] hover:text-[#d1b05e] mb-4"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="currentColor"
                        className="mr-1"
                        viewBox="0 0 16 16"
                      >
                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.473 0 16 .513 16 1.146v13.708c0 .633-.527 1.146-1.175 1.146H1.175C.527 16 0 15.487 0 14.854V1.146zM4.943 13.542V6.169H2.542v7.373h2.401zM3.743 5.155c.837 0 1.357-.554 1.357-1.247-.015-.708-.52-1.247-1.341-1.247-.821 0-1.356.54-1.356 1.247 0 .693.52 1.247 1.326 1.247h.014zm4.305 8.387h2.401V9.359c0-.224.016-.447.082-.607.18-.447.591-.911 1.281-.911.904 0 1.265.687 1.265 1.693v3.999h2.401V9.214c0-2.325-1.24-3.406-2.895-3.406-1.338 0-1.935.744-2.268 1.267h.016V6.169H8.048v7.373z" />
                      </svg>
                      <span aria-hidden="true">LinkedIn</span>
                    </a>

                    {/* READ MORE / CLOSE */}
                    <button
                      onClick={() => handleToggle(member.id)}
                      className="text-[#b89c4a] hover:text-[#d1b05e] font-medium mt-auto"
                    >
                      {isOpen ? "CLOSE ✕" : "READ MORE"}
                    </button>
                  </div>

                  {/* ABOUT SECTION (Expands Under Card) */}
                  <div
                    className={`w-full text-left bg-transparent border-t border-gray-700 pt-6 transition-all duration-500 ease-in-out overflow-hidden ${isOpen
                        ? "max-h-[500px] opacity-100 mt-4"
                        : "max-h-0 opacity-0 mt-0"
                      }`}
                  >
                    <p className="text-gray-300 text-lg leading-relaxed px-2 md:px-6">
                      {member.about}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="text-center mt-20">
          <div >
            <h2 className="font-bold text-7xl">Built to last</h2>
          </div>
            <div className="max-w-290 text-center px-6 h-[250px]">
              <p className="text-gray-400 text-2xl py-10 leading-relaxed space-4">
              The trust of our clients is our greatest asset. We recognize that consumers deserve industry-leading technology, client service, education, and security.
              Every facet of our business is engineered to protect our clients' investments for the long-term and stand the test of time. As the economy is transformed by Bitcoin, River's products and services will be at the forefront of that evolution.
              </p>
            </div>
        </div>
      </div>
    </section>
  );
}
