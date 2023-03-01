import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDg83RTYsimRYGCsBqk_t4DOE2ztZVJw8A",
  authDomain: "gpt3-messenger.firebaseapp.com",
  projectId: "gpt3-messenger",
  storageBucket: "gpt3-messenger.appspot.com",
  messagingSenderId: "155343288425",
  appId: "1:155343288425:web:aab811c703376eaad28af8",
  measurementId: "G-P4CW2J8E8N",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
