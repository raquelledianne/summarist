
"use client";

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyDR3la3XlS1YjBuHAkhYG_fsuRi-g0ppzs",
  authDomain: "summarist-b26b6.firebaseapp.com",
  projectId: "summarist-b26b6",
  storageBucket: "summarist-b26b6.appspot.com",
  messagingSenderId: "894408428128",
  appId: "1:894408428128:web:19a0f2853480de111d9105",
  measurementId: "G-Y9M9DRW7D2"
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();


export const db = getFirestore(app);