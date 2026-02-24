// lib/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export const useUsers = (filters?: { role?: string; status?: string }) => {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: async () => {
      let q = query(collection(db, "users"));

      if (filters?.role) {
        q = query(q, where("role", "==", filters.role));
      }
      if (filters?.status) {
        q = query(q, where("status", "==", filters.status));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: Partial<User>;
    }) => {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { ...data, updatedAt: new Date() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
