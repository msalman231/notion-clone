// Import the functions you need from the SDKs you need
import { getApp, initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmM_cwXumBjdOUv1Q8rqwZdvNiOBYr0v8",
  authDomain: "notion-clone-d328f.firebaseapp.com",
  projectId: "notion-clone-d328f",
  storageBucket: "notion-clone-d328f.firebasestorage.app",
  messagingSenderId: "1069353757162",
  appId: "1:1069353757162:web:d5c7847dd798a2cfff2a93"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp(); 
const db = getFirestore(app);

export {db};
