import forbes from '../../../public/Logo/forbes.svg';
import bloomberg from '../../../public/Logo/bloomberg.svg';
import business from '../../../public/Logo/businessinsider.svg';
import nasdaq from '../../../public/Logo/nasdaq.svg';
import fortune from '../../../public/Logo/fortune.svg';
import Image from 'next/image';

export default function FeaturedIn() {
  const logos = [forbes, bloomberg, business, nasdaq, fortune];

  return (
    <section className="bg-[#0D0D0D] py-12 px-6 text-center">
      <h3 className="text-#F9F9F9 uppercase tracking-wide text-lg mb-8">
        Featured in
      </h3>

      <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
        {logos.map((logo, i) => (
          <Image
            key={i}
            src={logo}
            alt={`Logo ${i + 1}`}
            className="h-8 w-auto grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
          />
        ))}
      </div>
    </section>
  );
}
