import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBlQFS5msxKWvU1PlWnDtL_wx0dOthFPO8",
  authDomain: "helpmr-f958b.firebaseapp.com",
  projectId: "helpmr-f958b",
  storageBucket: "helpmr-f958b.appspot.com", // Correction ici
  messagingSenderId: "938790536496",
  appId: "1:938790536496:web:41f1493e8bbf3453fc74f5",
  measurementId: "G-8N5EQCC3H8"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser les services Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
