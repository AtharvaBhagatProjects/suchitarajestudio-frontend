import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyB19jymXs8pDIWJYteivY3zpmafnYBW7Hg",
  authDomain: "suchitaraje-studio.firebaseapp.com",
  projectId: "suchitaraje-studio",
  storageBucket: "suchitaraje-studio.appspot.com",
  messagingSenderId: "548763153116",
  appId: "1:548763153116:web:bc7800967127c4bcdd3a19",
  measurementId: "G-YJX2W0T56R",
};

const iniApp = firebase.initializeApp(firebaseConfig);
firebase.analytics();

var db = iniApp.firestore();

export { db };
