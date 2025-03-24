import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQv4e-WgJ1Lo_dfUCTwprwHBCweoup0s4",
  authDomain: "cloud-computing-backend-d7702.firebaseapp.com",
  projectId: "cloud-computing-backend-d7702",
  storageBucket: "cloud-computing-backend-d7702.firebasestorage.app",
  messagingSenderId: "584760920305",
  appId: "1:584760920305:web:YOUR_APP_ID", // You'll need to replace this with your actual app ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage();
const storageRef = ref(storage, "");
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, storage, storageRef };
