import Image from 'next/image';
import icon1 from '../../../public/icons/CurrencyBtc.svg';
import icon2 from '../../../public/icons/WalletDuotone.svg';
import icon3 from '../../../public/icons/gold-headset.svg';
import icon4 from '../../../public/icons/key-gold.svg';
import icon5 from '../../../public/icons/stamp-gold.svg';

export default function BuyBitcoinGrid() {
    const data = [
        {
            icon: icon3,
            title: 'U.S. based human support',
            description:
                'Our dedicated Client Services team is here to provide personalized, white-glove support via email, chat, or phone.',
        },
        {
            icon: icon2,
            title: 'Buy what you need',
            description:
                'You can get started by purchasing as little as $10 worth of Bitcoin on River.',
        },
        {
            icon: icon1,
            title: 'Easy-to-use wallet',
            description:
                'Buy, store, and use Bitcoin with the best experience. We do the thinking so you can focus on what matters.',
        },
        {
            icon: icon4,
            title: '100% Full reserve custody',
            description:
                "All assets held on River are held 1:1. We don't use or lend your Bitcoin, ever.",
        },
        {
            icon: icon5,
            title: 'Licensed, regulated, audited',
            description:
                'River is fully licensed and compliant with all U.S. regulations, with annual financial and SOC audits to ensure investor protection.',
        },
        {
            icon: icon1,
            title: 'Bulletproof security systems',
            description:
                "Our clients' Bitcoin is always stored offline and protected by geographically distributed 'multisig' keys.",
        },
    ];


    return (
        <div className="bg-[#0D0D0D] text-white px-6 lg:px-24 py-20 text-center">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="p-8 flex flex-col items-center text-center hover:scale-105 transition-transform duration-500"
                    >
                        <div className="mb-6 flex items-center justify-center w-16 h-16 bg-[#C5A063]/10 rounded-full">
                            <Image src={item.icon} alt={item.title} width={40} height={40} />
                        </div>
                        <p className="text-xl font-semibold mb-3">{item.title}</p>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            {item.description}
                        </p>                       
                    </div>
                ))}
            </div>
        </div>
    )
}
