'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = {
  individuals: [
    { name: 'Buy & sell', href: '#', desc: 'Purchase bitcoin with low fees' },
    { name: 'Bitcoin interest on Cash', href: '#', desc: 'Convert bitcoin to cash instantly' },
    { name: 'Wallet & Custody', href: '#', desc: 'Earn yield on your bitcoin' },
    { name: 'Inheritance', href: '#', desc: 'Tax-advantaged bitcoin retirement' },
    { name: 'River Rewards', href: '#', desc: 'Tax-advantaged bitcoin retirement' },
  ],
  learn: [
    { name: 'Learn', href: '#' },
    { name: 'Research', href: '#' },
    { name: 'Support', href: '#' },
    { name: 'Announcement', href: '#' },
  ],
  about: [
    { name: 'Company', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Security', href: '#' },
    { name: 'Proof of reserves', href: '#' },
    { name: 'Company financials', href: '#' },
    { name: 'Partners', href: '#' },
    { name: 'Contact support', href: '#' },
  ],
};

const navItems = [
  { label: 'Individuals', key: 'individuals', hasDropdown: true },
  { label: 'Private Clients', key: 'private' },
  { label: 'Business', key: 'business' },
  { label: 'Learn', key: 'learn', hasDropdown: true },
  { label: 'About', key: 'about', hasDropdown: true },
];

const Dropdown = ({ items }: { items: { name: string; href: string; desc?: string }[] }) => (
  <div className="absolute left-0 mt-2 w-72 bg-gray-100 rounded-lg shadow-xl border border-gray-200 py-2">
    {items.map(({ name, href, desc }) => (
      <a key={name} href={href} className="block px-4 py-3 hover:bg-gray-200">
        <div className="font-medium text-gray-900">{name}</div>
        {desc && <p className="text-sm text-gray-600">{desc}</p>}
      </a>
    ))}
  </div>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#131313] shadow-md' : 'bg-[#131313]/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        <Image src="/Logo/logo.svg" alt="Logo" width={100} height={40} priority />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map(({ label, key, hasDropdown }) => (
            <div
              key={key}
              className="relative"
              onMouseEnter={() => (hasDropdown ? setActive(key!) : setActive(null))}
              onMouseLeave={() => hasDropdown && setActive(null)}
            >
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  active === key ? 'bg-gray-700 text-white' : 'text-[#F9F9F9] hover:bg-gray-700/60'
                }`}
              >
                {label}
              </button>
              {active === key && hasDropdown && <Dropdown items={navigation[key as keyof typeof navigation]} />}
            </div>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {['Log in', 'Sign up'].map((txt, i) => (
            <a
              key={txt}
              href="#"
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
                i
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'text-[#F9F9F9] hover:bg-gray-700/60'
              }`}
            >
              {txt}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobile(!mobile)} className="md:hidden p-2 text-[#F9F9F9]">
          {mobile ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobile && (
        <div className="md:hidden border-t border-gray-700 px-4 py-3 space-y-4">
          {Object.entries(navigation).map(([key, items]) => (
            <div key={key}>
              <p className="py-1 font-medium text-gray-200 capitalize">{key}</p>
              {items.map(({ name, href }) => (
                <a key={name} href={href} className="block py-1 pl-4 text-sm text-gray-400">
                  {name}
                </a>
              ))}
            </div>
          ))}
          <div className="border-t border-gray-700 pt-3 space-y-2">
            {['Sign in', 'Get started'].map((txt, i) => (
              <a
                key={txt}
                href="#"
                className={`block w-full text-center px-4 py-2.5 text-sm font-medium rounded-lg ${
                  i
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-600 text-[#F9F9F9]'
                }`}
              >
                {txt}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
