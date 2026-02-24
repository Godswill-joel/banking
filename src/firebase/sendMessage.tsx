/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/firebaseChat.ts
import { db } from "@/firebase/config";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  setDoc,
  increment,
} from "firebase/firestore";

// Get all active chats for admin panel (real-time)
export function listenToUserChats(
  callback: (chats: any[]) => void
) {
  const q = query(
    collection(db, "chats"),
    orderBy("lastMessageTime", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(chats);
  });
}

// Listen to messages in a specific user's chat
export function listenToMessages(
  userId: string,
  callback: (messages: any[]) => void
) {
  const messagesRef = collection(db, "chats", userId, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));

  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(msgs);

    // Mark all user messages as "read" when admin views
    snapshot.docs.forEach(async (messageDoc) => {
      const data = messageDoc.data();
      if (data.sender === "user" && data.status !== "read") {
        await updateDoc(messageDoc.ref, { status: "read" });
      }
    });
  });
}

// Send message as admin
export async function sendMessage(
  userId: string,
  text: string
) {
  const chatRef = doc(db, "chats", userId);
  const messagesRef = collection(db, "chats", userId, "messages");

  // Add message
  await addDoc(messagesRef, {
    text,
    sender: "admin",
    timestamp: serverTimestamp(),
    status: "sent",
  });

  // Update chat metadata
  await setDoc(chatRef, {
    lastMessage: text,
    lastMessageTime: serverTimestamp(),
    lastMessageByUser: false,
    unreadCount: increment(1), // increment unread for user
  }, { merge: true });
}

// Optional: Mark admin's message as delivered (simulate)
export async function markAsDelivered(userId: string, messageId: string) {
  const msgRef = doc(db, "chats", userId, "messages", messageId);
  await updateDoc(msgRef, { status: "delivered" });
}