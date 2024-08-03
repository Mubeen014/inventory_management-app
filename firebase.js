// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3-x4eKbOaMjwcQ19LaEo8SXENRiSV_hE",
  authDomain: "inventory-management-app-1.firebaseapp.com",
  projectId: "inventory-management-app-1",
  storageBucket: "inventory-management-app-1.appspot.com",
  messagingSenderId: "571569250374",
  appId: "1:571569250374:web:ac878b230579afc943ea47",
  measurementId: "G-ZXPJ4DPDRP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };