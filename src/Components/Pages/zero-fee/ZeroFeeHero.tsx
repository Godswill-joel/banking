import Image from 'next/image'
import img1 from '../../../../public/assets/supercharged.webp'
import img2 from '../../../../public/assets/zero-feeimg.webp'
import img3 from '../../../../public/assets/supercharged.webp'
import bg from '../../../../public/assets/chartbg.webp'


export default function ZeroFeeHero() {


    const features = [
        {
            title: "Automatically investon your schedule",
            description: "Choose how often and how much you invest, with zero fees after 7 days.",
            img: img1
        },
        {
            title: "Supercharge your recurring buys",
            description: "Double your recurring buys during dips automatically.",
            img: img2
        },
        {
            title: "Zero-fee recurring buys, custody, and withdrawals",
            description: "Buy, hold, and auto-withdraw your bitcoin without fees.",
            img: img3
        },
    ]


    return (
        <>
            <section className="bg-[#131313] text-white flex flex-col items-center justify-center text-center px-6 py-20 space-y-10">


                <div className="relative max-w-[30rem] h-[25rem] rounded-2xl overflow-hidden shadow-lg">
                    <video
                        src="/video/recurringbuyherovideo.webm"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-auto rounded-2xl"
                    />
                    <div className="absolute h-12 bottom-0 left-0 right-0 bg-[#131313] opacity-30" />
                </div>

                <div className="space-y-6 max-w-6xl">
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight text-[#C5A063]">
                        Zero-feerecurring buys
                    </h1>

                    <p className="text-gray-300 text-[2.5rem] md:text-[3rem]">
                        Get more Bitcoin for your money
                    </p>

                    <button className="px-4 py-2 bg-[#C5A063] text-black font-bold rounded-lg hover:bg-[#b6934c] transition">
                        Start buying
                    </button>
                </div>



                <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-3">
                    {features.map((item, index) => (
                        <div
                            key={index}
                            className="bg-[#1D1D1D] text-white rounded-2xl p-4 md:p-8 shadow-lg hover:shadow-[#C5A063]/20 transition-shadow duration-300 flex flex-col items-center text-center space-y-4"
                        >

                            <div className="relative w-full h-56 rounded-xl overflow-hidden">
                                <Image
                                    src={item.img}
                                    alt={item.title}
                                    fill
                                    className="object-contain hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-2xl font-semibold">{item.title}</h2>
                                <p className="text-gray-400 text-base">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>




            </section >

            <section
                className="relative w-full bg-[#131313]  text-white py-24 px-6 flex flex-col items-start justify-start text-start"
            >
                <Image
                    src={bg}
                    alt="Chart Background"
                    fill
                    className="object-cover  absolute inset-0"
                    priority
                />


                <div className="ml-8 md:ml-12 lg:ml-32 relative z-10 max-w-2xl space-y-6">
                    <h3 className="text-3xl md:text-5xl font-semibold">
                        Build wealth automatically
                    </h3>

                    <p className="text-gray-300 text-lg md:text-xl">
                        See the growth from buying bitcoin with a weekly recurring order over the last 2 years.
                    </p>

                    <div className="text-start space-y-3">
                        <p className="text-gray-400 text-base">
                            <span className="font-semibold text-white">Investment period:</span> 2 Years
                        </p>
                        <p className="text-gray-400 text-base">
                            <span className="font-semibold text-white">Weekly investment:</span> $100
                        </p>
                        <p className="text-gray-400 text-base">
                            <span className="font-semibold text-white">Total invested:</span> $10,300
                        </p>
                        <p className="text-gray-400 text-base">
                            <span className="font-semibold text-white">Account value:</span>{" "}
                            <span className="text-[#C5A063]">$22,524 (+119%)</span>
                        </p>
                    </div>
                </div>
            </section>

        </>
    );
}
