'use client';

import React from 'react';

const steps = [
  {
    id: 1,
    title: 'Create your account',
    desc: 'Sign up for a business account and submit the required documents.',
  },
  {
    id: 2,
    title: 'Fast track your approval',
    desc: "We'll review your details and confirm when you're all set.",
  },
  {
    id: 3,
    title: 'Start investing',
    desc: 'Gain access to River and start investing in bitcoin.',
  },
];

export default function BusinessSteps() {
  return (
    <section className="bg-[#0E0E0E] text-white py-20">
      <div className="max-w-7xl mx-auto px-6 text-center space-y-10">
        {/* Header */}
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-6xl font-semibold">
            Be bitcoin ready within <span className="text-[#C5A063]">24 hours</span>
          </h2>
          <p className="text-gray-400 text-2xl max-w-4xl mx-auto">
            We support corporations, startups, trusts, non-profits, LLCs, and more.
          </p>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-7 mt-10">
          {steps.map(({ id, title, desc }) => (
            <div
              key={id}
              className="bg-[#181818] rounded-2xl p-8 border hover:border-[#C5A063]/40 transition-all duration-300"
            >
              <p className="text-[#C5A063] text-lg font-medium mb-2">
                Step {id}
              </p>
              <h3 className="text-2xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-400 text-2xl leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Button */}
        <button className="mt-10 px-8 py-3 bg-gradient-to-r from-[#C5A063] to-[#B18C4D] text-black font-semibold rounded-lg hover:opacity-90 transition-all duration-200 hover:-translate-y-0.5">
          Open business account
        </button>
      </div>
    </section>
  );
}
