'use client';
import { InterestModal } from "@/Components/Pages/Modals";
import React, { useState } from "react";
import Image from "next/image";
import { walletFeatures } from "@/data/data";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import appImg from "../../../public/assets/iphone-wallet.webp";


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
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="bg-[#0D0D0D] text-white px-6 lg:px-24 py-20 text-center relative">
      <div className="max-w-3xl mx-auto space-y-8">
        <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
          We know where the <span className="line-through">yield</span>{" "}
          <span className="text-[#C5A063]">interest</span> comes from.
        </h3>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8">
          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-3 bg-[#C5A063] text-black font-medium text-lg rounded-lg hover:bg-[#b6934c] transition"
          >
            How interest is earned
          </button>

          <button className="px-8 py-3 border border-[#C5A063] text-[#C5A063] font-medium text-lg rounded-lg hover:bg-[#C5A063] hover:text-black transition">
            Different from Bitcoin yield
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-3xl">
            <InterestModal />
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-[#C5A063] transition"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export function StartEarningButton() {
  return (
    <section className="bg-[#0D0D0D] text-white text-center px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Start earning <span className="text-[#C5A063]">Bitcoin</span> on your cash today
        </h1>

        <button className="px-4 py-2 bg-[#C5A063] text-black font-semibold text-lg rounded-lg hover:bg-[#b6934c] transition duration-300">
          Start earning
        </button>
      </div>
    </section>
  );
}

export function Disclosures() {
  return (
    <section className="bg-[#0D0D0D] text-gray-400 px-6 lg:px-24 py-16 text-sm leading-relaxed">
      <h3 className="text-white text-xl font-semibold mb-6">Disclosures</h3>

      <ol className="list-decimal list-inside space-y-6">
        {/* 1 */}
        <li>
          River Financial Inc. (“River”) is not a bank. USD funds are deposited by Lead Bank,
          Member FDIC. Your USD is FDIC insured up to $250,000, inclusive of any deposits that
          you already hold at Lead Bank in the same ownership capacity. FDIC Insurance may
          protect against a failure by Lead Bank, but does not protect against River’s failure,
          nor does it protect against theft or fraud. Bitcoin is not insured by the FDIC, and
          may lose value.
          <br /><br />
          Interest may be earned on cash that has settled at Lead Bank. The current interest
          rate is <span className="text-[#C5A063] font-medium">3.75%</span>, and is subject to
          change. You may choose to receive interest payouts in Bitcoin or in USD. Lead is not
          affiliated with River’s Bitcoin program, products, or offerings. Not available in all
          states. Fees may apply. Please review the Terms of Service for eligibility
          restrictions and additional details.
        </li>

        {/* 2 */}
        <li>
          The table is for illustrative purposes only. It compares estimated yields and annual
          earnings calculated from: the yield as of 10/07/2024 of a Bitcoin interest on cash
          offered in River, and the APY offered by other service providers as found on their
          websites (data correct as of 10/08/2024 for - Way2Save®, Chase Savings℠, and Bank of
          America Advantage Savings). Yields will fluctuate over time, and are not a forecast or
          guarantee of future earnings.
          <br /><br />
          The estimations assume certain and financial circumstances that do not apply to every
          individual. The figures presented are based on assumptions and may not apply to all
          individual circumstances. Actual earnings may be higher or lower, depending on
          numerous factors including the frequency of compounding, and variability of the
          yield.
          <br /><br />
          All investments involve risks. Nothing in this content should be construed as
          investment advice.
        </li>

        {/* 3 */}
        <li>
          The calculator considers the following inputs over a given time period:
          <ul className="list-disc list-inside ml-5 mt-2 space-y-1">
            <li>
              <strong>Initial Deposit (ID):</strong> The amount of cash (USD) that earns interest.
            </li>
            <li>
              <strong>Interest Rate (R):</strong> The displayed interest rate offered by River.
            </li>
            <li>
              <strong>Bitcoin Price (P):</strong> The daily price of bitcoin.
            </li>
            <li>
              <strong>Accrued Bitcoin (B):</strong> The amount of bitcoin that has been accrued earlier in the time period.
            </li>
          </ul>
          <p className="mt-2">
            The calculator assumes that over the selected time period, the Initial Deposit and Interest Rate are held constant. Rates are subject to change.
          </p>
          <br />
          Returns are calculated on a daily basis. Returns each day represent the sum of two components:
          <ul className="list-disc list-inside ml-5 mt-2 space-y-1">
            <li>
              The daily bitcoin earned from interest on the Initial Deposit: <code>ID × (1 + (R / 365)) / P</code>
            </li>
            <li>
              The accrued value of all previous daily bitcoin earnings: <code>B × P</code>
            </li>
          </ul>
          <p className="mt-2">
            &quot;Returns with the national average&quot; is calculated using the most recent national deposit rate 0.46 reported by the Federal Deposit Insurance Corporation as of 10/8/2024 (Source: FDIC Website). As with the calculated Bitcoin returns, this number assumes the same Initial Deposit and holds the APY constant over the selected time period.
          </p>
        </li>

        {/* 4 */}
        <li>
          Based on national average savings account rate and reported CPI inflation. Trading
          Bitcoin involves risk of loss.
        </li>
      </ol>
    </section>
  );
}

export function DownloadAppSection() {
  return (
    <section className="bg-[#0D0D0D] text-white px-6 lg:px-24 py-20 mx-auto">
      <div className="grid md:grid-cols-2 gap-10  items-center bg-[#1D1D1D] p-6 rounded-4xl">
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-3xl md:text-6xl font-semibold leading-tight">
            Best-in-class <span className="text-[#C5A063]">Bitcoin wallet</span>
          </h2>

          <p className="text-gray-300 text-lg max-w-md mx-auto md:mx-0">
            Send, receive, store, and manage your Bitcoin all in one place.
          </p>

          <div className="flex gap-4 pt-4 justify-center md:justify-start">
            <button className="px-8 py-3  text-[#C5A063] font-medium rounded-lg hover:text-[#b6934ccc] transition">
              Download the app <ArrowRightIcon className="inline-block w-5 h-5 ml-2" />
            </button>
          </div>
        </div>

        <div className="relative h-[420px] rounded-2xl overflow-hidden flex justify-center">
          <Image
            src={appImg}
            alt="Bitcoin Wallet App Mockup"
            fill
            className="object-contain"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1D] via-[#1D1D1D]/40 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}

export function WalletPage3Comp() {
  return (
    <section className="bg-[#0D0D0D] text-white w-full flex flex-wrap gap-10 justify-center items-start px-4 sm:px-6 md:px-12 py-16">
      {walletFeatures.map((item, index) => (
        <div
          key={index}
          className="flex flex-col gap-6 w-full sm:w-[22rem] md:w-[25rem]"
        >
          <div className="space-y-3 sm:text-center p-8 sm:p-0">
            <h5 className="text-2xl md:text-3xl font-semibold">{item.title}</h5>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-contain h-full w-full md:object-cover rounded-2xl"
              priority
            />
          </div>
        </div>
      ))}
    </section>
  );
}

export function GetstartedButton() {

  return (
    <div className="bg-[#0D0D0D] text-white py-16 px-6 flex flex-col items-center justify-center text-center space-y-6">
      <p className="text-4xl md:text-6xl font-semibold">
        Ready to get started?
      </p>

      <button className="flex items-center gap-2 px-8 py-3   text-[#C5A063] font-medium text-lg transition">
        Get Started
        <ArrowRightIcon className="w-5 h-5" />
      </button>
    </div>
  )
}
