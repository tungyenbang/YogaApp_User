// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
    apiKey: "AIzaSyDl92UEF34nNH4hgo879AgcBkCCyLbmBhs",
    authDomain: "courseapp-bee7c.firebaseapp.com",
    databaseURL: "",
    projectId: "courseapp-bee7c",
    storageBucket: "courseapp-bee7c.firebasestorage.app",
    messagingSenderId: "42334280748",
    appId: "1:42334280748:web:91fa73556711bcb0b64589"
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };