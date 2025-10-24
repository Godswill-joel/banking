import Image from 'next/image';
import img1 from '../../../public/assets/investment-returns.webp';
import img2 from '../../../public/assets/protect-wealth.webp';

export default function Whyinvest() {
    const images = [
        {
            src: img1,
            alt: 'Investment Returns',
            title: 'Increase your returns',
            subtitle: 'Bitcoin improves your portfolio performance'
        },
        {
            src: img2,
            alt: 'Protect your wealth from inflation',
            title: 'Protect your wealth from inflation',
            subtitle: 'There will only ever be 21 million Bitcoin. There are unlimited dollars'
        },
    ];

    return (
        <div className="bg-[#0D0D0D] text-white px-6 lg:px-24 py-20 text-center">
            <h2 className="text-3xl md:text-6xl font-semibold mb-16">
                Why invest in <span className="text-[#C5A063]">Bitcoin?</span>
            </h2>


            <div className='flex w-full flex-wrap justify-center '>
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="flex flex-col justify-center p-6 max-w-[600px] bg-[#1D1D1D] py-8 rounded-4xl overflow-hidden m-2 flex-1 min-w-[300px]"
                    >
                        <div className='w-full px-6'>
                            <h3 className='text-4xl font-semibold'>{image.title}</h3>
                            <p className='mt-4'>{image.subtitle}</p>
                        </div>

                        <div
                            className="relative group bg-[#1D1D1D] w-full rounded-2xl overflow-hidden h-[420px] flex flex-col justify-end mt-4"
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
