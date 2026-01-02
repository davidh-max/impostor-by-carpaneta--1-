import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB89EzlhaObROtM1_ffieFM1rH3FKRq9gQ",
  authDomain: "impostorby-carpaneta.firebaseapp.com",
  projectId: "impostorby-carpaneta",
  storageBucket: "impostorby-carpaneta.firebasestorage.app",
  messagingSenderId: "134734890904",
  appId: "1:134734890904:web:129e8191f0e6f45ac00ded",
  measurementId: "G-D36Q663M7K"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

