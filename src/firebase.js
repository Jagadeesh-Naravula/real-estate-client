// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-27290.firebaseapp.com",
  projectId: "mern-estate-27290",
  storageBucket: "mern-estate-27290.appspot.com",
  messagingSenderId: "963887199129",
  appId: "1:963887199129:web:71102ceca41ff3e2315908"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);