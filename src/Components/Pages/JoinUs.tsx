import Image from 'next/image'
import { ArrowRightIcon } from '@heroicons/react/16/solid'
import img1 from '../../../public/assets/river-intelligence.webp'
import img2 from '../../../public/assets/river-learn.webp'

export default function JoinUs() {
  const cards = [
    {
      img: img1,
      title: 'Learn about Bitcoin',
      desc: 'Basics to advanced Bitcoin concepts',
      btn: 'Start learning',
    },
    {
      img: img2,
      title: 'Follow our market insights',
      desc: 'Bitcoin research, content, and news in your inbox every few weeks.',
      btn: 'Get Insights',
    },
  ]

  return (
    <div className="bg-[#0D0D0D] text-white px-6 lg:px-24 py-20 text-center">
      <h3 className="text-3xl md:text-6xl font-semibold mb-10">
        Join <span className="text-[#C5A063]">thousands</span> of investors on River today
      </h3>

      <button className="mb-16 px-8 py-3 text-sm font-medium bg-[#C5A063] text-black rounded-lg hover:bg-[#d2b36f] transition">
        Buy Bitcoin
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        {cards.map((card, i) => (
          <div
            key={i}
            className="relative group bg-[#1D1D1D] rounded-2xl overflow-hidden h-[480px] flex justify-center"
          >
            <Image
              src={card.img}
              alt={card.title}
              fill
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
            />

            <div className="absolute bottom-0 py-10 px-8 w-full text-center bg-gradient-to-b from-transparent via-[#1D1D1D]/90 to-[#1D1D1D]">
              <h4 className="text-2xl font-semibold mb-2">{card.title}</h4>
              <p className="text-gray-300 mb-4">{card.desc}</p>
              <button className="px-6 py-2 text-sm font-medium text-[#C5A063] rounded-lg hover:text-white transition">
                {card.btn} <ArrowRightIcon className="inline-block w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
