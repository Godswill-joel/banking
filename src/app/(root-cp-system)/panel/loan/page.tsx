// app/admin/loans/page.tsx
"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign,
} from "lucide-react";

export default function LoansPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loans = [
    {
      id: 1,
      user: "John Doe",
      amount: "$15,000",
      purpose: "Home Renovation",
      term: "36 months",
      interestRate: "5.2%",
      status: "pending",
      appliedDate: "2024-01-15",
      creditScore: 720,
    },
    {
      id: 2,
      user: "Sarah Wilson",
      amount: "$8,500",
      purpose: "Business Expansion",
      term: "24 months",
      interestRate: "4.8%",
      status: "approved",
      appliedDate: "2024-01-14",
      creditScore: 780,
    },
    {
      id: 3,
      user: "Mike Johnson",
      amount: "$12,000",
      purpose: "Debt Consolidation",
      term: "48 months",
      interestRate: "6.1%",
      status: "rejected",
      appliedDate: "2024-01-13",
      creditScore: 650,
    },
    {
      id: 4,
      user: "Emily Brown",
      amount: "$25,000",
      purpose: "Education",
      term: "60 months",
      interestRate: "4.5%",
      status: "pending",
      appliedDate: "2024-01-12",
      creditScore: 690,
    },
  ];

  const stats = [
    {
      title: "Total Loans",
      value: "$2.4M",
      change: "+12%",
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      title: "Pending Review",
      value: "24",
      change: "+3",
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "Approval Rate",
      value: "78%",
      change: "+5%",
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      title: "Default Rate",
      value: "2.3%",
      change: "-0.5%",
      icon: AlertCircle,
      color: "bg-red-500",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    };
    return colors[status as keyof typeof colors];
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle,
      completed: CheckCircle,
    };
    return icons[status as keyof typeof icons];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Loan Management</h1>
          <p className="text-black mt-1">
            Review and manage loan applications
          </p>
        </div>
       
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-black mt-1">
                  {stat.value}
                </p>
                <p className="text-sm text-black mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full text-white`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border  p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
              size={20}
            />
            <input
              type="text"
              placeholder="Search loans by user or purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border text-black rounded-lg"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-black"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loans.map((loan) => {
                const StatusIcon = getStatusIcon(loan.status);
                return (
                  <tr
                    key={loan.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {loan.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-black">
                            {loan.user}
                          </div>
                          <div className="text-sm text-gray-500">
                            {loan.purpose}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-black">
                        {loan.amount}
                      </div>
                      <div className="text-sm text-gray-500">
                        {loan.term} • {loan.interestRate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`w-16 bg-gray-200 rounded-full h-2 mr-2 ${
                            loan.creditScore > 700
                              ? "bg-green-500"
                              : loan.creditScore > 650
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span className="text-sm text-black">
                          {loan.creditScore}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StatusIcon
                          size={16}
                          className={`mr-2 ${
                            loan.status === "pending"
                              ? "text-yellow-600"
                              : loan.status === "approved"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        />
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            loan.status
                          )}`}
                        >
                          {loan.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {loan.appliedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {loan.status === "pending" && (
                          <>
                            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
                              Approve
                            </button>
                            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">
                              Reject
                            </button>
                          </>
                        )}
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}