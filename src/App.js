import React from "react";
import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { SignIn } from "./components/sign-in";
import { ChatRoom } from "./components/chat-room";

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyDYPDqpyNzDnZz9OQWJ7GyWwukcvyMMCjI",
    authDomain: "groupchat-ac451.firebaseapp.com",
    databaseURL: "https://groupchat-ac451.firebaseio.com",
    projectId: "groupchat-ac451",
    storageBucket: "groupchat-ac451.appspot.com",
    messagingSenderId: "438122286931",
    appId: "1:438122286931:web:2c5e0d15629abcf94a9ba6",
    measurementId: "G-1DW7ZT9DPG"
  });
}

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        <h1>⚛️🔥💬</h1>
        <SignOut auth={auth} />
      </header>

      <section>
        {user ? (
          <ChatRoom
            firestore={firestore}
            auth={auth}
            useCollectionData={useCollectionData}
          />
        ) : (
          <SignIn auth={auth} firebase={firebase} />
        )}
      </section>
    </div>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign out
      </button>
    )
  );
}

export function ChatMessage(props) {
  const { text, uid, photoURL, email, displayName } = props.message;

  const isOvnMessage = uid === auth.currentUser.uid;
  const messageClass = isOvnMessage ? "sent" : "received";

  const handleDeleteMessage = () => {
    firestore
      .collection("messages")
      .doc(props.messageId)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
    console.log(props.messageId);
  };

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} title={email} alt="avatar" />
      {isOvnMessage && <div onClick={handleDeleteMessage}>Delete</div>}
      <span>{displayName}</span>
      <p>{text}</p>
    </div>
  );
}

export default App;
