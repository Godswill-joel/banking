

export function BuyBitcoinToPortfolio() {
  return (
    <section className="bg-[#0D0D0D] text-white text-center">
      <div className="max-w-2xl mx-auto space-y-6">
        <h5 className="text-3xl md:text-5xl font-semibold">
          Add <span className="text-[#C5A063]">Bitcoin</span> to your portfolio
        </h5>
        <p className="text-gray-400 text-lg">
          Join the millions of people around the world who choose to save and invest in Bitcoin.
        </p>
        <button className="px-8 py-3 bg-[#C5A063] text-lg text-black font-medium rounded-lg hover:bg-[#b6934c] transition">
          Buy Bitcoin
        </button>
      </div>
    </section>
  );
}

export function BuyingSteps() {
  const steps = [
    {
      title: "Add Cash",
      description: "Fund your account with cash to start buying Bitcoin.",
    },
    {
      title: "Earn Bitcoin",
      description:
        "Accrued interest is converted to Bitcoin daily and paid out monthly.",
    },
    {
      title: "Grow your wealth",
      description:
        "Bitcoin's returns can give you more money for the things you care about.",
    },
  ];

  return (
    <section className="bg-[#0D0D0D] text-white px-6 lg:px-24 py-24 text-center">
      <h4 className="text-3xl md:text-5xl font-semibold mb-12">
        How to earn <span className="text-[#C5A063]">Bitcoin</span> on your cash
      </h4>

      <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
        {steps.map((step, i) => (
          <div
            key={i}
            className=" p-8 hover:scale-[1.03] transition-transform duration-300"
          >
            <div className="text-4xl text-[#C5A063] font-bold mb-4">
              {i + 1}
            </div>
            <h5 className="text-xl font-semibold mb-3">{step.title}</h5>
            <p className="text-gray-400">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}



export function Grow() {
  const data = [
    {
      title: "Generate real returns",
      description:
        "Traditional savings accounts can't keep up with inflation, but Bitcoin can.",
    },
    {
      title: "Ditch the dollar over time",
      description:
        "Want to go all-in on Bitcoin but need to hold some cash? This is for you.",
    },
    {
      title: "Elevate your Bitcoin strategy",
      description:
        "Seamlessly fund target price orders and recurring buys with interest-earning cash.",
    },
  ];

  return (
    <section className="bg-[#0D0D0D] text-white flex flex-col md:flex-row items-center px-6 lg:px-24 py-24 text-center">
      <div className="p-4 md:w-1/2">
        <h5 className="text-5xl text-start md:text-center md:text-7xl lg:text-8xl font-semibold">
          A cash account that actually{" "}
          <span className="text-[#C5A063]">grows your wealth</span>
        </h5>
      </div>

      <div className="flex flex-col max-w-5xl text-left">
        {data.map((item, index) => (
          <div
            key={index}
            className="p-8 rounded-2xl hover:scale-[1.02] transition-transform duration-500 shadow-lg"
          >
            <h6 className="text-2xl font-semibold mb-3 text-[#C5A063]">
              {item.title}
            </h6>
            <p className="text-gray-400 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}



export function IntrestOther2() {
  return (
    <section className="bg-[#0D0D0D] text-white px-6 lg:px-24 py-20 text-center">
      <div className="max-w-3xl mx-auto space-y-8">
        <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
          We know where the <span className="line-through">yield</span> <span className="text-[#C5A063]">interest </span> comes from.
        </h3>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8">
          <button className="px-8 py-3 bg-[#C5A063] text-black font-medium text-lg rounded-lg hover:bg-[#b6934c] transition">
            How interest is earned
          </button>
          <button className="px-8 py-3 border border-[#C5A063] text-[#C5A063] font-medium text-lg rounded-lg hover:bg-[#C5A063] hover:text-black transition">
            Different from Bitcoin yield
          </button>
        </div>
      </div>
    </section>
  );
}

