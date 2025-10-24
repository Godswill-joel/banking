"use client";
import { useState } from "react";

export default function InterestCalculator() {
  const [deposit, setDeposit] = useState(50000);
  const [years, setYears] = useState(5);

  const nationalRate = 0.0046; // 0.46%
  const riverRate = 0.0375; // 3.75%

  // Daily compounding logic for accuracy
  const days = years * 365;
  const nationalFinal = deposit * Math.pow(1 + nationalRate / 365, days);
  const riverFinal = deposit * Math.pow(1 + riverRate / 365, days);

  const nationalReturn = nationalFinal - deposit;
  const riverReturn = riverFinal - deposit;

  const format = (val: number) =>
    val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <section className="bg-[#0D0D0D] text-white text-start px-4 sm:px-6 md:px-12 lg:px-20 py-16">
      <div className="max-w-3xl mx-auto">
        <small className="uppercase tracking-wide text-[#C5A063] text-sm">
          Bitcoin Interest on Cash
        </small>

        <h5 className="text-3xl md:text-5xl font-semibold mt-2 mb-4 leading-snug">
          Amplify your <span className="text-[#C5A063]">returns</span>
        </h5>

        <p className="text-gray-400 mb-10 text-base sm:text-lg">
          Compare the historical returns of Bitcoin Interest on Cash vs the
          average national savings account.
        </p>

        <div className="bg-[#1D1D1D] rounded-2xl p-6 sm:p-8 shadow-lg">
          <form className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-8 justify-between">
              <div className="flex-1 text-left">
                <label className="text-sm uppercase text-gray-400 mb-2 block">
                  Initial Deposit
                </label>
                <input
                  type="number"
                  className="w-full p-3 rounded-md bg-[#0D0D0D] border border-gray-700 text-white focus:outline-none focus:border-[#C5A063]"
                  placeholder="0.00 USD"
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                />
              </div>

              <div className="flex-1 text-left">
                <label className="text-sm uppercase text-gray-400 mb-2 block">
                  Over the last
                </label>
                <select
                  className="w-full p-3 rounded-md bg-[#0D0D0D] border border-gray-700 text-white focus:outline-none focus:border-[#C5A063]"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((yr) => (
                    <option key={yr} value={yr}>
                      {yr} {yr === 1 ? "year" : "years"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-10 space-y-6 border-t border-gray-700 pt-8 text-left">
              <div>
                <p className="text-gray-400 text-sm sm:text-base">
                  Returns on national average interest rate (0.46%)
                </p>
                <span className="text-[#C5A063] text-xl sm:text-2xl font-semibold">
                  = ${format(nationalReturn)}
                </span>
              </div>

              <div>
                <p className="text-gray-400 text-sm sm:text-base">
                  Returns on River’s Bitcoin interest rate (3.75%)
                </p>
                <span className="text-[#C5A063] text-xl sm:text-2xl font-semibold">
                  = ${format(riverReturn)}
                </span>
              </div>
            </div>
          </form>
        </div>

        <p className="text-gray-600 text-xs sm:text-sm mt-10 leading-relaxed">
          <strong>Note:</strong>{" "}
          <a
            href="#"
            className="underline text-[#C5A063] hover:text-[#b6934c] transition"
          >
            Calculator is for informational purposes only. Rates are assumptions
            and subject to change. See how this is calculated.
          </a>
        </p>
      </div>
    </section>
  );
}
