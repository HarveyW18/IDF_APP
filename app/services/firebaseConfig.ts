import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBlQFS5msxKWvU1PlWnDtL_wx0dOthFPO8",
  authDomain: "helpmr-f958b.firebaseapp.com",
  projectId: "helpmr-f958b",
  storageBucket: "helpmr-f958b.appspot.com", 
  messagingSenderId: "938790536496",
  appId: "1:938790536496:web:41f1493e8bbf3453fc74f5",
  measurementId: "G-8N5EQCC3H8"
};

export const getFirebaseToken = async () => {
  const authInstance = getAuth();
  const user = authInstance.currentUser;

  if (user) {
      try {
          const token = await user.getIdToken(true); 
          console.log("🔥 Token Firebase :", token);
          return token;
      } catch (error) {
          console.error("❌ Erreur lors de la récupération du token Firebase :", error);
          return null;
      }
  } else {
      console.warn("⚠️ Aucun utilisateur connecté.");
      return null;
  }
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser les services Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
