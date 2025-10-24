import img1 from '../../../public/assets/iphones-buy-bitcoin.webp'
import Image from 'next/image'

export default function BuyBitcoinHero() {
    return (
        <div className="bg-[#0D0D0D] text-white px-6 lg:px-24 py-24 flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="text-center md:text-left space-y-6 max-w-xl">
                <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
                    <span className="text-[#C5A063]">Buy Bitcoin</span> in minutes
                </h1>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                    River is the most trusted place in the U.S. for individuals and businesses to buy, sell,
                    send, and receive Bitcoin.
                </p>
                <button className="mt-6 px-8 py-3 text-lg font-medium bg-[#C5A063] text-black rounded-lg hover:bg-[#d2b36f] transition">
                    Buy Bitcoin
                </button>
            </div>

            <div className="flex justify-center md:justify-end">
                <Image
                    src={img1}
                    width={500}
                    height={500}
                    alt="Buy Bitcoin Hero"
                    className="object-contain drop-shadow-2xl"
                />
            </div>
        </div>
    )
}
