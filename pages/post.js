import { auth } from "../utils/firebase";
import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Router, useRouter } from "next/router";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

export default function post() {
  const [post, setPost] = useState("");

  const [user, loading] = useAuthState(auth);

  const route = useRouter();

  const routeData = route.query;

  //submit post
  const submitPost = async (e) => {
    e.preventDefault();
    //Running checks before post submission
    if (!post) {
      toast.error("Description field empty 😒", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });

      return;
    }
    if (post.length > 300) {
      toast.error("Description too long🤦‍♂️", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });

      return;
    }
    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      return route.push("/");
    } else {
      // Make a new post
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });
      setPost((post = ""));
      toast.success("Post has been made 👌", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return route.push("/");
    }
  };

  //check our user
  const checkUser = async () => {
    if (loading) {
      return;
    }
    if (!user) {
      route.push("/auth/login");
    }
    if (routeData.id) {
      setPost({ post: routeData.post, id: routeData.id });
    }
  };
  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-bold">
          {" "}
          {routeData.id ? "Update your post" : "Create a new post"}
        </h1>
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Description</h3>
          <textarea
            onChange={(e) => setPost(e.target.value)}
            value={post}
            className="bg-gray-800 h-40 w-full rounded-lg text-white text-sm p-2"
          ></textarea>
          <p
            className={`${
              post.length > 300 ? "text-red-500" : "text-cyan-400"
            }`}
          >
            {post.length}/300
          </p>
          <button
            type="submit"
            className="w-full bg-cyan-700 font-medium text-white p-2 my-2 rounded-lg text-sm"
          >
            {routeData.id ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
