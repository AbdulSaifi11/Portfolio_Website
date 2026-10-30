// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPgIJ0aIjV3RRgHhCAdjoC28hJq-ml-Zg",
  authDomain: "portfolio1-1bb4d.firebaseapp.com",
  projectId: "portfolio1-1bb4d",
  storageBucket: "portfolio1-1bb4d.firebasestorage.app",
  messagingSenderId: "194703666759",
  appId: "1:194703666759:web:b27bd6933bd6d6dee68b62"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
