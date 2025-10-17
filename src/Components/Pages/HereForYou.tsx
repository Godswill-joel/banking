import Image from 'next/image'
import Link from 'next/link'
import icon1 from '../../../public/icons/CurrencyBtc.svg'
import icon2 from '../../../public/icons/WalletDuotone.svg'
import icon3 from '../../../public/icons/gold-headset.svg'
import icon4 from '../../../public/icons/key-gold.svg'
import icon5 from '../../../public/icons/stamp-gold.svg'

export default function HereForYou() {
  const data = [
    {
      icon: icon1,
      title: 'U.S. based human support',
      description:
        'Our experienced Client Services team is here to help you build your wealth in Bitcoin.'
    },
    {
      icon: icon2,
      title: 'Bitcoin-only company',
      description:
        'We focus all our resources into the cryptocurrency that matters. Our products and features are built by Bitcoiners, for Bitcoiners.'
    },
    {
      icon: icon3,
      title: 'A wallet that works for you',
      description:
        'Buy, manage, and use Bitcoin all in one place. Our wallet is designed to make Bitcoin simple and accessible.'
    },
    {
      icon: icon4,
      title: 'Security you can trust',
      description:
        'We prioritize the safety of your Bitcoin with industry-leading security measures and practices.'
    },
    {
      icon: icon5,
      title: 'Proven full reserve custody',
      description:
        'All client Bitcoin at River is held in full reserve. No lending, no exceptions. Verify it yourself using our Proof of Reserves.',
      link: '/proof-of-reserves'
    },
    {
      icon: icon1,
      title: 'Regulated and compliant',
      description:
        'River is a licensed Bitcoin custodian regulated by the New York Department of Financial Services (NYDFS). We adhere to strict regulatory standards to ensure the safety and security of your assets.'
    }
  ]

  return (
    <div className="bg-[#0D0D0D] text-white px-6 lg:px-24 py-20 text-center">
      <h2 className="text-3xl md:text-6xl font-semibold mb-16">
        We&apos;re <span className="text-[#C5A063]">here for you</span>
      </h2>

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

            {item.link && (
              <Link
                href={item.link}
                className="mt-auto px-6 py-2 text-sm font-medium text-[#d2b365] rounded-lg hover:border transition"
              >
                View proof
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
