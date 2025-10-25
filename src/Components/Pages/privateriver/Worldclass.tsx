"use client";
import { ShieldCheck, LinkIcon, KeyRound, Lock } from "lucide-react";

const securityFeatures = [
  {
    id: 1,
    icon: <ShieldCheck className="w-8 h-8 text-[#C5A063] mb-4" />,
    title: "Proven full reserve custody",
    description:
      "All client Bitcoin at River is held in full reserve. No lending, no exceptions. Verify it yourself using our Proof of Reserves.",
    link: "Verify reserves →",
  },
  {
    id: 2,
    icon: <LinkIcon className="w-8 h-8 text-[#C5A063] mb-4" />,
    title: "Not built on third-parties",
    description:
      "River’s custody systems were built from the ground up to maximize security and minimize dependence on third parties.",
  },
  {
    id: 3,
    icon: <KeyRound className="w-8 h-8 text-[#C5A063] mb-4" />,
    title: "Multisig cold storage",
    description:
      "Our clients’ Bitcoin is kept offline and requires multiple signatures to authorize a transaction.",
  },
  {
    id: 4,
    icon: <Lock className="w-8 h-8 text-[#C5A063] mb-4" />,
    title: "SOC certified",
    description:
      "River has achieved SOC 1 and 2 certifications for our thorough cybersecurity and information security management systems.",
  },
];

export default function WorldClassSecurity() {
  return (
    <section className="bg-[#111111] text-white py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-7xl font-semibold mb-9">
          World-class security
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-15 max-w-8xl mx-auto">
        {securityFeatures.map((feature) => (
          <div
            key={feature.id}
            className="flex flex-col items-center text-center space-y-3"
          >
            {feature.icon}
            <h3 className="text-3xl font-semibold">{feature.title}</h3>
            <p className="text-gray-400 text-2xl leading-relaxed max-w-l">
              {feature.description}
            </p>
            {feature.link && (
              <a
                href="#"
                className="text-[#C5A063] text-lg font-medium hover:text-yellow-400 transition"
              >
                {feature.link}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
