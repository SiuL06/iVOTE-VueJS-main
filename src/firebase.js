import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'; // Import Firebase Auth
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZL28Y0Iipr7wsQA2E6R1eFV6xjgKIxPU",
  authDomain: "ivote-2fd0b.firebaseapp.com",
  databaseURL: "https://ivote-2fd0b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ivote-2fd0b",
  storageBucket: "ivote-2fd0b.firebasestorage.app",
  messagingSenderId: "1091981317033",
  appId: "1:1091981317033:web:780695ddcbc510f2fa2ab8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
const auth = getAuth(app); // Initialize Firebase Auth
const db = getFirestore(app); // Initialize Firestore if needed

export { auth, db }; // Export auth and db
