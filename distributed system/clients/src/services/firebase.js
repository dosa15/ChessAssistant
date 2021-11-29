import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/auth";
// import "firebase/database";

const config = {
  apiKey: "AIzaSyDzLZApIrnX6lEaLU2DzrTvwvAafRjm-E0",
  authDomain: "chessassistant-adam1.firebaseapp.com",
  databaseURL: "https://chessassistant-adam1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chessassistant-adam1",
  storageBucket: "chessassistant-adam1.appspot.com",
  messagingSenderId: "968793669366",
  appId: "1:968793669366:web:c3b759804ebba80ee276d7"
};

firebase.initializeApp(config);

export const auth = firebase.auth;
export const db = firebase.database();
