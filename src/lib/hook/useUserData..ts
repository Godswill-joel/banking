import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  balanceUSD: number;
  bitcoinBalance: number;
  totalInvested: number;
  activeLoans: number;
  profileImage?: string;
}

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }

      const userRef = doc(db, "users", user.uid);

      const unsubscribeDoc = onSnapshot(
        userRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
            setError(null);
          } else {
            setError("User profile not found.");
          }
          setLoading(false);
        },
        (err) => {
          console.error("Firestore error:", err);
          setError("Failed to load user data.");
          setLoading(false);
        }
      );

      return () => unsubscribeDoc();
    });

    return () => unsubscribeAuth();
  }, []);

  return { userData, loading, error };
}
