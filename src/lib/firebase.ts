import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// The user must replace these with their actual Firebase config
export const firebaseConfig = {
  apiKey: "AIzaSyCyaHWOTBdpZMAbFQ0j1WE13nlghiiLtJE",
  authDomain: "operix-10367.firebaseapp.com",
  projectId: "operix-10367",
  storageBucket: "operix-10367.firebasestorage.app",
  messagingSenderId: "481433874715",
  appId: "1:481433874715:web:63f3d06faa44571be463be",
  measurementId: "G-HTZMPP92P0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
