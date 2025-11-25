'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

type NavItem = {
  name: string;
  href: string;
  desc?: string;
};

type NavigationKeys = 'individuals' | 'learn' | 'about';

type NavigationType = Record<NavigationKeys, NavItem[]>;

const navigation: NavigationType = {
  individuals: [
    { name: 'Buy & sell', href: '#', desc: 'Purchase bitcoin with low fees' },
    { name: 'Bitcoin interest on Cash', href: '#', desc: 'Convert bitcoin to cash instantly' },
    { name: 'Wallet & Custody', href: '#', desc: 'Earn yield on your bitcoin' },
    { name: 'Inheritance', href: '#', desc: 'Tax-advantaged bitcoin retirement' },
    { name: 'River Rewards', href: '#', desc: 'Tax-advantaged bitcoin retirement' },
  ],
  learn: [
    { name: 'Learn', href: '/privateriver' },
    { name: 'Research', href: '#' },
    { name: 'Support', href: '#' },
    { name: 'Announcement', href: '#' },
  ],
  about: [
    { name: 'Company', href: '#' },
    { name: 'Security', href: '/securityPage' },
    { name: 'Proof of reserves', href: '#' },
    { name: 'Company financials', href: '#' },
    { name: 'Partners', href: '#' },
    { name: 'Contact support', href: '#' },
  ],
};


const navItems = [
  { label: 'Individuals', key: 'individuals', hasDropdown: true },
  { label: 'Private Clients', key: 'private', href: '/privateriver' },
  { label: 'Business', key: 'business', href: '#' },
  { label: 'Learn', key: 'learn', hasDropdown: true },
  { label: 'About', key: 'about', hasDropdown: true },
];



const Dropdown = ({ items }: { items: NavItem[] }) => (
  <div className="absolute left-0 mt-2 w-72 bg-gray-100 rounded-lg shadow-xl border border-gray-200 py-2 z-50">
    {items.map(({ name, href, desc }) => (
      <a key={name} href={href} className="block px-4 py-3 hover:bg-gray-200">
        <div className="font-medium text-gray-900">{name}</div>
        {desc && <p className="text-sm text-gray-600">{desc}</p>}
      </a>
    ))}
  </div>
);


export default function Navbar() {
  type NavItem = {
    name: string;
    href: string;
    desc?: string;
  };

  type NavigationKeys = 'individuals' | 'learn' | 'about';

  type NavigationType = Record<NavigationKeys, NavItem[]>;

  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);


  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMobileDropdown = (key: string) => {
    setMobileDropdown(prev => (prev === key ? null : key));
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#131313] shadow-md' : 'bg-[#131313]/95 backdrop-blur-sm'
        }`}
    >
      <div className="max-w-8xl mx-auto flex h-26 items-center justify-between px-4 sm:px-6 md:px-10">

        <Image src="/Logo/logo.svg" alt="Logo" width={150} height={100} priority />

        {/* DESKTOP NAV (UNCHANGED) */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map(({ label, key, hasDropdown, href }) => (
            <div
              key={key}
              className="relative group"
            >
              <a
                href={href || '#'}
                className="px-4 py-2 text-2xl font-medium text-[#F9F9F9] hover:bg-gray-700/60 rounded-md"
              >
                {label}
              </a>

              {hasDropdown && (
                <div className="hidden group-hover:block">
                 <Dropdown items={navigation[key as NavigationKeys]} />
                </div>
              )}
            </div>
          ))}

          <p className="px-5 text-2xl">
            BTC Price:
            <span className="text-[#C5A063] text-2xl">$103,408.78</span>
          </p>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center space-x-3">
          <a className="px-5 py-2 text-2xl text-[#F9F9F9] hover:bg-gray-700/60 rounded-2xl">Log in</a>
          <a className="px-5 py-2 text-2xl font-medium bg-[#C5A063] text-black hover:bg-[#b08a53] rounded-2xl">Sign up</a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobile(!mobile)}
          className="md:hidden p-2 text-[#F9F9F9]"
        >
          {mobile ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobile && (
        <div className="md:hidden bg-[#131313] text-white px-4 py-4 space-y-4">

          {/* MOBILE NAV ITEMS */}
          {navItems.map(({ label, key, hasDropdown, href }) => (
            <div key={key} className="w-full">

              {/* --- clickable row --- */}
              <button
                className="flex justify-between w-full py-3 text-left text-lg font-semibold"
                onClick={() => {
                  if (hasDropdown) {
                    toggleMobileDropdown(key);
                  } else if (href) {
                    window.location.href = href;
                  }
                }}
              >
                {label}

                {hasDropdown ? (
                  mobileDropdown === key ? (
                    <XMarkIcon className="h-5 w-5 text-gray-300" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-300" />
                  )
                ) : null}
              </button>

              {/* --- MOBILE DROPDOWN CONTENT --- */}
              {hasDropdown && mobileDropdown === key && (
                <div
                  className="pl-4 overflow-hidden animate-slideDown"
                >
                  {navigation[key as NavigationKeys].map(({ name, href }: NavItem) => (
                    <a
                      key={name}
                      href={href}
                      className="block py-2 text-sm text-gray-300 hover:text-white"
                    >
                      {name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* SIGN IN / OUT */}
          <div className="pt-4 space-y-3 border-t border-gray-700">
            <a className="block text-center py-2 border border-gray-600 rounded-lg">Sign in</a>
            <a className="block text-center py-2 bg-[#C5A063] text-black rounded-lg">Get started</a>
          </div>
        </div>
      )}
    </nav>
  );
}

