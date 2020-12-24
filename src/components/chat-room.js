import React, { useState, useRef } from "react";

import firebase from "firebase/app";

import { ChatMessage } from "../App";

export function ChatRoom({ firestore, auth, useCollectionData }) {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const dummyRef = useRef();

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL, displayName, email } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      displayName,
      email
    });

    setFormValue("");

    dummyRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div>
        {messages &&
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              messageId={msg.id}
              firestore={firestore}
            />
          ))}
      </div>

      <div ref={dummyRef}></div>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </>
  );
}
