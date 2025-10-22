import Image from 'next/image';
import bitcoin from '../../../public/assets/bitcoin-growth.svg';

export default function WhyToBuy2() {
    return (
        <section className="bg-[#0D0D0D] text-white lg:px-24 py-20">
            <div className='bg-[#262421] flex flex-col md:flex-row items-center justify-around gap-12 p-8 rounded-4xl'>
                <div className="max-w-xl space-y-6 text-center md:text-left">
                    <h5 className="text-3xl md:text-5xl font-semibold leading-snug">
                        <span className="text-[#C5A063] font-bold">66%</span> average annual growth
                    </h5>
                    <p className="text-gray-400 text-lg">
                        Even a small allocation to Bitcoin can increase the returns of your portfolio. It&apos;s still not too late.
                    </p>
                    <button className="px-8 py-3 bg-[#C5A063] text-black font-medium rounded-lg hover:bg-[#b6934c] transition">
                        Start Investing
                    </button>
                </div>

                <div className="relative w-full max-w-[500px] h-[400px]">
                    <Image
                        src={bitcoin}
                        alt="Bitcoin Growth Chart"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>
        </section>
    );
}
