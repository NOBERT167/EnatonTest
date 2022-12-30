import Message from "../components/Message";
import { Router, useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { db, auth } from "../utils/firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export default function Details() {
  const route = useRouter();
  const routeData = route.query;
  const [message, setMessage] = useState("");
  const [allMessage, setAllMessages] = useState([]);

  //submit a message
  const submitMessage = async () => {
    //Check if the user is logged in
    if (!auth.currentUser) {
      return route.push("/auth/login");
    }
    //Check if message is empty
    if (!message) {
      toast.error("Don't leave an empty message!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        username: auth.currentUser.displayName,
        timestamp: Timestamp.now(),
      }),
    });
    setMessage("");
  };
  //Get comments
  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllMessages(snapshot.data().comments);
    });
    return unsubscribe;
  };
  useEffect(() => {
    if (!route.isReady) return;
    getComments();
  }, [route.isReady]);

  return (
    <div className="">
      <Message {...routeData}></Message>
      <div className="my-4">
        <div className="flex ">
          <input
            type="text"
            className="bg-gray-800 w-full p-2 text-white text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your comment...😊"
          />
          <button
            onClick={submitMessage}
            className="bg-cyan-500 text-white px-2 py-4 text-sm"
          >
            Submit
          </button>
        </div>
        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {allMessage?.map((message) => (
            <div className="bg-white p-4 my-4 border-2" key={message.timestamp}>
              <div className="flex items-center gap-2 mb-4">
                <img
                  className="w-10 h-10 rounded-full"
                  src={message.avatar}
                  srcset=""
                />
                <h2>{message.username}</h2>
              </div>
              <h2>{message.message}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
