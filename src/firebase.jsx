import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // if you use Firestore

// add other SDKs here as required

const firebaseConfig = {
  apiKey: "AIzaSyCzQrBwQ0ROScCkboz8j_Q-pjdpzIPTMnY",
  authDomain: "diet294-8a782.firebaseapp.com",
  projectId: "diet294-8a782",
  storageBucket: "diet294-8a782.firebasestorage.app",
  messagingSenderId: "326925639976",
  appId: "1:326925639976:web:0c9ad0ae465e7ee221b01d",
  measurementId: "G-400ZJP2NZ6"
};

const app = initializeApp(firebaseConfig);

let analytics = null;
if (typeof window !== "undefined" && firebaseConfig.measurementId) {
  try {
    // import here to avoid analytics init errors in non-browser environments
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getAnalytics } = require("firebase/analytics");
    analytics = getAnalytics(app);
  } catch (err) {
    // ignore analytics initialization errors — keep auth/db usable
    // console.warn("Analytics not initialized:", err);
  }
}

const auth = getAuth(app);
const db = getFirestore(app); // if you need a database

// export whichever pieces you consume elsewhere
export { app, analytics, auth, db };
export default app;