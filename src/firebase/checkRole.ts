// firebase/checkUserRole.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "./config";

export async function getUserRole(
  uid: string
): Promise<"user" | "admin" | "support" | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data().role as "user" | "admin" | "support" | null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}
