// Import Firebase core
import { initializeApp } from "firebase/app";

// Import services you are using
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// (Optional) Analytics
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9JLdXFqnswAEnEYXOEvUSga5X8RVVhXc",
  authDomain: "diet294.firebaseapp.com",
  projectId: "diet294",
  storageBucket: "diet294.firebasestorage.app",
  messagingSenderId: "284243218166",
  appId: "1:284243218166:web:190a015a789ec7ef6326d7",
  measurementId: "G-9YGS2PYNSM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Optional: Analytics (works only in production build)
const analytics = getAnalytics(app);              