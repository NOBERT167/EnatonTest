import axios from "axios";
import { useEffect, useState } from "react";

export default function Message({ children, username, avatar, post }) {
  const [imageUrl, setImageUrl] = useState("");
  const randomNumber = Math.floor(Math.random() * 100);
  useEffect(() => {
    axios
      .get(`https://jsonplaceholder.typicode.com/photos/${randomNumber}`)
      .then((Response) => {
        console.log(Response.data);
        setImageUrl(Response.data.url);
      });
  }, []);

  return (
    <div className="bg-white p-8 shadow-lg mb-5 rounded-lg border">
      <div className="flex items-center gap-2">
        <img className="W-6 rounded-full" src={avatar} alt="" srcset="" />
        <p className="text-sm text-gray-600 font-normal">{username}</p>
      </div>
      <div className="py-4">
        <p className="font-normal text-lg">{post}</p>
        <img className="mt-3" src={imageUrl} alt="" srcset="" />
      </div>
      {children}
    </div>
  );
}
