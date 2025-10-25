import img1 from '../../public/assets/auto-withdrawals.webp'
import img3 from '../../public/assets/beneficiary-plan-completed.webp'
import img2 from '../../public/assets/cost-basis-method.webp'

export const walletFeatures = [
  {
    title: "Automated self-custody",
    description:
      "Our automatic withdrawals feature gives you a hands-off way to send your Bitcoin to self-custody.",
    image: img1,
  },
  {
    title: "Tax optimization features",
    description:
      "Track tax lots and configure cost basis methods for optimal tax planning.",
    image: img2,
  },
  {
    title: "Safeguard your wealth",
    description:
      "Create a personalized beneficiary plan to pass your Bitcoin on to your loved ones.",
    image: img3,
  },
];

// src/data/storiesData.ts
export const storiesData = [
  {
    id: "bluecotton",
    label: "BlueCotton",
    youtubeId: "uIHiwABLp84",
    quote:
      "We chose River as our bitcoin platform because we get personal service. That's the bottom line.",
    author: "Mike Coffey",
    role: "CEO, BlueCotton",
    cta: { text: "Talk to the team", href: "/contact" },
  },
  {
    id: "intentional-living",
    label: "Intentional Living FP",
    youtubeId: "_Nh4lJujceI",
    quote:
      "River helped us diversify our treasury with bitcoin while maintaining complete control and transparency.",
    author: "Sarah Nguyen",
    role: "Founder, Intentional Living FP",
    cta: { text: "Learn more", href: "/about" },
  },
  {
    id: "keen-eyecare",
    label: "Keen Eyecare Consultants",
    youtubeId: "1M728CWRyB8",
    quote:
      "The onboarding process was fast and secure — River’s team really understands business needs.",
    author: "James Ortega",
    role: "Managing Partner, Keen Eyecare Consultants",
    cta: { text: "Get started", href: "/signup" },
  },
];

export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
  icon?: string;
};

export const footer = {
  brand: {
    name: "RIVER",
    logo: "/Logo/logo.svg",
    legalLines: [
      "NMLS ID#1906809",
      "© 2025 River Financial Inc. All rights reserved.",
    ],
    appButtons: [
      {
        id: "ios",
        label: "Download on the App Store",
        href: "https://www.apple.com/app-store/",
        img: "/images/appstore-badge.png",
        alt: "Download on the App Store",
        external: true,
      },
      {
        id: "android",
        label: "Get it on Google Play",
        href: "https://play.google.com/store",
        img: "/images/googleplay-badge.png",
        alt: "Get it on Google Play",
        external: true,
      },
    ],
  },

  columns: [
    {
      title: "Product",
      links: [
        { label: "Sign Up", href: "/signup" },
        { label: "Buy Bitcoin", href: "/buy" },
        { label: "Bitcoin Interest", href: "/interest" },
        { label: "Zero Fee DCA", href: "/dca" },
        { label: "River Link", href: "/link" },
        { label: "Bitcoin Price", href: "/price" },
        { label: "Private Clients", href: "/private" },
        { label: "Businesses", href: "/businesses" },
        { label: "Learn", href: "/learn" },
      ] as FooterLink[],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Areas of Availability", href: "/availability" },
        { label: "Announcements", href: "/announcements" },
        { label: "Security", href: "/security" },
        { label: "Proof of Reserves", href: "/proof-of-reserves" },
        { label: "Partner", href: "/partner" },
      ] as FooterLink[],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Contact Support", href: "/contact" },
        { label: "Site Status", href: "/status" },
      ] as FooterLink[],
    },
    {
      title: "Social",
      links: [
        {
          label: "Newsletter",
          href: "/newsletter",
          icon: "newsletter",
        },
        {
          label: "Twitter",
          href: "https://twitter.com/river",
          external: true,
          icon: "twitter",
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com",
          external: true,
          icon: "linkedin",
        },
        {
          label: "GitHub",
          href: "https://github.com/river",
          external: true,
          icon: "github",
        },
      ] as FooterLink[],
    },
  ],
};
