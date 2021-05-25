import firebase from "firebase";

const firebasApp = firebase.initializeApp({
    apiKey: "AIzaSyAUdP_lqRUCdo1GdqBiEPnQKXkLEMt8j3k",
    authDomain: "photo-mart.firebaseapp.com",
    projectId: "photo-mart",
    storageBucket: "photo-mart.appspot.com",
    messagingSenderId: "557704000447",
    appId: "1:557704000447:web:f97278491bffb6a040e70a"
})

const db = firebasApp.firestore();
export const auth = firebasApp.auth();
export const storage = firebase.storage();

export default db;