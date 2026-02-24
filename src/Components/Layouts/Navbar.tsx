'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

type NavItem = {
  name: string;
  href: string;
  desc?: string;
};

type NavigationKeys = 'individuals' | 'about';

type NavigationType = Record<NavigationKeys, NavItem[]>;

const navigation: NavigationType = {
  individuals: [
    { name: 'Buy & sell', href: '/buy-bitcoin', desc: 'Purchase bitcoin with low fees' },
    { name: 'Bitcoin interest on Cash', href: '/bitcoin-interest', desc: 'Convert bitcoin to cash instantly' },
    { name: ' Zero-Fee Recurring Buys', href: '/zero-fee', desc: 'Pay $0 in fees on recurring buys' },
    { name: 'Wallet & Custody', href: '/wallet', desc: 'Earn yield on your bitcoin' },
    { name: 'Inheritance', href: '#', desc: 'Tax-advantaged bitcoin retirement' },
    { name: 'River Rewards', href: '#', desc: 'Tax-advantaged bitcoin retirement' },
  ],

  about: [
    { name: 'Company', href: '/about' },
    { name: 'Security', href: '/securityPage' },
    { name: 'Company financials', href: '/financials' },
    { name: 'Partners', href: '/patners' },
    { name: 'Contact support', href: '/contactSupport' },
  ],
};

const navItems = [
  { label: 'Individuals', key: 'individuals', hasDropdown: true },
  { label: 'Private Clients', key: 'private', href: '/privateriver' },
  { label: 'Business', key: 'business', href: '#' },
  { label: 'About', key: 'about', hasDropdown: true },
];

const Dropdown = ({ items }: { items: NavItem[] }) => (
  <div className="absolute left-0 top-full mt-2 w-72 bg-gray-100 rounded-lg shadow-xl border border-gray-200 py-2 z-50">
    {items.map(({ name, href, desc }) => (
      <a key={name} href={href} className="block px-4 py-3 hover:bg-gray-200 transition-colors duration-200">
        <div className="font-normal text-gray-900 text-base">{name}</div>
        {desc && <p className="text-sm text-gray-600 mt-1">{desc}</p>}
      </a>
    ))}
  </div>
);

export default function Navbar() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);

  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMobileDropdown = (key: string) => {
    setMobileDropdown(prev => (prev === key ? null : key));
  };

  const handleMouseEnter = (key: string) => {
    setHoveredDropdown(key);
  };

  const handleMouseLeave = (event: React.MouseEvent) => {
    const relatedTarget = event.relatedTarget as Node;
    const dropdownElement = dropdownRefs.current[hoveredDropdown || ''];

    if (dropdownElement && dropdownElement.contains(relatedTarget)) {
      return;
    }

    setHoveredDropdown(null);
  };


  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#131313] shadow-md' : 'bg-[#131313]/10 backdrop-blur-sm'
        }`}
    >
      <div className="max-w-8xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6 md:px-10">
        <Image src="/Logo/logo.svg" alt="Logo" width={150} height={40} priority />


        <div className="hidden md:flex items-center space-x-1">
          {navItems.map(({ label, key, hasDropdown, href }) => (
            <div
              key={key}
              className="relative"
              onMouseEnter={() => hasDropdown && handleMouseEnter(key)}
              onMouseLeave={handleMouseLeave}
              ref={(el) => {
                dropdownRefs.current[key] = el;
              }}
            >
              <a
                href={href || '#'}
                className="px-4 py-2 text-base font-normal text-[#F9F9F9] hover:bg-gray-700/60 rounded-md transition-colors duration-200"
              >
                {label}
                {hasDropdown && (
                  <ChevronDownIcon className="inline-block ml-1 h-4 w-4" />
                )}
              </a>

              {hasDropdown && hoveredDropdown === key && (
                <Dropdown items={navigation[key as NavigationKeys]} />
              )}
            </div>
          ))}

          <p className="px-5 text-base font-normal">
            BTC Price:
            <span className="text-[#C5A063] text-base ml-1">$103,408.78</span>
          </p>
        </div>


        <div className="hidden md:flex items-center space-x-3">
          <Link
            href={'user-login'}
          >
            <p
              className="px-4 py-2 text-base font-normal text-[#F9F9F9] hover:bg-gray-700/60 rounded-2xl transition-colors duration-200"
            >
              Log in
            </p>
          </Link>
          <a className="px-4 py-2 text-base font-normal bg-[#C5A063] text-black hover:bg-[#b08a53] rounded-2xl transition-colors duration-200">
            Sign up
          </a>
        </div>

        <button
          onClick={() => setMobile(!mobile)}
          className="md:hidden p-2 text-[#F9F9F9]"
        >
          {mobile ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {mobile && (
        <div className="md:hidden bg-[#131313] text-white px-4 py-4 space-y-2">
          {navItems.map(({ label, key, hasDropdown, href }) => (
            <div key={key} className="w-full border-b border-gray-700 last:border-b-0">
              <button
                className="flex justify-between items-center w-full py-3 text-left text-base font-normal"
                onClick={() => {
                  if (hasDropdown) {
                    toggleMobileDropdown(key);
                  } else if (href) {
                    window.location.href = href;
                    setMobile(false);
                  }
                }}
              >
                {label}
                {hasDropdown && (
                  mobileDropdown === key ? (
                    <XMarkIcon className="h-4 w-4 text-gray-300" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4 text-gray-300" />
                  )
                )}
              </button>

              {hasDropdown && mobileDropdown === key && (
                <div className="pl-4 pb-2 overflow-hidden animate-slideDown">
                  {navigation[key as NavigationKeys].map(({ name, href, desc }) => (
                    <a
                      key={name}
                      href={href}
                      className="block py-2 text-sm text-gray-300 hover:text-white transition-colors duration-200"
                      onClick={() => setMobile(false)}
                    >
                      <div className="font-normal">{name}</div>
                      {desc && <p className="text-xs text-gray-400 mt-1">{desc}</p>}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="pt-2 pb-2 border-b border-gray-700">
            <p className="text-base font-normal text-gray-300">
              BTC Price: <span className="text-[#C5A063]">$103,408.78</span>
            </p>
          </div>


          <div className="pt-2 space-y-3">
            <a
              onClick={() => { router.push('/user-login') }}
              className="block text-center py-2 text-base font-normal border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors duration-200">
              Sign in
            </a>
            <a className="block text-center py-2 text-base font-normal bg-[#C5A063] text-black rounded-lg hover:bg-[#b08a53] transition-colors duration-200">
              Get started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
