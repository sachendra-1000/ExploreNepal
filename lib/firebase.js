import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  reload,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  updateProfile
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
  serverTimestamp
} from "firebase/firestore";

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
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// Configure Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Firestore exports
export { 
  app, 
  auth, 
  db,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  reload,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  updateProfile
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
  serverTimestamp
};
