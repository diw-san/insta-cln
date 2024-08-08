import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useRef, useState } from "react";
import { MdVerified } from "react-icons/md";
import { auth, db } from "../components/firebase";

export default function ProfileEdit() {
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const fileInputRef = useRef();

  const maxLength = 250;
  const user = auth.currentUser;

  async function handleProfileSubmit(e) {
    e.preventDefault();
    await setDoc(doc(db, "loggedUsers", user.uid, "profile", user.uid), {
      website: website,
      bio: bio,
      timestamp: serverTimestamp(),
    });
    setBio("");
    setWebsite("");
  }

  function fileHandleClick(e) {
    e.preventDefault();
    fileInputRef.current.click();
  }

  return (
    <>
      <div className="md:ml-20 lg:ml-[15rem] mx-auto border">
        <div className="mt-2 ml-[10%] md:ml-[10%]">
          <h2 className="text-[26px] font-medium">Edit Profile</h2>

          <form
            onSubmit={handleProfileSubmit}
            className="flex flex-col gap-3 mt-8"
          >
            <div className="flex items-center gap-1">
              <div className="h-[4.5rem] w-[4.5rem] ">
                <img
                  src={user.photoURL}
                  alt="userImg"
                  className="object-cover rounded-full"
                />
              </div>
              <span className="font-medium text-sm ml-2">
                {user.displayName}
              </span>
              <MdVerified color="blue" size={12.5} />

              <button
                onClick={fileHandleClick}
                className="p-1 px-3 ml-2 font-medium text-white bg-sky-500 rounded-md hover:bg-sky-400"
              >
                Change photo
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
              />
            </div>

            <label className="mt-4 font-medium">Website</label>
            <input
              type="text"
              className=" p-2 border w-[350px] md:w-[400px] focus:outline-none text-zinc-500 rounded-md"
              placeholder="Website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
            <label className="mt-4 font-medium">Bio</label>
            <div className="border p-2 w-[350px] md:w-[400px] rounded-md">
              <textarea
                type="text"
                className="border-none w-full resize-none focus:outline-none text-zinc-500 "
                placeholder="Bio"
                maxLength={maxLength}
                onChange={(e) => setBio(e.target.value)}
                value={bio}
              />
              <span className="flex justify-end mr-1 text-gray-600 text-sm ">
                {bio?.length || 0}/{maxLength}
              </span>
            </div>

            <div className="flex items-baseline gap-14">
              <label className="mt-6 font-medium">
                Show account suggetions on proifle
              </label>
              <input type="checkbox" className="size-5" />
            </div>
            <button
              type="submit"
              className=" mt-5 p-2 px-4 w-fit font-medium text-white hover:bg-sky-700 hover:shadow bg-sky-800 rounded-md"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
