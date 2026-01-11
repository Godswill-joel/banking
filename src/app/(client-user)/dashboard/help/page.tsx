"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Mail,
  Phone,
  Clock,
  MessageCircle,
  FileText,
  Shield,
  CreditCard,
  TrendingUp,
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  Send,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function HelpSupportPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const faqs: FAQ[] = [
    {
      id: "1",
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Sign Up' button on our homepage. Fill in your personal information, verify your email address, and complete the KYC (Know Your Customer) process. Once verified, you can start investing immediately.",
      category: "account",
    },
    {
      id: "2",
      question: "What payment methods do you accept?",
      answer: "We accept bank transfers, credit/debit cards, and cryptocurrency deposits. All transactions are secured with industry-standard encryption to protect your financial information.",
      category: "payments",
    },
    {
      id: "3",
      question: "How long does it take to process a withdrawal?",
      answer: "Cryptocurrency withdrawals typically process within 15-30 minutes. Bank transfers may take 2-5 business days depending on your bank. We process all withdrawal requests within 24 hours of submission.",
      category: "payments",
    },
    {
      id: "4",
      question: "Is my investment secure?",
      answer: "Yes, we employ bank-level security measures including 2FA authentication, cold storage for crypto assets, and SSL encryption. We're also regulated and comply with all financial regulations in our operating jurisdictions.",
      category: "security",
    },
    {
      id: "5",
      question: "What are your trading fees?",
      answer: "Our trading fees are competitive and transparent. For crypto trades, we charge 0.5% per transaction. There are no hidden fees, and you can view our complete fee schedule in your account settings.",
      category: "trading",
    },
    {
      id: "6",
      question: "Can I invest in multiple cryptocurrencies?",
      answer: "Absolutely! River supports a wide range of cryptocurrencies including Bitcoin, Ethereum, and many altcoins. You can diversify your portfolio across multiple assets through our platform.",
      category: "trading",
    },
    {
      id: "7",
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login page. Enter your registered email address, and we'll send you a secure link to reset your password. For security reasons, the link expires after 24 hours.",
      category: "account",
    },
    {
      id: "8",
      question: "What is two-factor authentication (2FA)?",
      answer: "2FA adds an extra layer of security to your account by requiring a second form of verification beyond your password. We support authenticator apps like Google Authenticator and SMS verification.",
      category: "security",
    },
  ];

  const categories = [
    { id: "all", name: "All Topics", icon: FileText },
    { id: "account", name: "Account", icon: Users },
    { id: "payments", name: "Payments", icon: CreditCard },
    { id: "trading", name: "Trading", icon: TrendingUp },
    { id: "security", name: "Security", icon: Shield },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      value: "support@river.com",
      description: "Response within 24 hours",
      action: "mailto:support@river.com",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Phone,
      title: "Phone Support",
      value: "+1 (555) 123-4567",
      description: "Mon-Fri, 9AM-6PM EST",
      action: "tel:+15551234567",
      color: "from-green-500 to-emerald-600",
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert("Please fill in all fields");
      return;
    }
    alert("Thank you for contacting us! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-black/80 to-gray-900/80 border border-[#B4925B]/20 rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#B4925B] to-[#8B7355] flex items-center justify-center shadow-lg">
              <HelpCircle className="text-black" size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#B4925B] to-white bg-clip-text text-transparent">
                Help & Support
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                We're here to help you 24/7
              </p>
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.action}
              className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg p-8 hover:scale-105 transition-all group"
            >
              <div className="flex items-start gap-6">
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all shadow-lg`}
                >
                  <method.icon className="text-white" size={28} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {method.title}
                  </h3>
                  <p className="text-2xl font-bold text-[#B4925B] mb-2">
                    {method.value}
                  </p>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock size={16} />
                    <span className="text-sm">{method.description}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Office Location */}
        <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <MapPin className="text-white" size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-3">
                Office Location
              </h3>
              <p className="text-gray-300 text-lg mb-2">
                123 Financial District, Suite 500
              </p>
              <p className="text-gray-300 text-lg mb-4">
                New York, NY 10004, United States
              </p>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock size={16} />
                <span className="text-sm">
                  Office Hours: Monday - Friday, 9:00 AM - 6:00 PM EST
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8 border-b border-[#B4925B]/20">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>

            {/* Search */}
            <div className="relative mb-6">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#B4925B]/50 transition-all"
              />
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <category.icon size={18} />
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-3">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="mx-auto mb-4 text-gray-600" size={48} />
                <p className="text-gray-400 text-lg">No FAQs found</p>
              </div>
            ) : (
              filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() =>
                      setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                    }
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                  >
                    <h3 className="text-lg font-semibold text-white pr-4">
                      {faq.question}
                    </h3>
                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="text-[#B4925B] flex-shrink-0" size={24} />
                    ) : (
                      <ChevronDown className="text-gray-400 flex-shrink-0" size={24} />
                    )}
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-6 pb-5">
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8 border-b border-[#B4925B]/20">
            <div className="flex items-center gap-3">
              <MessageCircle className="text-[#B4925B]" size={24} />
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Send Us a Message
              </h2>
            </div>
            <p className="text-gray-400 mt-2">
              Can't find what you're looking for? Send us a message and we'll get
              back to you within 24 hours.
            </p>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#B4925B]/50 transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#B4925B]/50 transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#B4925B]/50 transition-all"
                placeholder="How can we help you?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Message
              </label>
              <textarea
                rows={6}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#B4925B]/50 transition-all resize-none"
                placeholder="Please describe your issue or question in detail..."
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#B4925B] to-[#8B7355] hover:from-[#8B7355] hover:to-[#B4925B] text-black font-bold rounded-xl transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Send Message
            </button>
          </div>
        </div>

        {/* Social Media */}
        <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Connect With Us
          </h3>
          <div className="flex justify-center gap-4">
            {[
              { icon: Facebook, color: "from-blue-600 to-blue-700", link: "#" },
              { icon: Twitter, color: "from-sky-500 to-blue-500", link: "#" },
              { icon: Instagram, color: "from-pink-500 to-purple-600", link: "#" },
              { icon: Linkedin, color: "from-blue-700 to-blue-800", link: "#" },
            ].map((social, index) => (
              <a
                key={index}
                href={social.link}
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center hover:scale-110 transition-all shadow-lg`}
              >
                <social.icon className="text-white" size={24} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}