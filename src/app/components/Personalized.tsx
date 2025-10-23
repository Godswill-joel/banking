import Image from 'next/image';
import service from '@/../public/assets/Rivercall.webp';

export default function Personalized() {
    const services = [
        {
            id: 1,
            title: 'Priority Service',
            description: "Experience personalized support from our team of Bitcoin experts.",
            items: [
                "Dedicated Relationship Manager",
                "Exclusive events",
                "U.S. based phone support"
            ],
            Image: service
        },
        {
            id: 2,
            title: 'Sophisticated investing',
            description: "Strengthen your portfolio. Outperform the rest.",
            items: [
                "High transaction limits",
                "Tax optimization",
                "Performance tracking"
            ]
        },
        {
            id: 3,
            title: 'Earn 3.75% interest on cash. Paid in Bitcoin.',
            description: "Put your cash to work and earn Bitcoin. Cash is FDIC insured, no hidden fees or minimums and withdraw your cash at any time.",
            items: [
               
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
                        {/* Right Side - Image */}
                        <div className="lg:w-1/2 w-full">
                            <div className="relative m-5 rounded-2xl overflow-hidden shadow-xl">
                                <Image
                                    src={service}
                                    alt={serviceItem.title}
                                    width={600}
                                    height={500}
                                    className="h-auto object-cover"
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
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full border-[#C5A063] bg-[#131313] flex items-center justify-center">
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

                            {/* Button */}
                            <div className="pt-4">
                                <button className="bg-[#C5A063] hover:bg-gray-800 text-black font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform">
                                    Talk to our team
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}


// import Image from 'next/image';
// import service from '@/../public/assets/Rivercall.webp';
// import { title } from 'process';


// export default function Personalized() {
//     const services = [
//         {
//             id: 1,
//             title: 'Dedicated Relationship Manager',
//             checked: true,
//             description: " Experience personalized support from our team of Bitcoin experts.",
//             item1: "Dedicated Relationship Manager",
//             item2: "Exclusive events",
//             item3: "U.S. based phone support",
//         },
//         {
//             id: 2,
//             title: 'Dedicated Relationship Manager',
//             checked: true,
//             description: " Experience personalized support from our team of Bitcoin experts.",
//             item1: "Dedicated Relationship Manager",
//             item2: "Exclusive events",
//             item3: "U.S. based phone support",
//         },
//         {
//             id: 3,
//             title: 'Dedicated Relationship Manager',
//             checked: true,
//             description: " Experience personalized support from our team of Bitcoin experts.",
//             item1: "Dedicated Relationship Manager",
//             item2: "Exclusive events",
//             item3: "U.S. based phone support",
//         }
//     ]
//     const serviceItems = [
//         { id: 1, text: 'Dedicated Relationship Manager', checked: true },
//         { id: 2, text: 'Exclusive events', checked: true },
//         { id: 3, text: 'U.S. based phone support', checked: true },
//     ];
//     return (
//         <section className="relative bg-[#0D0D0D] text-white overflow-hidden">
//             <div>
//                 <div className="max-w-4xl text-7xl font-semibold mt-29 text-center mx-auto">
//                     <h1>Personalized Offerings to meet your needs </h1>
//                 </div>

//                 <div className="w-8xl mx-auto  bg-[#131313] rounded-3xl  mt-16  p-10 lg:p-20">
//                     <div className="flex flex-col lg:flex-row items-center gap-9 lg:gap-16">


//                         <div className="lg:w-1/2 w-100">
//                             <div className="relative m-5 rounded-2xl overflow-hidden shadow-xl">
//                                 <Image
//                                     src={service}
//                                     alt="Priority Service"
//                                     width={600}
//                                     height={500}
//                                     className=" h-auto object-cover"
//                                     priority
//                                 />
//                                 {/* Enhanced shadow overlay */}
//                                 <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] from-10% via-transparent to-transparent" />
//                             </div>
//                         </div>

//                         {/* Content Sections - Right */}
//                         <div className="lg:w-1/2 w-full space-y-8">

//                             {/* Section 1: Title */}
//                             <div>
//                                 <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
//                                     Priority service
//                                 </h1>
//                             </div>

//                             {/* Section 2: Description */}
//                             <div>
//                                 <p className="text-xl lg:text-2xl text-gray-400 leading-relaxed">
//                                     Experience personalized support from our team of Bitcoin experts.
//                                 </p>
//                             </div>

//                             {/* Section 3: Service Items List */}
//                             <div className="space-y-4">
//                                 {serviceItems.map((item) => (
//                                     <div key={item.id} className="flex items-center gap-4">
//                                         <div className="flex-shrink-0 w-6 h-6 rounded-full  border-[#C5A063] bg-[#131313] flex items-center justify-center">
//                                             <svg
//                                                 className="w-3 h-3 text-white"
//                                                 fill="none"
//                                                 stroke="currentColor"
//                                                 viewBox="0 0 24 24"
//                                             >
//                                                 <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     strokeWidth={3}
//                                                     d="M5 13l4 4L19 7"
//                                                 />
//                                             </svg>
//                                         </div>
//                                         <span className="text-lg lg:text-xl text-white">
//                                             {item.text}
//                                         </span>
//                                     </div>
//                                 ))}
//                             </div>

//                             {/* Section 4: Button */}
//                             <div className="pt-4">
//                                 <button className="bg-[#C5A063] hover:bg-gray-800 text-black font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform">
//                                     Talk to our team
//                                 </button>
//                             </div>

//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     )
// }