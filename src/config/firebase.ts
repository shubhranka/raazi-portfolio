// firebase.js
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "raazi-a764f.firebaseapp.com",
  projectId: "raazi-a764f",
  storageBucket: "raazi-a764f.firebasestorage.app",
  messagingSenderId: "545663229970",
  appId: "1:545663229970:web:6e95ae61344c50baba78cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };