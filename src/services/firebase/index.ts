// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-li  braries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGGw0Irq4Od5tdnEaZv5Di8DSBDd0Nlg4",
  authDomain: "music-app-native.firebaseapp.com",
  projectId: "music-app-native",
  storageBucket: "music-app-native.appspot.com",
  messagingSenderId: "955188493443",
  appId: "1:955188493443:web:4dc34cd256d777e14dafb6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
