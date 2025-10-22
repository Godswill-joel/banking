import Image from 'next/image';
import img1 from '../../../public/assets/recurring-buy.webp';
import img2 from '../../../public/assets/iphone-wallet.webp';
import img3 from '../../../public/assets/bitcoin-interest-mobile.webp';
import img4 from '../../../public/assets/BusinessAccounts.webp';
import img5 from '../../../public/assets/private-client-man.webp';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function AssetDisplay() {
    const card = [
        {
            img: img1,
            title: (
                <>
                    <span className="text-[#C5A063] font-semibold">Zero</span>-fee recurring buys
                </>
            ),
            desc: 'Buy Bitcoin every hour, day, week, or month and pay zero fees.',
            btn: 'Start buying',
        },
        {
            img: img2,
            title: 'Best-in-class wallet',
            desc: 'Securely store, send, and manage your Bitcoin in seconds.',
            btn: 'Download app',
        },
    ];

    const businessCards = [
        {
            img: img5,
            title: 'Private Client Services',
            desc: 'Want to buy more than $100,000 in Bitcoin? Our expert team is here for you.',
            btn: 'Discover benefits',
        },
        {
            img: img4,
            title: 'Business Accounts',
            desc: 'Invest in Bitcoin and strengthen your balance sheet. Onboard today.',
            btn: 'Learn more',
        },
    ];

    return (
        <section className="bg-[#0D0D0D] text-white px-6 lg:px-24 py-20 space-y-16">

            <h3 className="text-3xl md:text-6xl  font-semibold text-center  mx-auto leading-snug">
                The best way to get your share of the <span className="text-[#C5A063]">world&apos;s scarcest asset</span>
            </h3>


            <div className="grid md:grid-cols-2 gap-10">
                {card.map(({ img, title, desc, btn }, i) => (
                    <div
                        key={i}
                        className="relative group bg-[#1D1D1D] p-12 rounded-2xl overflow-hidden h-[580px] flex justify-center"
                    >
                        <Image
                            src={img}
                            alt="feature"
                            fill
                            className="object-contain opacity-80 group-hover:opacity-100 mt-8 transition-opacity duration-700"
                        />


                        <div className="absolute bottom-0 py-8  px-16 w-full text-center bg-gradient-to-b from-transparent via-[#1D1D1D]/90 to-[#1D1D1D]">
                            <h4 className="text-2xl md:text-[4xl] font-semibold mb-2">{title}</h4>
                            <p className="text-gray-300 md:text-[4xl] mb-4">{desc}</p>
                            <button className="px-6 py-2 text-sm font-medium text-[#C5A063] rounded-lg transition">
                                {btn} <ArrowRightIcon className="inline-block w-4 h-4 ml-2" />
                            </button>
                        </div>

                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="space-y-4 text-center">
                    <h4 className="text-2xl md:text-6xl font-semibold">
                        Earn <span className='text-[#C5A063]'>3.75%</span> interest on cash. Paid in Bitcoin.
                    </h4>
                    <p className="text-gray-300">
                        Put your cash to work and earn Bitcoin. Cash is FDIC insured, no hidden
                        fees or minimums, and withdraw your cash at any time.
                    </p>
                    <div className="flex gap-4 pt-4 w-full justify-center">
                        <button className="px-6 py-2 text-sm font-medium bg-[#C5A063] text-black rounded-lg transition">
                            Earn Bitcoin
                        </button>
                        <button className="px-6 py-2 text-sm font-medium text-[#C5A063]">
                            Learn more <ArrowRightIcon className="inline-block w-4 h-4 ml-2" />
                        </button>
                    </div>
                </div>

                <div className="relative h-[420px] rounded-2xl overflow-hidden">
                    <Image
                        src={img3}
                        alt="Earn Bitcoin"
                        fill
                        className="object-contain "
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/40 to-transparent"></div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10 mt-20">
                {businessCards.map(({ img, title, desc, btn }, i) => (
                    <div
                        key={i}
                        className="relative group bg-[#1D1D1D] rounded-2xl overflow-hidden h-[500px] flex flex-col justify-end"
                    >
                        <Image
                            src={img}
                            alt={title}
                            fill
                            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1D1D1D]/70 to-[#1D1D1D]" />
                        <div className="relative p-8 text-center">
                            <h4 className="text-2xl font-semibold mb-2">{title}</h4>
                            <p className="text-gray-300 mb-4">{desc}</p>
                            <button className="px-6 py-2 text-sm font-medium text-[#C5A063] rounded-lg transition hover:text-white">
                                {btn} <ArrowRightIcon className="inline-block w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>


        </section >
    );
}
