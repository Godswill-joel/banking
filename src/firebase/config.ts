'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTTNgZrChp9aZ6fQA8GP2BFA_6jlM1L0c",
  authDomain: "river-b7f8d.firebaseapp.com",
  projectId: "river-b7f8d",
  storageBucket: "river-b7f8d.firebasestorage.app",
  messagingSenderId: "723403321780",
  appId: "1:723403321780:web:c281758878acd63d9882e1",
  measurementId: "G-KCSVXT5422",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);

export async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}



