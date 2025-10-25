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

