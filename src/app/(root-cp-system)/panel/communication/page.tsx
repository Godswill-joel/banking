"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { db } from "@/firebase/config";
import {
  collection, doc, addDoc, updateDoc, onSnapshot, setDoc, getDoc,
  query, orderBy, serverTimestamp, Timestamp
} from "firebase/firestore";
import {
  Send, X, CheckCheck, Check, Paperclip, Search,
  ArrowLeft, Circle, Headphones, MessageCircle, Users,
} from "lucide-react";

const CLOUD_NAME = "dvoyvhkjp";
const UPLOAD_PRESET = "DND-Homes";

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("resource_type", "auto");
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
    method: "POST", body: formData,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const data = await res.json();
  if (data.secure_url) return data.secure_url;
  throw new Error(`Upload failed: ${JSON.stringify(data)}`);
}

interface UserRecord {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  profileImage?: string | null;
}

interface ChatMeta {
  id: string; // same as userId
  userId: string;
  userFullName: string;
  userEmail: string;
  userPhoto?: string | null;
  lastMessage?: string | null;
  lastMessageAt?: Timestamp | null;
  unreadAdmin?: number;
  unreadUser?: number;
}

interface Message {
  id: string;
  text: string;
  imageUrl?: string | null;
  senderId: string;
  senderName: string;
  createdAt: Timestamp;
  read: boolean;
  type: "text" | "image";
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(ts?: Timestamp | null) {
  if (!ts) return "";
  const d = ts.toDate(), now = new Date();
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
  const d = ts.toDate(), today = new Date(), yest = new Date(today);
  yest.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yest.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function groupByDay(msgs: Message[]) {
  const groups: { day: string; messages: Message[] }[] = [];
  msgs.forEach((m) => {
    const day = formatDay(m.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.day === day) last.messages.push(m);
    else groups.push({ day, messages: [m] });
  });
  return groups;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function Avatar({ name, photo, size = "md" }: { name: string; photo?: string | null; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "w-9 h-9 text-xs" : "w-10 h-10 text-sm";
  if (photo) return <Image
    src={photo}
    width={200}
    height={200}
    alt={name}
    className={`${cls} rounded-full object-cover flex-shrink-0`} />;
  return (
    <div className={`${cls} rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0 font-bold text-amber-700`}>
      {getInitials(name)}
    </div>
  );
}

type Tab = "chats" | "users";

export default function AdminChatPage() {
  const ADMIN_ID = "admin";

  const [tab, setTab] = useState<Tab>("chats");
  const [allUsers, setAllUsers] = useState<UserRecord[]>([]);
  const [chatMap, setChatMap] = useState<Record<string, ChatMeta>>({});
  const [selectedChat, setSelectedChat] = useState<ChatMeta | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [onlineMap, setOnlineMap] = useState<Record<string, boolean>>({});
  const [userTyping, setUserTyping] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth = true) =>
    bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });

  useEffect(() => {
    setDoc(doc(db, "status", "admin"), { online: true, updatedAt: serverTimestamp() });
    const bye = () => setDoc(doc(db, "status", "admin"), { online: false, updatedAt: serverTimestamp() });
    window.addEventListener("beforeunload", bye);
    return () => { bye(); window.removeEventListener("beforeunload", bye); };
  }, []);

  // ─── Fetch ALL users from Firestore ──────────────────────────────────────────
  useEffect(() => {
    return onSnapshot(collection(db, "users"), (snap) => {
      const users = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          fullName: data.fullName ?? `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim(),
          email: data.email ?? "",
          profileImage: data.profileImage ?? null,
        } as UserRecord;
      });
      setAllUsers(users);

      // watch online status per user
      users.forEach((u) => {
        onSnapshot(doc(db, "status", u.id), (s) => {
          if (s.exists()) setOnlineMap((prev) => ({ ...prev, [u.id]: s.data().online === true }));
        });
      });
    });
  }, []);

  // ─── Listen to all existing chats ────────────────────────────────────────────
  useEffect(() => {
    return onSnapshot(
      query(collection(db, "chats"), orderBy("lastMessageAt", "desc")),
      (snap) => {
        const map: Record<string, ChatMeta> = {};
        snap.docs.forEach((d) => { map[d.id] = { id: d.id, ...d.data() } as ChatMeta; });
        setChatMap(map);
      }
    );
  }, []);

  // ─── Listen to messages of selected chat ────────────────────────────────────
  useEffect(() => {
    if (!selectedChat) return;
    return onSnapshot(
      query(collection(db, "chats", selectedChat.id, "messages"), orderBy("createdAt", "asc")),
      (snap) => {
        const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Message));
        setMessages(msgs);
        setTimeout(() => scrollToBottom(false), 60);
        msgs.filter((m) => m.senderId !== ADMIN_ID && !m.read).forEach((m) =>
          updateDoc(doc(db, "chats", selectedChat.id, "messages", m.id), { read: true })
        );
        updateDoc(doc(db, "chats", selectedChat.id), { unreadAdmin: 0 }).catch(() => { });
      }
    );
  }, [selectedChat]);

  // ─── User typing listener ────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedChat) return;
    return onSnapshot(doc(db, "chats", selectedChat.id, "typing", "user"), (snap) => {
      if (!snap.exists()) return;
      const d = snap.data();
      const fresh = d.updatedAt?.toDate && Date.now() - d.updatedAt.toDate().getTime() < 5000;
      setUserTyping(d.isTyping && fresh);
    });
  }, [selectedChat]);

  // ─── Admin typing ────────────────────────────────────────────────────────────
  async function handleTyping() {
    if (!selectedChat) return;
    await setDoc(doc(db, "chats", selectedChat.id, "typing", "admin"), {
      isTyping: true, updatedAt: serverTimestamp(),
    });
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() =>
      setDoc(doc(db, "chats", selectedChat.id, "typing", "admin"), {
        isTyping: false, updatedAt: serverTimestamp(),
      }), 3000);
  }

  // ─── Select a user (create chat doc if missing) ───────────────────────────────
  async function selectUser(user: UserRecord) {
    const chatId = user.id;
    const chatRef = doc(db, "chats", chatId);
    const snap = await getDoc(chatRef);

    if (!snap.exists()) {
      await setDoc(chatRef, {
        userId: user.id,
        userFullName: user.fullName ?? `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        userPhoto: user.profileImage ?? null,
        lastMessage: null,
        lastMessageAt: null,
        unreadAdmin: 0,
        unreadUser: 0,
        createdAt: serverTimestamp(),
      });
    }

    const chat: ChatMeta = snap.exists()
      ? { id: snap.id, ...snap.data() } as ChatMeta
      : {
        id: chatId,
        userId: user.id,
        userFullName: user.fullName ?? `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        userPhoto: user.profileImage ?? null,
        lastMessage: null,
        lastMessageAt: null,
        unreadAdmin: 0,
        unreadUser: 0,
      };

    setMessages([]);
    setSelectedChat(chat);
    setMobileView("chat");
    setTab("chats");
  }

  // ─── Image pick ──────────────────────────────────────────────────────────────
  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  // ─── Send message ────────────────────────────────────────────────────────────
  async function sendMessage() {
    if ((!text.trim() && !imageFile) || !selectedChat || sending) return;
    setSending(true);
    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadToCloudinary(imageFile);
        setUploading(false);
      }
      await addDoc(collection(db, "chats", selectedChat.id, "messages"), {
        text: text.trim(), imageUrl, senderId: ADMIN_ID,
        senderName: "Support", createdAt: serverTimestamp(),
        read: false, type: imageFile ? "image" : "text",
      });
      await updateDoc(doc(db, "chats", selectedChat.id), {
        lastMessage: imageFile ? "📷 Image" : text.trim(),
        lastMessageAt: serverTimestamp(),
        unreadUser: (selectedChat.unreadUser ?? 0) + 1,
      });
      setText(""); setImageFile(null); setImagePreview(null);
      scrollToBottom();
    } catch (err) {
      console.error("Send error:", err);
      setUploading(false);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  // ─── Derived lists ────────────────────────────────────────────────────────────

  // Chats tab: users who have a chat doc, sorted by last message
  const chatList: ChatMeta[] = allUsers
    .filter((u) => chatMap[u.id])
    .map((u) => chatMap[u.id])
    .sort((a, b) => {
      const at = a.lastMessageAt?.seconds ?? 0;
      const bt = b.lastMessageAt?.seconds ?? 0;
      return bt - at;
    });

  // Users tab: all users, sorted alphabetically
  const userList = allUsers
    .slice()
    .sort((a, b) => (a.fullName ?? "").localeCompare(b.fullName ?? ""));

  const q = search.toLowerCase();
  const filteredChats = chatList.filter(
    (c) => !search || c.userFullName?.toLowerCase().includes(q) || c.userEmail?.toLowerCase().includes(q)
  );
  const filteredUsers = userList.filter(
    (u) => !search || (u.fullName ?? "").toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
  );

  const totalUnread = chatList.reduce((s, c) => s + (c.unreadAdmin ?? 0), 0);
  const grouped = groupByDay(messages);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">

      {/* ── Sidebar ── */}
      <div className={`${mobileView === "chat" ? "hidden" : "flex"} md:flex flex-col w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex-shrink-0`}>

        {/* Sidebar header */}
        <div className="px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h1 className="text-gray-900 font-bold text-lg">Messages</h1>
              {totalUnread > 0 && (
                <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {totalUnread > 9 ? "9+" : totalUnread}
                </span>
              )}
            </div>
            <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
              <Circle size={8} className="fill-green-500 text-green-500" /> Online
            </span>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-3">
            {([
              { key: "chats", label: "Chats", icon: MessageCircle },
              { key: "users", label: "All Users", icon: Users },
            ] as { key: Tab; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => { setTab(key); setSearch(""); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${tab === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tab === "chats" ? "Search conversations..." : "Search users..."}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-2 text-sm text-gray-700 focus:outline-none focus:border-amber-400 transition-colors placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Chats tab ── */}
          {tab === "chats" && (
            <>
              {filteredChats.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4 gap-2">
                  <MessageCircle size={28} className="text-gray-200" />
                  <p className="text-gray-400 text-sm">No conversations yet.</p>
                  <button onClick={() => setTab("users")} className="text-amber-500 text-xs font-semibold hover:underline">
                    Start one from All Users →
                  </button>
                </div>
              )}
              {filteredChats.map((chat) => {
                const isSelected = selectedChat?.id === chat.id;
                const isOnline = onlineMap[chat.userId] === true;
                return (
                  <button key={chat.id} onClick={() => { setSelectedChat(chat); setMessages([]); setMobileView("chat"); }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 transition-colors text-left ${isSelected ? "bg-amber-50 border-l-2 border-l-amber-400" : "hover:bg-gray-50"
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
                        <p className="text-gray-400 text-xs truncate">{chat.lastMessage ?? "No messages yet"}</p>
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
            </>
          )}

          {/* ── Users tab ── */}
          {tab === "users" && (
            <>
              <div className="px-4 py-2.5 border-b border-gray-100">
                <p className="text-xs text-gray-400">{filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} in system</p>
              </div>
              {filteredUsers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4 gap-2">
                  <Users size={28} className="text-gray-200" />
                  <p className="text-gray-400 text-sm">No users found.</p>
                </div>
              )}
              {filteredUsers.map((user) => {
                const isOnline = onlineMap[user.id] === true;
                const hasChat = !!chatMap[user.id];
                const unreadCount = chatMap[user.id]?.unreadAdmin ?? 0;
                const isSelected = selectedChat?.id === user.id;
                return (
                  <button key={user.id} onClick={() => selectUser(user)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 transition-colors text-left ${isSelected ? "bg-amber-50 border-l-2 border-l-amber-400" : "hover:bg-gray-50"
                      }`}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar name={user.fullName ?? `${user.firstName} ${user.lastName}`} photo={user.profileImage} />
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isOnline ? "bg-green-400" : "bg-gray-300"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-900 text-sm font-semibold truncate">
                          {user.fullName ?? `${user.firstName} ${user.lastName}`}
                        </p>
                        {unreadCount > 0 && (
                          <span className="flex-shrink-0 ml-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-gray-400 text-xs truncate">{user.email}</p>
                        {hasChat && <span className="flex-shrink-0 text-xs text-emerald-500 font-medium">· active</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* ── Chat area ── */}
      <div className={`${mobileView === "list" ? "hidden" : "flex"} md:flex flex-1 flex-col min-w-0`}>

        {/* No selection */}
        {!selectedChat && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 bg-gray-50">
            <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
              <Headphones size={36} className="text-gray-300" />
            </div>
            <div>
              <p className="text-gray-700 font-semibold">No conversation selected</p>
              <p className="text-gray-400 text-sm mt-1">Pick a user from the sidebar to start chatting.</p>
            </div>
          </div>
        )}

        {/* Thread */}
        {selectedChat && (
          <>
            {/* Thread header */}
            <div className="bg-white border-b border-gray-200 px-5 py-3.5 flex items-center gap-3 shadow-sm flex-shrink-0">
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
                  {userTyping && onlineMap[selectedChat.userId] ? "Typing..." : onlineMap[selectedChat.userId] ? "Online" : "Offline"}
                </p>
              </div>
              <p className="text-xs text-gray-400 hidden md:block truncate max-w-[160px]">{selectedChat.userEmail}</p>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center">
                    <MessageCircle size={22} className="text-amber-400" />
                  </div>
                  <p className="text-gray-400 text-sm">No messages yet. Say hello!</p>
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
                        <div className={`max-w-[70%] flex flex-col ${isAdmin ? "items-end" : "items-start"} space-y-1`}>
                          <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${isAdmin
                            ? "bg-amber-500 text-white rounded-br-sm"
                            : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                            }`}>
                            {msg.imageUrl && (
                              <Image
                                alt="attachment"
                                width={200}
                                height={200}
                                src={msg.imageUrl}
                                className="rounded-xl p-0 max-w-full max-h-60 object-cover mb-2 cursor-pointer"
                                onClick={() => window.open(msg.imageUrl!, "_blank")} />
                            )}
                            {msg.text && <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>}
                          </div>
                          <div className={`flex items-center gap-1.5 px-1 ${isAdmin ? "flex-row-reverse" : "flex-row"}`}>
                            <span className="text-gray-400 text-xs">{formatFull(msg.createdAt)}</span>
                            {isAdmin && (msg.read
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
              <div className="flex-shrink-0 px-4 py-2 border-t border-gray-200 bg-white">
                <div className="relative inline-block">
                  <Image
                    width={150}
                    height={150}
                    src={imagePreview}
                    alt="preview"
                    className="rounded-xl object-cover" />
                  <button onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow">
                    <X size={12} className="text-white" />
                  </button>
                </div>
                {uploading && <p className="rounded-full animate-spin"></p>}
              </div>
            )}

            {/* Input */}
            <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-3">
              <div className="flex items-end gap-2">
                <button onClick={() => fileRef.current?.click()}
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 border border-gray-200 text-gray-400 hover:text-amber-600 hover:border-amber-300 transition-colors mb-0.5">
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
                <button onClick={sendMessage} disabled={(!text.trim() && !imageFile) || sending}
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-40 transition-all mb-0.5 shadow-sm">
                  {sending
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Send size={17} />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}