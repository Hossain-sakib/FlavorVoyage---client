// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD82ixAb3O1znCrfa-PokZ5TsXa99GqjhQ",
  authDomain: "flavor-voyage.firebaseapp.com",
  projectId: "flavor-voyage",
  storageBucket: "flavor-voyage.appspot.com",
  messagingSenderId: "310866340478",
  appId: "1:310866340478:web:8e8f1d8bcdca97e0fd462f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;