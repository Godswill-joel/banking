export default function Faq() {
  const faqs = [
    {
      question: 'Why should I buy Bitcoin (BTC)?',
      answer:
        "You might consider buying Bitcoin for its potential as a long-term store of value, its role in enhancing the returns of your investment portfolio, and its unique position as a decentralized digital currency that operates independently of traditional financial systems. However, it's important to weigh the risks and do your research before investing.",
    },
    {
      question: 'Is Bitcoin a good investment?',
      answer:
        "Bitcoin can be a good investment for those who believe in its long-term potential and see value in its fixed supply of 21 million coins. However, it's essential to understand the risks, research thoroughly, and consider your financial goals before investing.",
    },
    {
      question: 'How much Bitcoin can I buy?',
      answer:
        "You can buy as much Bitcoin as you want, depending on your budget. Bitcoin can be purchased in fractions, so you don't need to buy a whole coin. Start with as little as $10 on River.",
    },
    {
      question: 'Can I transfer Bitcoin from River to my own wallet?',
      answer:
        'The Bitcoin you buy on River belongs to you. River makes it easy to withdraw your Bitcoin to any wallet. Simply click or tap on "Send" and enter your other wallet address.',
    },
    {
      question: 'What are the transaction fees for buying Bitcoin?',
      answer:
        'River charges zero fees for investors that have a recurring buy set up. For a one-time buy, River charges between 0.25% to 1.00% based on the order size.',
    },
    {
      question: 'Can I buy other cryptocurrencies on River?',
      answer:
        'No, River is focused exclusively on Bitcoin (BTC) because we believe it is the most reliable and secure digital currency for safeguarding wealth over time.',
    },
    {
      question: 'What payment methods can I use to buy Bitcoin on River?',
      answer:
        'You can buy Bitcoin using ACH bank transfers or wire transfers. These options make it easy to fund your account and complete Bitcoin purchases quickly and securely.',
    },
  ];

  return (
    <section className="bg-[#0D0D0D] text-white px-6 lg:px-24 py-20">
      <h2 className="text-3xl md:text-5xl font-semibold text-center mb-12">
        Frequently Asked <span className="text-[#C5A063]">Questions</span>
      </h2>

      <div className="max-w-3xl mx-auto divide-y divide-gray-700">
        {faqs.map((faq, index) => (
          <div key={index} className="py-6 text-left">
            <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
            <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
