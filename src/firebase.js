import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'; 
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


const app = initializeApp(firebaseConfig);


const auth = getAuth(app); 
const db = getFirestore(app); 

export { auth, db }; 
