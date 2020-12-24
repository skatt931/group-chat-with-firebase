import React from "react";

export function ChatMessage(props) {
  const {
    text,
    uid,
    photoURL,
    email,
    displayName,
    auth,
    firestore
  } = props.message;

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
