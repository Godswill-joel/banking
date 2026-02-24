/* eslint-disable @typescript-eslint/no-explicit-any */
// firebaseTransactions.ts
import { doc, collection, setDoc, getDoc, updateDoc, serverTimestamp, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";

export const createTransaction = async (userId: string, tx: {
   type: "deposit" | "withdraw" | "received" | "transfer",
  amount: number,
  currency: "USD" | "BTC",
  status: "completed" | "pending" | "failed",
  date: string,
  description: string
}) => {
  const userRef = doc(db, "users", userId);
  const txRef = doc(collection(db, "transactions")); 

  await setDoc(txRef, {
    userId,
    type: tx.type,
    amount: tx.amount,
    currency: tx.currency,
    status: tx.status,
    date: tx.date,
    description: tx.description,
    createdAt: serverTimestamp(),
  });


  const userSnap = await getDoc(userRef);
  const currentBalance = userSnap.data()?.balance ?? 0;
  const newBalance =
    tx.type === "deposit"
      ? currentBalance + tx.amount
      : Math.max(0, currentBalance - tx.amount);

  await updateDoc(userRef, { balance: newBalance });

  return txRef.id;
};

export const fetchTransactions = async (userId: string) => {
  const q = query(collection(db, "transactions"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const txs: any[] = [];
  querySnapshot.forEach((doc) => {
    if (doc.data().userId === userId) {
      txs.push({ id: doc.id, ...doc.data() });
    }
  });
  return txs;
};
