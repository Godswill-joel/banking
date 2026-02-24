"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUserData } from "@/lib/hook/useUserData";
import Image from "next/image";
import { auth, db } from "@/firebase/config";
import {
  collection, doc, addDoc, updateDoc, onSnapshot,
  query, orderBy, serverTimestamp, setDoc, getDoc, Timestamp,
} from "firebase/firestore";
import { Send, X, CheckCheck, Check, Paperclip, ArrowDown, Headphones } from "lucide-react";


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

function formatTime(ts?: Timestamp) {
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



export default function UserChatPage() {
  const { userData } = useUserData();
  const uid = auth.currentUser?.uid ?? "";
  const chatId = uid;

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [unread, setUnread] = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth = true) =>
    bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });

  // ensure chat doc
  useEffect(() => {
    if (!uid || !userData) return;
    getDoc(doc(db, "chats", chatId)).then((snap) => {
      if (!snap.exists()) {
        setDoc(doc(db, "chats", chatId), {
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
  }, [uid, userData, chatId]);


  useEffect(() => {
    if (!chatId) return;
    return onSnapshot(
      query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc")),
      (snap) => {
        const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Message));
        setMessages(msgs);
        setUnread(msgs.filter((m) => m.senderId !== uid && !m.read).length);
        setTimeout(() => scrollToBottom(false), 60);
      }
    );
  }, [chatId, uid]);

  // mark read
  useEffect(() => {
    if (!chatId) return;
    const unreadMsgs = messages.filter((m) => m.senderId !== uid && !m.read);
    if (!unreadMsgs.length) return;
    unreadMsgs.forEach((m) => updateDoc(doc(db, "chats", chatId, "messages", m.id), { read: true }));
    updateDoc(doc(db, "chats", chatId), { unreadAdmin: 0 });
  }, [messages, chatId, uid]);

  // admin online
  useEffect(() => onSnapshot(doc(db, "status", "admin"), (snap) => {
    if (snap.exists()) setAdminOnline(snap.data().online === true);
  }), []);

  // admin typing
  useEffect(() => {
    if (!chatId) return;
    return onSnapshot(doc(db, "chats", chatId, "typing", "admin"), (snap) => {
      if (!snap.exists()) return;
      const d = snap.data();
      const fresh = d.updatedAt?.toDate && Date.now() - d.updatedAt.toDate().getTime() < 5000;
      setAdminTyping(d.isTyping && fresh);
    });
  }, [chatId]);

  // user typing
  async function handleTyping() {
    if (!chatId) return;
    await setDoc(doc(db, "chats", chatId, "typing", "user"), { isTyping: true, updatedAt: serverTimestamp() });
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() =>
      setDoc(doc(db, "chats", chatId, "typing", "user"), { isTyping: false, updatedAt: serverTimestamp() }), 3000);
  }

  // user presence
  useEffect(() => {
    if (!uid) return;
    const r = doc(db, "status", uid);
    setDoc(r, { online: true, updatedAt: serverTimestamp() });
    const bye = () => setDoc(r, { online: false, updatedAt: serverTimestamp() });
    window.addEventListener("beforeunload", bye);
    return () => { bye(); window.removeEventListener("beforeunload", bye); };
  }, [uid]);

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function sendMessage() {
    if ((!text.trim() && !imageFile) || sending) return;
    setSending(true);
    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadToCloudinary(imageFile);
        setUploading(false);
      }
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: text.trim(), imageUrl, senderId: uid,
        senderName: userData?.firstName ?? "User",
        createdAt: serverTimestamp(), read: false,
        type: imageFile ? "image" : "text",
      });
      await updateDoc(doc(db, "chats", chatId), {
        lastMessage: imageFile ? "📷 Image" : text.trim(),
        lastMessageAt: serverTimestamp(),
        unreadAdmin: (messages.filter((m) => m.senderId !== uid && !m.read).length) + 1,
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

  const grouped = groupByDay(messages);

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full min-h-0">

        {/* Header */}
        <div className="flex-shrink-0 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B4925B] to-[#8B7355] flex items-center justify-center shadow-md">
                <Headphones size={18} className="text-black" />
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black ${adminOnline ? "bg-green-400" : "bg-gray-600"}`} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Support Team</p>
              <p className={`text-xs transition-all ${adminTyping ? "text-[#B4925B]" : adminOnline ? "text-green-400" : "text-gray-500"}`}>
                {adminTyping ? "Typing..." : adminOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={listRef}
          onScroll={() => {
            const el = listRef.current;
            if (!el) return;
            setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
          }}
          className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4"
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
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-gray-600 text-xs px-2">{day}</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              {dayMsgs.map((msg) => {
                const isMe = msg.senderId === uid;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] flex flex-col ${isMe ? "items-end" : "items-start"} space-y-1`}>
                      <div className={`rounded-2xl px-4 py-2.5 ${isMe ? "bg-gradient-to-br from-[#B4925B] to-[#8B7355] text-black rounded-br-sm" : "bg-white/10 text-white rounded-bl-sm"}`}>
                        {msg.imageUrl && (
                          <Image src={msg.imageUrl} alt="attachment"
                            width={200}
                            height={200}
                            className="rounded-xl max-w-full max-h-60 object-cover mb-2 cursor-pointer"
                            onClick={() => window.open(msg.imageUrl!, "_blank")} />
                        )}
                        {msg.text && <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>}
                      </div>
                      <div className={`flex items-center gap-1.5 px-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                        <span className="text-gray-600 text-xs">{formatTime(msg.createdAt)}</span>
                        {isMe && (msg.read
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

        {/* Scroll button */}
        {showScrollBtn && (
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10">
            <button onClick={() => scrollToBottom()}
              className="relative w-10 h-10 bg-[#B4925B] rounded-full flex items-center justify-center shadow-lg hover:bg-[#8B7355] transition-colors">
              <ArrowDown size={18} className="text-black" />
              {unread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Image preview */}
        {imagePreview && (
          <div className="flex-shrink-0 px-4 py-2 border-t border-white/10 bg-black/60">
            <div className="relative inline-block">
              <Image
                width={20}
                height={20}
                src={imagePreview} 
                alt="preview" 
                className="h-20 rounded-xl object-cover" />
              <button onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow">
                <X size={12} className="text-white" />
              </button>
            </div>
            {uploading && <p className="rounded-full animate-spin bg-amber-200"></p>}
          </div>
        )}

        {/* Input */}
        <div className="flex-shrink-0  backdrop-blur-xl border-t  px-4 py-3">
          <div className="flex items-end gap-2">
            <button onClick={() => fileRef.current?.click()}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-[#B4925B] hover:border-[#B4925B]/40 transition-colors mb-0.5">
              <Paperclip size={18} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImagePick} className="hidden" />
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 focus-within:border-[#B4925B]/50 transition-colors">
              <textarea
                value={text}
                onChange={(e) => { setText(e.target.value); handleTyping(); }}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="w-full bg-transparent text-white text-sm placeholder:text-gray-600 focus:outline-none resize-none max-h-32 leading-relaxed"
                onInput={(e) => {
                  const t = e.currentTarget;
                  t.style.height = "auto";
                  t.style.height = `${Math.min(t.scrollHeight, 128)}px`;
                }}
              />
            </div>
            <button onClick={sendMessage} disabled={(!text.trim() && !imageFile) || sending}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#B4925B] to-[#8B7355] text-black hover:opacity-90 disabled:opacity-40 transition-all mb-0.5 shadow-md">
              {sending
                ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                : <Send size={17} />}
            </button>
          </div>
          <p className="text-gray-700 text-xs text-center mt-2">Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}