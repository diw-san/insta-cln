import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../components/firebase";

export default function SignIn() {
  const [isSignin, setIsSignin] = useState(false);

  function googleSignIn() {
    setIsSignin(true);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        console.log("Userrr", result.user);
        if (result.user) {
          document.getElementById("Logged").innerHTML =
            "Logged in Successfully";
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.error("Error during sign in:", error);
      })
      .then(setIsSignin(false));
  }

  return (
    <>
      <div className="flex flex-col mx-auto my-32 items-center bg-slate-200 w-2/3 md:w-2/5 h-[20rem] p-2 rounded-lg">
        <button
          onClick={googleSignIn}
          disabled={isSignin}
          className="flex items-center gap-2 bg-sky-600 p-2 px-2 my-auto hover:bg-sky-700 text-slate-200 font-bold text-lg rounded-lg"
        >
          <img
            src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
            className="object-cover bg-white rounded-lg w-11"
          />{" "}
          Sign in with Google
        </button>

        <p className="text-green-600 text-base" id="Logged"></p>
      </div>
    </>
  );
}
