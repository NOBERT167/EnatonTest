import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Message from "../components/Message";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Link from "next/link";

export default function dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);

  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  //delete post
  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div className="">
      <h1>Your posts</h1>
      <div>
        {posts.map((post) => (
          <Message {...post} key={post.id}>
            <div className="flex gap-4">
              <button
                onClick={() => deletePost(post.id)}
                className="flex items-center justify-center gap-2 text-sm py-2 text-red-600"
              >
                {" "}
                <BsTrash2Fill className="text-2xl" /> Delete
              </button>
              <Link href={{ pathname: "/post", query: post }}>
                <button className="flex items-center justify-center gap-2 text-sm py-2 text-teal-600">
                  {" "}
                  <AiFillEdit className="text-2xl" /> Edit
                </button>
              </Link>
            </div>
          </Message>
        ))}
        <button
          className="bg-gray-800 font-medium text-white py-2 px-4 rounded-lg my-6"
          onClick={() => auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
