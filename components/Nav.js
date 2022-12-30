import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Nav() {
  const [user, loading] = useAuthState(auth);

  return (
    <div className="bg-white">
      <nav className="flex justify-around items-center py-3">
        <Link href="/">
          <button className="text-lg font-medium">EnatonTest</button>
        </Link>
        <ul className="flex items-center gap-10">
          {user ? (
            <div className="flex items-center gap-6">
              <Link href={"/post"}>
                <a className="py-2 px-4 bg-cyan-600 rounded-lg text-white font-medium ml-8">
                  Post
                </a>
              </Link>
              <Link href={"/dashboard"}>
                <img
                  className="w-12 h-12 rounded-full cursor-pointer"
                  src={user.photoURL}
                  alt=""
                  srcset=""
                />
              </Link>
            </div>
          ) : (
            <div className="">
              <Link href={"/auth/login"}>
                <a className="py-2 px-4 bg-cyan-600 rounded-lg text-white font-medium ml-8">
                  Join Now
                </a>
              </Link>
            </div>
          )}
        </ul>
      </nav>
    </div>
  );
}
