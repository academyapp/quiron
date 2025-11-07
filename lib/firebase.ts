// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCOoghctRGAFuSHNGn4hTprBtMvNS7adn4",
  authDomain: "quiron-4a2c6.firebaseapp.com",
  projectId: "quiron-4a2c6",
  storageBucket: "quiron-4a2c6.appspot.com",
  messagingSenderId: "176686160737",
  appId: "1:176686160737:web:cb8815defdd52d2522c320",
  measurementId: "G-R5SNH30N31"
};

// 🔥 Evita inicializar Firebase dos veces
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Exporta los servicios correctamente
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
