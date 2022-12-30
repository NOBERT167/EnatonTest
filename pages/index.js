import Head from "next/head";
import Message from "../components/Message";
import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { AiOutlineComment } from "react-icons/ai";

export default function Home() {
  const [allPost, setAllPost] = useState([]);
  const getPost = async () => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPost(
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return unsubscribe;
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="my-12 text-lg font-medium">
        {allPost.map((post) => (
          <Message {...post} key={post.id}>
            <Link href={{ pathname: `/${post.id}`, query: { ...post } }}>
              <div className="flex items-center gap-2">
                <AiOutlineComment />
                <button className="text-sm text-gray-500">
                  {" "}
                  {post.comments?.length > 0 ? post.comments?.length : "0"}{" "}
                  Comments
                </button>
              </div>
            </Link>
          </Message>
        ))}
      </div>
    </div>
  );
}
