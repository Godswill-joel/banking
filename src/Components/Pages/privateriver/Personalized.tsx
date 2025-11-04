import Image from 'next/image';

// Import images for each service
import service1 from '@/../public/assets/Rivercall.webp';
import service2 from '@/../public/assets/interest.webp';
import service3 from '@/../public/assets/beneficiaries.webp';
import { Button } from '@headlessui/react';

export default function Personalized() {
    const services = [
        {
            id: 1,
            title: 'Priority Service',
            description: "Experience personalized support from our team of Bitcoin experts.",
            image: service1,
            items: [
                "Dedicated Relationship Manager",
                "Exclusive events",
                "U.S. based phone support"
            ]
        },
        {
            id: 2,
            title: 'Premium Access',
            description: "Enjoy exclusive insights and tailored Bitcoin investment opportunities.",
            image: service2,
            items: [
                "Early access to updates",
                "1-on-1 strategy sessions",
                "Custom portfolio reviews"
            ]
        },
        {
            id: 3,
            title: 'Elite Membership',
            description: "Gain unparalleled access to Bitcoin industry leaders and private events.",
            image: service3,
            items: [
                "Private community access",
                "Global Bitcoin events",
                "Priority transaction support"
            ]
        }
    ];

    return (
        <section className="relative bg-[#0D0D0D] text-white overflow-hidden">
            <div className="max-w-4xl text-7xl font-semibold mt-29 text-center mx-auto">
                <h1>Personalized Offerings to Meet Your Needs</h1>
            </div>

            {services.map((serviceItem) => (
                <div
                    key={serviceItem.id}
                    className="w-8xl mx-auto bg-[#131313] rounded-3xl mt-16 p-10 lg:p-20"
                >
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-9 lg:gap-16">
                        
                        {/* Right Side - Dynamic Image */}
                        <div className="lg:w-1/2 w-full">
                            <div className="relative m-5 rounded-2xl overflow-hidden ">
                                <Image
                                    src={serviceItem.image}
                                    alt={serviceItem.title}
                                    width={600}
                                    height={500}
                                    className="h-auto "
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] from-10% via-transparent to-transparent" />
                            </div>
                        </div>

                        {/* Left Side - Text Content */}
                        <div className="lg:w-1/2 w-full space-y-8">
                            <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                                {serviceItem.title}
                            </h2>

                            <p className="text-xl lg:text-2xl text-gray-400 leading-relaxed">
                                {serviceItem.description}
                            </p>

                            {/* Bullet List */}
                            <div className="space-y-4">
                                {serviceItem.items.map((text, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full  border border-[#C5A063] bg-[#131313] flex items-center justify-center">
                                            <svg
                                                className="w-3 h-3 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-lg lg:text-xl text-white">
                                            {text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <div className="pt-4">
                                <Button className="bg-[#C5A063] hover:bg-gray-800 text-black font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform">
                                    Talk to our team
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}
