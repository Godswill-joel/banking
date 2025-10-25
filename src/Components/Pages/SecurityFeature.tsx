"use client";

import { Button } from "@headlessui/react";
import {
  ShieldCheck,
  Lock,
  Box,
  FileText,
  Brain,
  Banknote,
} from "lucide-react";

const FEATURES = [
  { id: "multisig", icon: Lock, title: "Multisig cold storage" },
  { id: "soc2", icon: ShieldCheck, title: "SOC 2 compliant" },
  { id: "custody", icon: Box, title: "Custody not built on third-parties" },
  { id: "security", icon: Brain, title: "Intelligent account security" },
  { id: "public", icon: FileText, title: "Public financials and Proof of Reserves" },
  { id: "fdic", icon: Banknote, title: "FDIC insured cash up to $250,000" },
];

export default function SecurityFeature() {
  return (
    <section className="bg-[#141210] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto text-center space-y-10">
        {/* Heading */}
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-semibold leading-tight">
            Next-level security for your<br className="hidden sm:block" /> peace of mind
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6 justify-items-start sm:justify-items-center text-left max-w-5xl mx-auto">
          {FEATURES.map(({ id, icon: Icon, title }) => (
            <div
              key={id}
              className="flex items-center gap-4 group transition-all duration-300"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#2E2A26] to-[#1B1A18] shadow-inner group-hover:scale-105 transition-transform">
                <Icon className="text-[#C5A063] w-7 h-6" aria-hidden="true" />
              </div>
              <p className="text-gray-300 text-2xl leading-relaxed group-hover:text-gray-100 transition-colors">
                {title}
              </p>
            </div>
          ))}
        </div>
        <div>
          <Button
            type="button"
            className="mt-10 bg-gradient-to-r from-[#C5A063] to-[#B18C4D] text-black font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#C5A063] focus:ring-offset-2 focus:ring-offset-[#141210]"
            aria-label="Learn more about River's security"
          >
            Learn more
          </Button>
        </div>
      </div>
    </section>
  );
}
