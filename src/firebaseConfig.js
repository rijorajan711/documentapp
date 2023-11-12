
import { initializeApp } from "firebase/app";


import {getAuth,GoogleAuthProvider} from "firebase/auth"


import { getFirestore } from "firebase/firestore";

import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey:"AIzaSyDQYTtdvRN7HUIXVukbyDvatmBp9OM1zfk",
  authDomain: "appfordoc-9cc95.firebaseapp.com",
  projectId: "appfordoc-9cc95",
  storageBucket: "appfordoc-9cc95.appspot.com",
  messagingSenderId: "54677826359",
  appId: "1:54677826359:web:6f9b428e6cc15ca2c288b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//user authentication with project 
export const auth=getAuth(app)
//crete a instance of google auth provider
export const  provider=new GoogleAuthProvider()

export const db = getFirestore(app);

export const storage=getStorage(app)