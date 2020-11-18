import React, { useState, useRef } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

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
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
  )
}
function SignOut() {
  return  auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign out</button>
  )
}

function ChatRoom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const dummyRef = useRef();

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const {uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummyRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </div>

      <div ref={dummyRef}></div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />

        <button type='submit'>Submit</button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
      <div className={`message ${messageClass}`}>
        <img src={photoURL} alt='avatar' />
        <p>{text}</p>
      </div>
    )
}

export default App;
