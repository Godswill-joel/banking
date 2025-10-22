import Image from 'next/image'
import img from '../../../public/assets/recurring-buy.webp'

export default function WhyTOBuy() {
    return (
        <section className="bg-[#0D0D0D] text-white  text-center">
            <div className='px-6 lg:px-24  '>
                <h3 className="text-3xl md:text-5xl font-semibold mb-4">
                    Why buy <span className="text-[#C5A063]">Bitcoin</span> at River?
                </h3>
                <p className="text-gray-400 mb-16 text-lg">
                    River is the fastest and easiest way to buy Bitcoin.
                </p>

                <div className="grid md:grid-cols-2 gap-12 items-center bg-[#262421] p-8 rounded-2xl">
                    <div className="text-left space-y-6">
                        <h5 className="text-2xl lg:text-6xl font-semibold">
                            <span className="text-[#C5A063]">Zero-fee</span> recurring buys
                        </h5>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            The smartest way to buy Bitcoin every hour, day, week, or month. Build your position automatically with no extra fees.
                        </p>
                    </div>

                    <div className="relative flex justify-center items-center ">
                        <div className="relative w-full max-w-[500px] h-[360px] overflow-hidden rounded-4xl">
                            <Image
                                src={img}
                                alt="Buy Bitcoin at River"
                                fill
                                className="object-contain rounded-2xl opacity-90 hover:opacity-100 transition-opacity duration-700"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#262421] via-[#262421]/50 to-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
