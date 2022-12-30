// import GoogleIcon from "@mui/icons-material/Google";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const route = useRouter();

  const [user, loading] = useAuthState(auth);

  //sigin with google
  const googleProvider = new GoogleAuthProvider();
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      //   route.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    user ? route.push("/") : console.log("login");
  }, [user]);

  return (
    <div className="shadow-xl mt-32 p-10 text-gray-700">
      <h2 className="text-2xl font-medium">Join today</h2>
      <div className="py-4">
        <h3 py-4>Sigin with one of the providers</h3>
        <button
          className="text-white bg-gray-700 w-full p-4 font-medium rounded-lg flex align-middle gap-2"
          onClick={googleLogin}
        >
          <FcGoogle className="text-2xl" />
          Sigin with google
        </button>
      </div>
    </div>
  );
}
