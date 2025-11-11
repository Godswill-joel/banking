/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, ChangeEvent, FormEvent, memo } from "react";
import { Button } from "@headlessui/react";

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );


  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      // Example async logic (send to API)
      // await fetch("/api/contact", { method: "POST", body: JSON.stringify(formData) });
      setSubmitted(true);
    },
    []
  );

  if (submitted) {
    return (
      <section className="bg-[#0D0D0D] min-h-full flex items-center justify-center text-white p-10">
        <div className="bg-[#131313] p-10 rounded-2xl shadow-2xl text-center space-y-4 max-w-md w-full">
          <h2 className="text-3xl font-semibold text-[#C5A063]">Thank you!</h2>
          <p className="text-gray-300 text-lg">
            Your message has been received successfully.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#0D0D0D] text-white min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-7xl w-screen flex flex-col lg:flex-row items-center lg:items-start gap-14">
        <div className="lg:w-1/2 space-y-8">
          <h1 className="text-6xl lg:text-7xl font-semibold mt-15 leading-tight">
            Become a River Private Client today
          </h1>
          <p className="text-gray-400 text-xl leading-relaxed">
            Contact us to maximize the potential of your wealth through Bitcoin.
            Our dedicated Relationship Managers will guide your journey.
          </p>
        </div>

        {/* Right Section */}
        <div className="lg:w-1/2 bg-[#0D0D0D]">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 bg-[#0D0D0D] p-10 rounded-2xl shadow-xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input label="First name" name="firstName" placeholder="Satoshi" value={formData.firstName} onChange={handleChange} required />
              <Input label="Last name" name="lastName" placeholder="Nakamoto" value={formData.lastName} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input label="Email" name="email" type="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
              <Input label="Phone number" name="phone" type="tel" placeholder="(XXX) XXX-XXXX" value={formData.phone} onChange={handleChange} />
            </div>

            <Textarea
              label="How can we help you?"
              name="message"
              placeholder="Type your message..."
              value={formData.message}
              onChange={handleChange}
            />

            <Button
              type="submit"
              className="mt-2 w-full bg-gradient-to-r from-[#C5A063] to-[#B18C4D] text-black font-semibold py-4 rounded-lg text-lg transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

const Input = memo(function Input({
  label,
  name,
  type = "text",
  value,
  placeholder,
  onChange,
  required = false,
}: any) {
  return (
    <div className="w-full">
      <label className="block text-2xl mb-2 text-gray-300">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-transparent border border-[#2A2A2A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#C5A063]"
      />
    </div>
  );
});

const Textarea = memo(function Textarea({
  label,
  name,
  value,
  placeholder,
  onChange,
}: any) {
  return (
    <div>
      <label className="block text-2xl mb-2 text-gray-300">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={5}
        placeholder={placeholder}
        className="w-full bg-transparent border border-[#2A2A2A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#C5A063]"
      />
    </div>
  );
});

export default memo(ContactForm);
