"use client";

import React, { useState, useEffect, useRef } from "react";
import { db, storage } from "@/firebase/config";
import {
  collection, doc, addDoc, updateDoc, onSnapshot, setDoc,
  query, orderBy, serverTimestamp, Timestamp, getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  Send, Image as ImageIcon, X, CheckCheck, Check,
  Paperclip, Search, ArrowLeft, Circle, Headphones,
  MessageCircle,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ChatMeta {
  id: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  userPhoto?: string | null;
  lastMessage?: string;
  lastMessageAt?: Timestamp;
  unreadAdmin?: number;
  unreadUser?: number;
}

interface Message {
  id: string;
  text: string;
  imageUrl?: string;
  senderId: string;
  senderName: string;
  createdAt: Timestamp;
  read: boolean;
  type: "text" | "image";
}

interface OnlineStatus {
  online: boolean;
  updatedAt?: Timestamp;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(ts?: Timestamp) {
  if (!ts) return "";
  const d = ts.toDate();
  const now = new Date();
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatFull(ts?: Timestamp) {
  if (!ts) return "";
  return ts.toDate().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function formatDay(ts?: Timestamp) {
  if (!ts) return "";
  const d = ts.toDate();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function groupByDay(messages: Message[]) {
  const groups: { day: string; messages: Message[] }[] = [];
  messages.forEach((msg) => {
    const day = formatDay(msg.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.day === day) last.messages.push(msg);
    else groups.push({ day, messages: [msg] });
  });
  return groups;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

// ─── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ name, photo, size = "md" }: { name: string; photo?: string | null; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-9 h-9 text-xs" : "w-10 h-10 text-sm";
  if (photo) return <img src={photo} alt={name} className={`${dim} rounded-full object-cover flex-shrink-0`} />;
  return (
    <div className={`${dim} rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0 font-bold text-gray-600`}>
      {getInitials(name)}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AdminChatPage() {
  const ADMIN_ID = "admin";

  const [chats, setChats]             = useState<ChatMeta[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatMeta | null>(null);
  const [messages, setMessages]       = useState<Message[]>([]);
  const [text, setText]               = useState("");
  const [sending, setSending]         = useState(false);
  const [search, setSearch]           = useState("");
  const [onlineMap, setOnlineMap]     = useState<Record<string, boolean>>({});
  const [userTyping, setUserTyping]   = useState(false);
  const [imageFile, setImageFile]     = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [mobileView, setMobileView]   = useState<"list" | "chat">("list");

  const bottomRef   = useRef<HTMLDivElement>(null);
  const fileRef     = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef     = useRef<HTMLDivElement>(null);

  function scrollToBottom(smooth = true) {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  }

  // ─── Admin online status ───────────────────────────────────────────────────

  useEffect(() => {
    setDoc(doc(db, "status", "admin"), { online: true, updatedAt: serverTimestamp() });
    const handleUnload = () => setDoc(doc(db, "status", "admin"), { online: false, updatedAt: serverTimestamp() });
    window.addEventListener("beforeunload", handleUnload);
    return () => { handleUnload(); window.removeEventListener("beforeunload", handleUnload); };
  }, []);

  // ─── Listen to all chats ───────────────────────────────────────────────────

  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("lastMessageAt", "desc"));
    return onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChatMeta));
      setChats(list);
      // fetch online status for each user
      list.forEach((c) => {
        onSnapshot(doc(db, "status", c.userId), (s) => {
          if (s.exists()) {
            const data = s.data() as OnlineStatus;
            setOnlineMap((prev) => ({ ...prev, [c.userId]: data.online === true }));
          }
        });
      });
    });
  }, []);

  // ─── Listen to messages of selected chat ──────────────────────────────────

  useEffect(() => {
    if (!selectedChat) return;
    const q = query(collection(db, "chats", selectedChat.id, "messages"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Message));
      setMessages(msgs);
      setTimeout(() => scrollToBottom(false), 50);
      // mark user messages as read
      msgs.filter((m) => m.senderId !== ADMIN_ID && !m.read).forEach((m) => {
        updateDoc(doc(db, "chats", selectedChat.id, "messages", m.id), { read: true });
      });
      updateDoc(doc(db, "chats", selectedChat.id), { unreadAdmin: 0 });
    });
  }, [selectedChat]);

  // ─── Listen to user typing ────────────────────────────────────────────────

  useEffect(() => {
    if (!selectedChat) return;
    return onSnapshot(doc(db, "chats", selectedChat.id, "typing", "user"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const fresh = data.updatedAt?.toDate && (Date.now() - data.updatedAt.toDate().getTime()) < 5000;
        setUserTyping(data.isTyping && fresh);
      }
    });
  }, [selectedChat]);

  // ─── Admin typing ─────────────────────────────────────────────────────────

  async function handleTyping() {
    if (!selectedChat) return;
    await setDoc(doc(db, "chats", selectedChat.id, "typing", "admin"), { isTyping: true, updatedAt: serverTimestamp() });
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(async () => {
      await setDoc(doc(db, "chats", selectedChat.id, "typing", "admin"), { isTyping: false, updatedAt: serverTimestamp() });
    }, 3000);
  }

  // ─── Image picker ──────────────────────────────────────────────────────────

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  // ─── Send ──────────────────────────────────────────────────────────────────

  async function sendMessage() {
    if ((!text.trim() && !imageFile) || !selectedChat || sending) return;
    setSending(true);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        const r = ref(storage, `chat-images/${selectedChat.id}/${Date.now()}-${imageFile.name}`);
        await uploadBytes(r, imageFile);
        imageUrl = await getDownloadURL(r);
      }
      await addDoc(collection(db, "chats", selectedChat.id, "messages"), {
        text: text.trim(),
        imageUrl: imageUrl ?? null,
        senderId: ADMIN_ID,
        senderName: "Support",
        createdAt: serverTimestamp(),
        read: false,
        type: imageFile ? "image" : "text",
      });
      const prevUnread = selectedChat.unreadUser ?? 0;
      await updateDoc(doc(db, "chats", selectedChat.id), {
        lastMessage: imageFile ? "📷 Image" : text.trim(),
        lastMessageAt: serverTimestamp(),
        unreadUser: prevUnread + 1,
      });
      setText("");
      setImageFile(null);
      setImagePreview(null);
      scrollToBottom();
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function selectChat(chat: ChatMeta) {
    setSelectedChat(chat);
    setMessages([]);
    setMobileView("chat");
  }

  const filteredChats = chats.filter((c) =>
    !search ||
    c.userFullName?.toLowerCase().includes(search.toLowerCase()) ||
    c.userEmail?.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = chats.reduce((s, c) => s + (c.unreadAdmin ?? 0), 0);
  const grouped = groupByDay(messages);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">

      {/* ── Sidebar (inbox) ── */}
      <div className={`${mobileView === "chat" ? "hidden" : "flex"} md:flex flex-col w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex-shrink-0`}>

        {/* Sidebar header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h1 className="text-gray-900 font-bold text-lg">Support Inbox</h1>
              {totalUnread > 0 && (
                <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {totalUnread > 9 ? "9+" : totalUnread}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
              <Circle size={8} className="fill-green-500 text-green-500" /> Admin Online
            </div>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-2 text-sm text-gray-700 focus:outline-none focus:border-amber-400 transition-colors placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <MessageCircle size={32} className="text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm">No conversations yet.</p>
            </div>
          )}
          {filteredChats.map((chat) => {
            const isSelected = selectedChat?.id === chat.id;
            const isOnline   = onlineMap[chat.userId] === true;
            return (
              <button
                key={chat.id}
                onClick={() => selectChat(chat)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 transition-colors text-left ${
                  isSelected ? "bg-amber-50 border-l-2 border-l-amber-400" : "hover:bg-gray-50"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <Avatar name={chat.userFullName} photo={chat.userPhoto} />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isOnline ? "bg-green-400" : "bg-gray-300"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900 text-sm font-semibold truncate">{chat.userFullName}</p>
                    <span className="text-gray-400 text-xs flex-shrink-0 ml-2">{formatTime(chat.lastMessageAt)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-gray-400 text-xs truncate">{chat.lastMessage || "No messages yet"}</p>
                    {(chat.unreadAdmin ?? 0) > 0 && (
                      <span className="flex-shrink-0 ml-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {chat.unreadAdmin}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Chat area ── */}
      <div className={`${mobileView === "list" ? "hidden" : "flex"} md:flex flex-1 flex-col min-w-0`}>

        {/* No chat selected */}
        {!selectedChat && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 bg-gray-50">
            <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
              <Headphones size={36} className="text-gray-300" />
            </div>
            <div>
              <p className="text-gray-700 font-semibold">No conversation selected</p>
              <p className="text-gray-400 text-sm mt-1">Pick a user from the inbox to start chatting.</p>
            </div>
          </div>
        )}

        {/* Chat thread */}
        {selectedChat && (
          <>
            {/* Chat header */}
            <div className="bg-white border-b border-gray-200 px-5 py-3.5 flex items-center gap-3 shadow-sm">
              <button onClick={() => setMobileView("list")} className="md:hidden p-1 text-gray-400 hover:text-gray-700 mr-1">
                <ArrowLeft size={20} />
              </button>
              <div className="relative">
                <Avatar name={selectedChat.userFullName} photo={selectedChat.userPhoto} />
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${onlineMap[selectedChat.userId] ? "bg-green-400" : "bg-gray-300"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-bold text-sm truncate">{selectedChat.userFullName}</p>
                <p className={`text-xs ${onlineMap[selectedChat.userId] ? "text-green-500" : "text-gray-400"}`}>
                  {onlineMap[selectedChat.userId] ? "Online" : "Offline"}
                  {userTyping && onlineMap[selectedChat.userId] && " · typing..."}
                </p>
              </div>
              <div className="text-xs text-gray-400 hidden md:block truncate max-w-[160px]">{selectedChat.userEmail}</div>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              onScroll={() => {
                const el = listRef.current;
                if (!el) return;
                setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
              }}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50"
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                    <MessageCircle size={22} className="text-amber-500" />
                  </div>
                  <p className="text-gray-500 text-sm">No messages yet. Say hello!</p>
                </div>
              )}

              {grouped.map(({ day, messages: dayMsgs }) => (
                <div key={day} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-gray-400 text-xs px-2">{day}</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  {dayMsgs.map((msg) => {
                    const isAdmin = msg.senderId === ADMIN_ID;
                    return (
                      <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] space-y-1 flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
                          <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                            isAdmin
                              ? "bg-amber-500 text-white rounded-br-sm"
                              : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                          }`}>
                            {msg.imageUrl && (
                              <img
                                src={msg.imageUrl}
                                alt="attachment"
                                className="rounded-xl max-w-full max-h-60 object-cover mb-2 cursor-pointer"
                                onClick={() => window.open(msg.imageUrl, "_blank")}
                              />
                            )}
                            {msg.text && <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>}
                          </div>
                          <div className={`flex items-center gap-1.5 px-1 ${isAdmin ? "flex-row-reverse" : "flex-row"}`}>
                            <span className="text-gray-400 text-xs">{formatFull(msg.createdAt)}</span>
                            {isAdmin && (
                              msg.read
                                ? <CheckCheck size={13} className="text-amber-500" />
                                : <Check size={13} className="text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* User typing */}
              {userTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Image preview */}
            {imagePreview && (
              <div className="px-4 py-2 border-t border-gray-200 bg-white">
                <div className="relative inline-block">
                  <img src={imagePreview} alt="preview" className="h-20 rounded-xl object-cover" />
                  <button
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow"
                  >
                    <X size={12} className="text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Input */}
            <div className="bg-white border-t border-gray-200 px-4 py-3">
              <div className="flex items-end gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 border border-gray-200 text-gray-400 hover:text-amber-600 hover:border-amber-300 transition-colors mb-0.5"
                >
                  <Paperclip size={18} />
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImagePick} className="hidden" />

                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:border-amber-400 transition-colors">
                  <textarea
                    value={text}
                    onChange={(e) => { setText(e.target.value); handleTyping(); }}
                    onKeyDown={handleKeyDown}
                    placeholder={`Reply to ${selectedChat.userFullName}...`}
                    rows={1}
                    className="w-full bg-transparent text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none resize-none max-h-32 leading-relaxed"
                    onInput={(e) => {
                      const t = e.currentTarget;
                      t.style.height = "auto";
                      t.style.height = `${Math.min(t.scrollHeight, 128)}px`;
                    }}
                  />
                </div>

                <button
                  onClick={sendMessage}
                  disabled={(!text.trim() && !imageFile) || sending}
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-40 transition-all mb-0.5 shadow-sm"
                >
                  {sending
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Send size={17} />
                  }
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}