"use client";

const endOfYearMetrics = [
  {
    value: "$60.9M",
    label: "Corporate treasury",
  },
  {
    value: "Zero",
    label: "Debt",
  },
  {
    value: "Profitable",
    label: "Operations",
  },
];

const currentMetrics = [
  {
    value: "$4.4B",
    label: "Lifetime trading vol",
  },
  {
    value: "$2.6B",
    label: "Bitcoin under custody",
  },
  {
    value: ">100%",
    label: "Proven reserve custody",
  },
];

export default function FinancialMetricsSection() {
  return (
    <section className="relative w-full  text-white py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-semibold mb-3">
            End of year financials
          </h2>
          <p className="text-gray-400">As of 2024</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-28">
          {endOfYearMetrics.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#0e0e0e] border border-white/5 p-10 text-center shadow-lg"
              style={{
                backgroundImage: "url('/assets/glow-gold.svg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <p className="text-4xl font-semibold text-[#D3AC6A] mb-3">
                {item.value}
              </p>
              <p className="text-gray-300 text-lg">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Current metrics */}
        <div className="text-center mb-16">
          <h3 className="text-4xl sm:text-5xl font-semibold">
            Current metrics
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentMetrics.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#0e0e0e] border border-white/5 p-10 text-center shadow-lg"
              style={{
                backgroundImage: "url('/assets/glow-gold.svg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <p className="text-4xl font-semibold text-[#D3AC6A] mb-3">
                {item.value}
              </p>
              <p className="text-gray-300 text-lg">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
