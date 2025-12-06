"use client";

import Image from "next/image";

const steps = [
  {
    id: 1,
    title: "Partner with River",
    description: "Apply and set up your partner agreement.",
    icon: "/assets/handshake.svg", 
  },
  {
    id: 2,
    title: "Promote River",
    description: "Share your custom partner link with your community.",
    icon: "/assets/megaphone.svg",
  },
  {
    id: 3,
    title: "Earn 25% of fees",
    description:
      "Receive 25% of fees for one year for anyone you refer through your link, paid out quarterly.",
    icon: "/assets/money-.svg",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full bg-[#0F0F0F] text-white py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-6xl font-bold mb-16">How it works?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center">
              <img
                src={step.icon}
                alt={step.title}
                className="h-10 w-10 mb-4"
              />
              <h3 className="text-2xl font-semibold mb-3">
                {step.id}. {step.title}
              </h3>
              <p className="text-gray-400 text-xl max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-20 flex justify-center">
          <div className="w-full max-w-5xl h-72 bg-[#1A1A1A] rounded-2xl flex items-center justify-center border border-[#2A2A2A]">
           <Image
                src="/assets/How-it-works.svg"
                alt="How it works"
                width={600}
                height={200}
                className="object-contain"
              />
          </div>
        </div>
      </div>
    </section>
  );
}
