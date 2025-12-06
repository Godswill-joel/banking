"use client";

const expectations = [
    {
        id: 1,
        title: "Custom referral link",
        description:
            "Copy and share a personalized referral link that tracks your referred clients.",
        icon: "/assets/link-gold-fill.svg",
    },
    {
        id: 2,
        title: "Referral tracking",
        description:
            "Reports to conveniently track how much you're earning.",
        icon: "/assets/nav_percent.svg",
    },
    {
        id: 3,
        title: "Dedicated relationship manager",
        description:
            "Collaborate with a dedicated River employee who will assist you.",
        icon: "/assets/handshake.svg",
    },
    {
        id: 4,
        title: "Automatic private client status",
        description:
            "Instantly gain private client status which includes exclusive benefits.",
        icon: "/assets/crown.svg",
    },
    {
        id: 5,
        title: "Exclusive events",
        description:
            "Attend exclusive events designed for our partners with industry leaders.",
        icon: "/assets/gold-calendar.svg",
    },
    {
        id: 6,
        title: "Exclusive River content and merch",
        description:
            "Receive exclusive access to River’s latest content and merchandise.",
        icon: "/assets/gold-sparkle.svg",
    },
];

export default function WhatToExpect() {
    return (
        <section className="w-full bg-[#0F0F0F] text-white py-20 px-6">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-6xl font-bold mb-16">What to expect?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
                    {expectations.map((item) => (
                        <div key={item.id} className="flex flex-col items-center text-center">
                            {/* Icon */}
                            <img src={item.icon} alt="" className="h-9 w-9 mb-5 opacity-80" />

                            {/* Title */}
                            <h3 className="text-lg font-semibold mb-3">{item.title}</h3>

                            {/* Description */}
                            <p className="text-gray-400 max-w-xs">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <main className="w-full bg-[#0D0D0D] text-white py-24 px-4 flex flex-col items-center justify-center text-center">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
                        Partner with the most
                        <br />
                        trusted Bitcoin-only
                        <br />
                        exchange today
                    </h1>

                    <button
                        className="mt-10 bg-[#C6A667] hover:bg-[#b89755] text-black font-medium px-6 py-3 rounded-md transition-all"
                    >
                        Apply now
                    </button>
                </div>
            </main>
        </section>

    );
}
