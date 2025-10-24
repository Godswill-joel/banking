import Image from 'next/image'
import img1 from '../../../public/assets/buy_bitcoin_step.webp'
import img2 from '../../../public/assets/buy_bitcoin_step-2.webp'
import img3 from '../../../public/assets/buy_bitcoin_step_3.webp'

export default function HowToBuy() {
    const data = [
        {
            image: img1,
            head: 'Create your account',
            step: 'Step 1',
            content: 'Verify your email and provide some basic information.',
        },
        {
            image: img2,
            head: 'Add cash to your account',
            step: 'Step 2',
            content: 'Fund your account with your preferred payment method.',
        },
        {
            image: img3,
            head: 'Buy Bitcoin instantly',
            step: 'Step 3',
            content: 'Submit your order and receive Bitcoin instantly.',
        },
    ]

    return (
        <div className="bg-[#0D0D0D] text-white px-6 lg:px-24 py-24 text-center">
            <h2 className="text-3xl md:text-6xl font-semibold mb-4">
                How to buy <span className="text-[#C5A063]">Bitcoin</span> at River
            </h2>
            <p className="text-gray-400 mb-16 text-lg">
                River makes it easy to get started with Bitcoin in 3 simple steps
            </p>

            <div className="grid md:grid-cols-3 gap-10">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="bg-[#1D1D1D] max-w-[500px] p-8 rounded-2xl shadow-lg hover:scale-[1.03] transition-transform duration-500"
                    >
                        <div className="flex flex-col items-center">
                            <div className="relative w-full h-[260px] mb-6 overflow-hidden rounded-xl">
                                <Image
                                    src={item.image}
                                    alt={item.head}
                                    fill
                                    className="object-contain w-full h-full"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#1D1D1D] via-[#1D1D1D]/60 to-transparent" />
                            </div>

                            <div>
                                <p className="text-sm uppercase tracking-wider text-[#C5A063] mb-2">
                                    {item.step}
                                </p>
                                <h3 className="text-xl font-semibold mb-3">{item.head}</h3>
                                <p className="text-gray-400 text-sm">{item.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}