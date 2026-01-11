"use client";
import Link from "next/link";
import { EnvelopeIcon, BookOpenIcon } from "@heroicons/react/24/outline";

export default function SupportSection() {
  return (
    <section className="w-full bg-black text-white py-20 px-6">
      <div className="py-10 px-10 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="text-2xl">
          <h1 className="text-4xl font-semibold mb-6">Support</h1>

          <p className="text-gray-300 leading-relaxed mb-10 max-w-lg">
            We&apos;re here to help. Our help center contains answers to the most
            frequently asked questions. Alternatively, you can always reach us
            during the hours listed below:
          </p>
          <div className="mb-10  ">
            <h2 className="text-lg font-semibold mb-3">Business hours</h2>

            <p className="text-gray-300">Monday - Thursday</p>
            <p className="text-gray-400 mb-4">6:00 AM - 4:00 PM PST</p>

            <p className="text-gray-300">Friday</p>
            <p className="text-gray-400">6:00 AM - 2:00 PM PST</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Mailing address</h2>

            <p className="text-gray-300">2261 Market Street</p>
            <p className="text-gray-300">Ste 22113</p>
            <p className="text-gray-300">San Francisco, CA 94114</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* HELP CENTER CARD */}
          <div className="bg-[#1A1A1A] rounded-2xl p-10 text-center shadow-lg">
            <BookOpenIcon className="w-12 h-12 mx-auto text-gray-300 mb-5" />

            <h3 className="text-xl font-semibold mb-4">Help Center</h3>

            <Link
              href="/help-center"
              className="inline-block bg-gray-800 text-gray-200 px-5 py-2 rounded-xl hover:bg-gray-700 transition mb-6"
            >
              Explore Help Center
            </Link>

            <p className="text-gray-400 text-xl">
              Our help center contains answers to the most frequently asked
              questions.
            </p>
          </div>

          {/* EMAIL CARD */}
          <div className="bg-[#1A1A1A] rounded-2xl p-10 text-center shadow-lg">
            <EnvelopeIcon className="w-12 h-12 mx-auto text-gray-300 mb-5" />

            <h3 className="text-xl font-semibold mb-3">Email</h3>

            <a
              href="mailto:support@river.com"
              className="text-[#C5A063] underline underline-offset-2 mb-5 block"
            >
              support@river.com
            </a>

            <p className="text-gray-400 text-xl">
              You can email us for assistance and we will follow up within
              24 hours.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
