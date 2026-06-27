import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  reload,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { 
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  limit
} from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDeIQqUj7SJD6bAEKzFfMKBg-ck8XmVufo",
  authDomain: "tourism-8b64b.firebaseapp.com",
  databaseURL: "https://tourism-8b64b-default-rtdb.firebaseio.com",
  projectId: "tourism-8b64b",
  storageBucket: "tourism-8b64b.firebasestorage.app",
  messagingSenderId: "595066154280",
  appId: "1:595066154280:web:d2f3ba1f630ac9894d741d",
  measurementId: "G-15C4DGGTTS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);

// Configure Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Exports
export { 
  app, 
  analytics,
  auth, 
  db,
  database,
  storage,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  reload,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  updateProfile,
  sendPasswordResetEmail
};

// Firestore helper exports
export {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  limit
};
