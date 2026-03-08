// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
export const storage = getStorage(app);