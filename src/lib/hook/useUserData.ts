import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";

export interface UserData {
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  address?: string;
  balance?: number;
  bitcoinBalance?: number;
  totalInvested?: number;
  activeLoans?: number;
  profileImage?: string | null;
  zipCode?: string;
  username?: string;
  phone?: string;
  country?: string;
  dateOfBirth?: string;
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
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setUserData(null);
        setLoading(false);
        return;
      }

      const userRef = doc(db, "users", currentUser.uid);

      const unsubscribeDoc = onSnapshot(
        userRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();

            setUserData({
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              fullName: `${data.firstName || ""} ${data.lastName || ""}`,
              email: data.email || currentUser.email || "",
              emailVerified: data.emailVerified ?? false,
              phoneVerified: data.phoneVerified ?? false,
              address: data.address || "",
              zipCode: data.zipCode || "",
              dateOfBirth: data.dateOfBirth || "",
              balance: Number(data.balance) || 0,
              bitcoinBalance: Number(data.bitcoinBalance) || 0,
              totalInvested: data.totalInvested ?? 0,
              activeLoans: data.activeLoans ?? 0,
              profileImage: data.profileImage || null,
              username: data.username || "",
              phone: data.phone || "",
              country: data.country || "",
              city: data.city || "",
              walletAddress: data.walletAddress || "",
              kycVerified: data.kycVerified ?? false,
            });

            setError(null);
          } else {
            setError("User profile not found.");
          }

          setLoading(false);
        },
        () => {
          setError("Failed to load user data.");
          setLoading(false);
        }
      );

      return () => unsubscribeDoc();
    });

    return () => unsubscribeAuth();
  }, []);

  return { user, userData, loading, error };
}