import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAapuZ0DpZpFqwCmmbqXyII8xVOFFkRsao", // TODO: Move to .env
  authDomain: "anime-recommendation-21fa8.firebaseapp.com",
  projectId: "anime-recommendation-21fa8",
  storageBucket: "anime-recommendation-21fa8.firebasestorage.app",
  messagingSenderId: "672145164969",
  appId: "1:672145164969:web:791dc15a57744f5dde77b8",
  measurementId: "G-WCWC24XF14",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
