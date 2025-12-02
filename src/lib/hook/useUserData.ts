import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  balance?: number;         
  bitcoinBalance?: number; 
  totalInvested?: number;
  activeLoans?: number;
  profileImage?: string | null;
  username?: string;
  phone?: string;
  country?: string;
  city?: string;
  walletAddress?: string;
  kycVerified?: boolean;
}

export function useUserData() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen to auth state
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setUserData(null);
        setLoading(false);
        setError(null);
        return;
      }

      // Listen to user's document in real time
      const userRef = doc(db, "users", currentUser.uid);

      const unsubscribeDoc = onSnapshot(
        userRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();

            setUserData({
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              email: data.email || currentUser.email || "",
              balance: data.balance || 0,
              bitcoinBalance: data.bitcoinBalance ?? 0,
              totalInvested: data.totalInvested ?? 0,
              activeLoans: data.activeLoans ?? 0,
              profileImage: data.profileImage || null,
              username: data.username || "",
              phone: data.phone || "",
              country: data.country || "",
              city: data.city || "",
              walletAddress: data.walletAddress || "",
              kycVerified: data.kycVerified || false,
            });

            setError(null);
          } else {
            setError("User profile not found in database.");
          }
          setLoading(false);
        },
        (err) => {
          console.error("Firestore error:", err);
          setError("Failed to load user data.");
          setLoading(false);
        }
      );

      // Cleanup document listener when auth user changes
      return () => unsubscribeDoc();
    });

    // Cleanup auth listener on unmount
    return () => unsubscribeAuth();
  }, []);

  return { user, userData, loading, error };
}