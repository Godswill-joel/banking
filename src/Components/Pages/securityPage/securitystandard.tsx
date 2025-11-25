import Image from "next/image";

export default function SecurityStandard() {
    const securityItems = [
        {
            id: 1,
            img: "/assets/multisig-cold-storage-.webp",
            title: "Multisig cold storage",
            text: "100% of client bitcoin deposits are stored in multisig cold storage, fully isolated from online systems.",
        },
        {
            id: 2,
            img: "/assets/custody-third-parties-.webp",
            title: "Custody not built on third-parties",
            text: "River operates its own custody infrastructure instead of relying on external custodians.",
        },
        {
            id: 3,
            img: "/assets/fdic-insured-.webp",
            title: "FDIC insured cash up to $250,000",
            text: "US dollars deposited on River are held in an interest-bearing account at Lead Bank, which provides FDIC insurance.",
        },
        {
            id: 4,
            img: "/assets/soc-2.webp",
            title: "SOC II compliance",
            text: "River has strict data controls across its systems and is SOC II compliant.",
        },
    ];
    return (
        <section className="w-full bg-[#0d0d0d] text-white py-24 px-6 md:px-20 flex flex-col items-center gap-16">
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
                River has the highest security standards
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl">
                {securityItems.map((item) => (
                    <div
                        key={item.id}
                        className="relative bg-[#111]  rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition w-full"
                    >
                        <div className="w-full h-72 md:h-98 relative">
                            <Image
                                src={item.img}
                                alt={item.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute bottom-0 left-0 w-full px-8 py-10 bg-black/10 backdrop-blur-sm">
                            <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-white">
                                {item.title}
                            </h2>
                            <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-lg">
                                {item.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

    );
}
