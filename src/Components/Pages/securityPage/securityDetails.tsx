const securitySections = [
    {
      title: "How does River protect your funds?",
      links: [
        { label: "Proof of Reserves", href: "#" },
        { label: "Multisig cold storage", href: "#" },
        { label: "FDIC-insured cash at Lead Bank", href: "#" },
        { label: "Custody not built on third-parties", href: "#" },
      ],
    },
    {
      title: "How does River protect your account?",
      links: [
        { label: "2-factor authentication", href: "#" },
        { label: "Account notifications", href: "#" },
        { label: "24/7 security monitoring", href: "#" },
        { label: "SOC II compliance", href: "#" },
        { label: "Send limits with ForceField", href: "#" },
        { label: "New device verification", href: "#" },
      ],
    },
  ];
  
  export default function SecurityDetails() {
    return (
      <section className="bg-[#0b0b0b] text-white py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12 text-left mt-16">
          {securitySections.map((section, index) => (
            <div key={index} className="w-full md:w-1/2">
              {/* Section Title */}
              <h3 className="text-2xl font-semibold mb-4">{section.title}</h3>
  
              {/* Links List */}
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className="text-[#b89c4a] hover:text-[#d1b05e] transition-colors duration-200 inline-flex items-center"
                    >
                      {link.label} →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    );
  }
  