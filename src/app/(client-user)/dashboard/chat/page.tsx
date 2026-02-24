"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUserData } from "@/lib/hook/useUserData";
import { auth, db, storage } from "@/firebase/config";
import {
  collection, doc, addDoc, updateDoc, onSnapshot,
  query, orderBy, serverTimestamp, setDoc, getDoc, Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  Send, Image as ImageIcon, X, CheckCheck, Check,
  Paperclip, ArrowDown, Headphones,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

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

interface TypingStatus {
  isTyping: boolean;
  updatedAt: Timestamp;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(ts?: Timestamp) {
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

// ─── Main Component ────────────────────────────────────────────────────────────

export default function UserChatPage() {
  const { userData } = useUserData();
  const uid = auth.currentUser?.uid ?? "";
  const chatId = uid; // one chat per user

  const [messages, setMessages]       = useState<Message[]>([]);
  const [text, setText]               = useState("");
  const [sending, setSending]         = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const [imageFile, setImageFile]     = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [unread, setUnread]           = useState(0);

  const bottomRef   = useRef<HTMLDivElement>(null);
  const fileRef     = useRef<HTMLInputElement>(null);
  const textRef     = useRef<HTMLTextAreaElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef     = useRef<HTMLDivElement>(null);

  // ─── Scroll helpers ────────────────────────────────────────────────────────

  function scrollToBottom(smooth = true) {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  }

  function handleScroll() {
    const el = listRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setShowScrollBtn(!atBottom);
  }

  // ─── Ensure chat doc exists ────────────────────────────────────────────────

  useEffect(() => {
    if (!uid || !userData) return;
    const chatRef = doc(db, "chats", chatId);
    getDoc(chatRef).then((snap) => {
      if (!snap.exists()) {
        setDoc(chatRef, {
          userId: uid,
          userFullName: userData.fullName ?? `${userData.firstName} ${userData.lastName}`,
          userEmail: userData.email,
          userPhoto: userData.profileImage ?? null,
          lastMessage: null,
          lastMessageAt: null,
          unreadAdmin: 0,
          unreadUser: 0,
          createdAt: serverTimestamp(),
        });
      }
    });
  }, [uid, userData]);

  // ─── Listen to messages ────────────────────────────────────────────────────

  useEffect(() => {
    if (!chatId) return;
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Message));
      setMessages(msgs);
      // count unread from admin
      const unreadCount = msgs.filter((m) => m.senderId !== uid && !m.read).length;
      setUnread(unreadCount);
      setTimeout(() => scrollToBottom(false), 50);
    });
  }, [chatId]);

  // ─── Mark admin messages as read when visible ──────────────────────────────

  useEffect(() => {
    if (!chatId || messages.length === 0) return;
    const unreadMsgs = messages.filter((m) => m.senderId !== uid && !m.read);
    if (unreadMsgs.length === 0) return;
    unreadMsgs.forEach((m) => updateDoc(doc(db, "chats", chatId, "messages", m.id), { read: true }));
    updateDoc(doc(db, "chats", chatId), { unreadAdmin: 0 });
  }, [messages]);

  // ─── Listen to admin online status ────────────────────────────────────────

  useEffect(() => {
    return onSnapshot(doc(db, "status", "admin"), (snap) => {
      if (snap.exists()) setAdminOnline(snap.data().online === true);
    });
  }, []);

  // ─── Listen to admin typing ───────────────────────────────────────────────

  useEffect(() => {
    if (!chatId) return;
    return onSnapshot(doc(db, "chats", chatId, "typing", "admin"), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as TypingStatus;
        const fresh = data.updatedAt?.toDate && (Date.now() - data.updatedAt.toDate().getTime()) < 5000;
        setAdminTyping(data.isTyping && fresh);
      }
    });
  }, [chatId]);

  // ─── User typing indicator ─────────────────────────────────────────────────

  async function handleTyping() {
    if (!chatId) return;
    await setDoc(doc(db, "chats", chatId, "typing", "user"), { isTyping: true, updatedAt: serverTimestamp() });
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(async () => {
      await setDoc(doc(db, "chats", chatId, "typing", "user"), { isTyping: false, updatedAt: serverTimestamp() });
    }, 3000);
  }

  // ─── User online status ────────────────────────────────────────────────────

  useEffect(() => {
    if (!uid) return;
    const statusRef = doc(db, "status", uid);
    setDoc(statusRef, { online: true, updatedAt: serverTimestamp() });
    const handleUnload = () => setDoc(statusRef, { online: false, updatedAt: serverTimestamp() });
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      handleUnload();
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [uid]);

  // ─── Image picker ──────────────────────────────────────────────────────────

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  // ─── Send message ──────────────────────────────────────────────────────────

  async function sendMessage() {
    if ((!text.trim() && !imageFile) || sending) return;
    setSending(true);

    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        const storageRef = ref(storage, `chat-images/${chatId}/${Date.now()}-${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const msgData = {
        text: text.trim(),
        imageUrl: imageUrl ?? null,
        senderId: uid,
        senderName: userData?.firstName ?? "User",
        createdAt: serverTimestamp(),
        read: false,
        type: imageFile ? "image" : "text",
      };

      await addDoc(collection(db, "chats", chatId, "messages"), msgData);
      await updateDoc(doc(db, "chats", chatId), {
        lastMessage: imageFile ? "📷 Image" : text.trim(),
        lastMessageAt: serverTimestamp(),
        unreadAdmin: (messages.filter((m) => m.senderId !== uid && !m.read).length) + 1,
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

  const grouped = groupByDay(messages);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B4925B] to-[#8B7355] flex items-center justify-center shadow-md">
                <Headphones size={18} className="text-black" />
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black ${adminOnline ? "bg-green-400" : "bg-gray-600"}`} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Support Team</p>
              <p className={`text-xs ${adminOnline ? "text-green-400" : "text-gray-500"}`}>
                {adminOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#B4925B]/10 border border-[#B4925B]/20 flex items-center justify-center">
                <Headphones size={28} className="text-[#B4925B]" />
              </div>
              <p className="text-white font-semibold">Chat with Support</p>
              <p className="text-gray-500 text-sm max-w-xs">Send us a message and our team will respond as soon as possible.</p>
            </div>
          )}

          {grouped.map(({ day, messages: dayMsgs }) => (
            <div key={day} className="space-y-3">
              {/* Day divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-gray-600 text-xs px-2">{day}</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {dayMsgs.map((msg) => {
                const isMe = msg.senderId === uid;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] space-y-1 ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                      {/* Bubble */}
                      <div className={`rounded-2xl px-4 py-2.5 ${
                        isMe
                          ? "bg-gradient-to-br from-[#B4925B] to-[#8B7355] text-black rounded-br-sm"
                          : "bg-white/10 text-white rounded-bl-sm"
                      }`}>
                        {msg.imageUrl && (
                          <img
                            src={msg.imageUrl}
                            alt="attachment"
                            className="rounded-xl max-w-full max-h-60 object-cover mb-2 cursor-pointer"
                            onClick={() => window.open(msg.imageUrl, "_blank")}
                          />
                        )}
                        {msg.text && (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                        )}
                      </div>
                      {/* Meta */}
                      <div className={`flex items-center gap-1.5 px-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                        <span className="text-gray-600 text-xs">{formatTime(msg.createdAt)}</span>
                        {isMe && (
                          msg.read
                            ? <CheckCheck size={13} className="text-[#B4925B]" />
                            : <Check size={13} className="text-gray-500" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Typing indicator */}
          {adminTyping && (
            <div className="flex justify-start">
              <div className="bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollBtn && (
          <div className="absolute bottom-24 right-6">
            <button
              onClick={() => scrollToBottom()}
              className="relative w-10 h-10 bg-[#B4925B] rounded-full flex items-center justify-center shadow-lg hover:bg-[#8B7355] transition-colors"
            >
              <ArrowDown size={18} className="text-black" />
              {unread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {unread}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Image preview */}
        {imagePreview && (
          <div className="px-4 py-2 border-t border-white/10 bg-black/60">
            <div className="relative inline-block">
              <img src={imagePreview} alt="preview" className="h-20 rounded-xl object-cover" />
              <button
                onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="sticky bottom-0 bg-black/80 backdrop-blur-xl border-t border-white/10 px-4 py-3">
          <div className="flex items-end gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-[#B4925B] hover:border-[#B4925B]/40 transition-colors mb-0.5"
            >
              <Paperclip size={18} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImagePick} className="hidden" />

            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 focus-within:border-[#B4925B]/50 transition-colors">
              <textarea
                ref={textRef}
                value={text}
                onChange={(e) => { setText(e.target.value); handleTyping(); }}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="w-full bg-transparent text-white text-sm placeholder:text-gray-600 focus:outline-none resize-none max-h-32 leading-relaxed"
                style={{ height: "auto" }}
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
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#B4925B] to-[#8B7355] text-black hover:opacity-90 disabled:opacity-40 transition-all mb-0.5 shadow-md"
            >
              {sending
                ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                : <Send size={17} />
              }
            </button>
          </div>
          <p className="text-gray-700 text-xs text-center mt-2">Press Enter to send · Shift+Enter for new line</p>
        </div>

      </div>
    </div>
  );
}