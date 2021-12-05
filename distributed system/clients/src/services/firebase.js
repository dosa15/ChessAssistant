import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/auth";
// import "firebase/database";

const config = {
  apiKey: "AIzaSyD4ByfhAdgTcKys7hRM1p_OG-zm8nuaH9A",
  authDomain: "chessassistant-adams.firebaseapp.com",
  databaseURL: "https://chessassistant-adams-default-rtdb.firebaseio.com",
  projectId: "chessassistant-adams",
  storageBucket: "chessassistant-adams.appspot.com",
  messagingSenderId: "520343244676",
  appId: "1:520343244676:web:10fa9200f315beef8d57d1",
  measurementId: "G-Y1BKH1N7SE"
};

firebase.initializeApp(config);

export const auth = firebase.auth;
export const db = firebase.database();
