import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "inteviewiq-1fb11.firebaseapp.com",
  projectId: "inteviewiq-1fb11",
  storageBucket: "inteviewiq-1fb11.firebasestorage.app",
  messagingSenderId: "326692188921",
  appId: "1:326692188921:web:6e285dff14a776896a2828"
};


const app = initializeApp(firebaseConfig);
const auth =getAuth(app);
const provider=new GoogleAuthProvider();
export {auth,provider};
