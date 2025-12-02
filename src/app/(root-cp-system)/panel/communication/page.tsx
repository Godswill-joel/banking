// app/admin/communication/page.tsx
"use client";

import React, { useState } from "react";
import {
  Search,
  Send,
  Plus,
  Mail,
  MessageSquare,
  Bell,
  Users,
} from "lucide-react";

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState("email");
  const [message, setMessage] = useState("");

  const emails = [
    {
      id: 1,
      subject: "System Maintenance Notice",
      recipients: "All Users",
      status: "sent",
      date: "2024-01-15 14:30",
      opens: "1,245",
    },
    {
      id: 2,
      subject: "New Loan Products Available",
      recipients: "Premium Users",
      status: "draft",
      date: "2024-01-15 10:15",
      opens: "-",
    },
    {
      id: 3,
      subject: "Security Update Required",
      recipients: "Inactive Users",
      status: "scheduled",
      date: "2024-01-14 16:45",
      opens: "892",
    },
  ];

  const chats = [
    {
      id: 1,
      user: "John Doe",
      lastMessage: "Hello, I have a question about my loan application...",
      time: "2 min ago",
      unread: 2,
      status: "online",
    },
    {
      id: 2,
      user: "Sarah Wilson",
      lastMessage: "Thank you for your help!",
      time: "1 hour ago",
      unread: 0,
      status: "offline",
    },
    {
      id: 3,
      user: "Mike Johnson",
      lastMessage: "When will my withdrawal be processed?",
      time: "3 hours ago",
      unread: 1,
      status: "online",
    },
  ];

  const notifications = [
    {
      id: 1,
      title: "New Loan Application",
      message: "John Smith applied for a $15,000 loan",
      time: "5 min ago",
      type: "loan",
      read: false,
    },
    {
      id: 2,
      title: "KYC Verification",
      message: "Emily Brown's documents are pending review",
      time: "1 hour ago",
      type: "kyc",
      read: true,
    },
    {
      id: 3,
      title: "Withdrawal Request",
      message: "Large withdrawal request from Michael Chen",
      time: "2 hours ago",
      type: "withdrawal",
      read: true,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Communication Center
          </h1>
          <p className="text-gray-600 mt-1">
            Manage emails, chats, and notifications
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus size={20} />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: "email", name: "Email Campaigns", icon: Mail },
              { id: "chat", name: "Live Chat", icon: MessageSquare },
              { id: "notifications", name: "Notifications", icon: Bell },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon size={20} className="mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "email" && (
            <div className="space-y-6">
              {/* Email Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-900">24</div>
                  <div className="text-sm text-blue-700">Campaigns</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-900">68%</div>
                  <div className="text-sm text-green-700">Open Rate</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-900">12.5%</div>
                  <div className="text-sm text-purple-700">Click Rate</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-900">2.1%</div>
                  <div className="text-sm text-orange-700">Unsubscribe</div>
                </div>
              </div>

              {/* Email List */}
              <div className="space-y-4">
                {emails.map((email) => (
                  <div
                    key={email.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {email.subject}
                      </h3>
                      <p className="text-sm text-gray-600">
                        To: {email.recipients}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-900">{email.date}</div>
                      <div className="text-sm text-gray-600">
                        Opens: {email.opens}
                      </div>
                    </div>
                    <div className="ml-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          email.status === "sent"
                            ? "bg-green-100 text-green-800"
                            : email.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {email.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* New Email Form */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Compose New Email
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>All Users</option>
                    <option>Premium Users</option>
                    <option>Active Users</option>
                    <option>Specific Group</option>
                  </select>
                  <textarea
                    placeholder="Write your message here..."
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                  <div className="flex justify-end space-x-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Save Draft
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                      <Send size={16} />
                      <span>Send Email</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "chat" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat List */}
              <div className="lg:col-span-1 space-y-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <Users size={20} className="text-gray-600" />
                            </div>
                            <div
                              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                chat.status === "online"
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            ></div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {chat.user}
                            </div>
                            <div className="text-sm text-gray-600 truncate w-32">
                              {chat.lastMessage}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            {chat.time}
                          </div>
                          {chat.unread > 0 && (
                            <div className="inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full mt-1">
                              {chat.unread}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Window */}
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">JD</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        John Doe
                      </div>
                      <div className="text-sm text-green-600">Online</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-96">
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                      <p className="text-gray-900">
                        Hello, I have a question about my loan application
                        status.
                      </p>
                      <span className="text-xs text-gray-500 mt-1 block">
                        2:30 PM
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs">
                      <p>Hello John! I can check that for you.</p>
                      <span className="text-xs text-blue-100 mt-1 block">
                        2:31 PM
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4">
              {/* Notification Settings */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  Notification Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="text-blue-900">New Loan Applications</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                    <span className="text-blue-900">KYC Verifications</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                    <span className="text-blue-900">Large Transactions</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="text-blue-900">System Alerts</span>
                  </label>
                </div>
              </div>

              {/* Notifications List */}
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      notification.read
                        ? "bg-white border-gray-200"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {notification.time}
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            notification.type === "loan"
                              ? "bg-purple-100 text-purple-800"
                              : notification.type === "kyc"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {notification.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}