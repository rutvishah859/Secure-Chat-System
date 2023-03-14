import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfvB3PR__Lm9sxdhC5MlSFiJayh0m9OS0",
  authDomain: "chat-system-7abae.firebaseapp.com",
  projectId: "chat-system-7abae",
  storageBucket: "chat-system-7abae.appspot.com",
  messagingSenderId: "466351630446",
  appId: "1:466351630446:web:e8f641b3ec1ea271925e7f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(); 
export const db = getFirestore(); 