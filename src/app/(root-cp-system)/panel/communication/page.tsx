"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Mic,
  X,
} from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "admin";
  time: string;
  status: "sent" | "delivered" | "read";
  type: "text" | "image";
  imageUrl?: string;
}

interface Chat {
  id: number;
  user: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: "online" | "offline";
  typing?: boolean;
}

export default function ChatPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chats: Chat[] = [
    {
      id: 1,
      user: "John Doe",
      avatar: "JD",
      lastMessage: "I need help with my loan application",
      time: "2 min ago",
      unread: 2,
      status: "online",
      typing: false,
    },
    {
      id: 2,
      user: "Sarah Wilson",
      avatar: "SW",
      lastMessage: "Thank you for your assistance!",
      time: "1 hour ago",
      unread: 0,
      status: "online",
    },
    {
      id: 3,
      user: "Mike Johnson",
      avatar: "MJ",
      lastMessage: "When will my withdrawal be processed?",
      time: "3 hours ago",
      unread: 1,
      status: "offline",
    },
    {
      id: 4,
      user: "Emily Brown",
      avatar: "EB",
      lastMessage: "Can I increase my loan limit?",
      time: "Yesterday",
      unread: 0,
      status: "offline",
    },
    {
      id: 5,
      user: "David Lee",
      avatar: "DL",
      lastMessage: "Payment confirmation received",
      time: "Yesterday",
      unread: 0,
      status: "online",
    },
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I have a question about my loan application status.",
      sender: "user",
      time: "2:30 PM",
      status: "read",
      type: "text",
    },
    {
      id: 2,
      text: "Hello John! I'd be happy to help you with that. Let me check your application status.",
      sender: "admin",
      time: "2:31 PM",
      status: "read",
      type: "text",
    },
    {
      id: 3,
      text: "Your loan application is currently under review. Our team will get back to you within 24 hours.",
      sender: "admin",
      time: "2:31 PM",
      status: "read",
      type: "text",
    },
    {
      id: 4,
      text: "Thank you! Is there anything else I need to provide?",
      sender: "user",
      time: "2:32 PM",
      status: "delivered",
      type: "text",
    },
    {
      id: 5,
      text: "I need help with my loan application",
      sender: "user",
      time: "2:35 PM",
      status: "sent",
      type: "text",
    },
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: message,
        sender: "admin",
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
        type: "text",
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentChat = chats.find((chat) => chat.id === selectedChat);

  const getStatusIcon = (status: string) => {
    if (status === "sent") return <Check size={16} className="text-gray-400" />;
    if (status === "delivered")
      return <CheckCheck size={16} className="text-gray-400" />;
    return <CheckCheck size={16} className="text-blue-500" />;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto h-full">
        <div className="backdrop-blur-xl bg-white/90 border border-white/20 rounded-2xl shadow-2xl overflow-hidden h-full flex">
          {/* Sidebar - Chat List */}
          <div
            className={`w-full md:w-96 border-r border-gray-200 flex flex-col bg-white/50 backdrop-blur-sm ${selectedChat ? "hidden md:flex" : "flex"
              }`}
          >
            {/* Sidebar Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600">
              <h1 className="text-2xl font-bold text-white mb-4">Messages</h1>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/90 backdrop-blur-sm border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-blue-50/50 ${selectedChat === chat.id
                      ? "bg-blue-50 border-l-4 border-l-blue-600"
                      : ""
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {chat.avatar}
                      </div>
                      {chat.status === "online" && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {chat.user}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {chat.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm truncate ${chat.unread > 0
                              ? "text-gray-900 font-semibold"
                              : "text-gray-600"
                            }`}
                        >
                          {chat.typing ? (
                            <span className="text-blue-600 italic">typing...</span>
                          ) : (
                            chat.lastMessage
                          )}
                        </p>
                        {chat.unread > 0 && (
                          <span className="ml-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          {selectedChat ? (
            <div className="flex-1 flex flex-col bg-gradient-to-br from-blue-50/30 to-purple-50/30">
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedChat(null)}
                      className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                        {currentChat?.avatar}
                      </div>
                      {currentChat?.status === "online" && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">
                        {currentChat?.user}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {currentChat?.status === "online"
                          ? "Active now"
                          : "Offline"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Phone size={20} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Video size={20} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreVertical size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"
                      } animate-messageSlide`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div
                      className={`max-w-[70%] md:max-w-[60%] ${msg.sender === "admin"
                          ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                          : "bg-white shadow-md"
                        } rounded-2xl px-4 py-3 transition-all hover:scale-[1.02]`}
                    >
                      <p
                        className={`text-sm md:text-base ${msg.sender === "admin" ? "text-white" : "text-gray-900"
                          }`}
                      >
                        {msg.text}
                      </p>
                      <div
                        className={`flex items-center justify-end gap-1 mt-1 ${msg.sender === "admin"
                            ? "text-blue-100"
                            : "text-gray-500"
                          }`}
                      >
                        <span className="text-xs">{msg.time}</span>
                        {msg.sender === "admin" && getStatusIcon(msg.status)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-end gap-2">
                  <div className="flex-1 bg-gray-50 rounded-2xl border-2 border-gray-200 focus-within:border-blue-500 transition-all">
                    <div className="flex items-center gap-2 px-4 py-2">
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <Smile size={20} className="text-gray-600" />
                      </button>
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-0 outline-none text-gray-900 placeholder-gray-500"
                      />
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <Paperclip size={20} className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {message.trim() ? (
                    <button
                      onClick={handleSendMessage}
                      className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"
                    >
                      <Send size={20} />
                    </button>
                  ) : (
                    <button className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95">
                      <Mic size={20} />
                    </button>
                  )}
                </div>

                {/* Emoji Picker Placeholder */}
                {showEmojiPicker && (
                  <div className="absolute bottom-20 left-4 bg-white rounded-xl shadow-2xl p-4 border border-gray-200 animate-slideUp">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">Emojis</h3>
                      <button
                        onClick={() => setShowEmojiPicker(false)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-8 gap-2">
                      {["😀", "😂", "😍", "🥰", "😎", "🤔", "👍", "❤️", "🎉", "✨", "🔥", "💯", "👏", "🙌", "💪", "🚀"].map(
                        (emoji) => (
                          <button
                            key={emoji}
                            onClick={() => {
                              setMessage(message + emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="text-2xl hover:bg-gray-100 rounded-lg p-2 transition-colors"
                          >
                            {emoji}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Empty State
            <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-50/30 to-purple-50/30">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Send size={48} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Select a conversation
                </h2>
                <p className="text-gray-600">
                  Choose a chat from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-messageSlide {
          animation: messageSlide 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}