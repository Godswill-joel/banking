// app/panel/wallets-page/page.tsx
"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Minus,
  CreditCard,
} from "lucide-react";

export default function WalletsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("wallets");

  const wallets = [
    {
      id: 1,
      user: "John Doe",
      email: "john.doe@example.com",
      balance: "$12,450",
      currency: "USD",
      status: "active",
      lastActivity: "2 hours ago",
    },
    {
      id: 2,
      user: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      balance: "$8,750",
      currency: "USD",
      status: "frozen",
      lastActivity: "1 day ago",
    },
    {
      id: 3,
      user: "Mike Johnson",
      email: "mike.johnson@example.com",
      balance: "$3,200",
      currency: "EUR",
      status: "active",
      lastActivity: "3 hours ago",
    },
  ];

  const transactions = [
    {
      id: 1,
      user: "John Doe",
      type: "deposit",
      amount: "$1,000",
      status: "completed",
      date: "2024-01-15 14:30",
      reference: "TRX_001",
    },
    {
      id: 2,
      user: "Sarah Wilson",
      type: "withdrawal",
      amount: "$500",
      status: "pending",
      date: "2024-01-15 13:15",
      reference: "TRX_002",
    },
    {
      id: 3,
      user: "Mike Johnson",
      type: "transfer",
      amount: "$250",
      status: "completed",
      date: "2024-01-15 12:00",
      reference: "TRX_003",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      frozen: "bg-red-100 text-red-800",
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return colors[status as keyof typeof colors];
  };

  const getTypeColor = (type: string) => {
    const colors = {
      deposit: "text-green-600",
      withdrawal: "text-red-600",
      transfer: "text-blue-600",
    };
    return colors[type as keyof typeof colors];
  };

  return (
    <div className="p-6 space-y-6 h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Wallet Management</h1>
          <p className="text-black mt-1">
            Monitor and manage user wallets and transactions
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus size={20} />
            <span>Add Funds</span>
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Minus size={20} />
            <span>Deduct Funds</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-black">
        <div className="border-b border-black">
          <nav className="flex -mb-px">
            {[
              { id: "wallets", name: "Wallets" },
              { id: "transactions", name: "Transactions" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-black hover:text-gray-700"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
                size={20}
              />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-black pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
        
          </div>

          {/* Content based on active tab */}
          {activeTab === "wallets" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <CreditCard className="text-blue-600" size={24} />
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        wallet.status
                      )}`}
                    >
                      {wallet.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-black">{wallet.user}</h3>
                  <p className="text-sm text-black mb-2">{wallet.email}</p>
                  <div className="text-2xl font-bold text-black mb-2">
                    {wallet.balance}
                  </div>
                  <div className="flex justify-between text-sm text-black">
                    <span>{wallet.currency}</span>
                    <span>Last: {wallet.lastActivity}</span>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button className="flex-1  text-white py-2 px-3 rounded-lg text-sm ">
                      View
                    </button>
                    <button className="flex-1 bg-black hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-sm transition-colors">
                      {wallet.status === "active" ? "Freeze" : "Unfreeze"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Reference
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-black">
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className=": transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                        {transaction.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-medium ${getTypeColor(
                            transaction.type
                          )}`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-black">
                        {transaction.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {transaction.reference}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}