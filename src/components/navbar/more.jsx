import { signOut } from "firebase/auth";
import React from "react";
import { BiMessageAltError } from "react-icons/bi";
import { FaRegBookmark } from "react-icons/fa";
import { LuActivitySquare, LuMoon } from "react-icons/lu";
import { RiSettings4Fill } from "react-icons/ri";
import { auth } from "../firebase";
import { CgClose } from "react-icons/cg";

export default function More({ setOnMore }) {
  async function handdleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="relative bg-zinc-800 w-[15rem] text-slate-200 rounded-xl">
        <div className="space-y-6 p-[26px]">
          <div className="navbarIconFlex">
            <RiSettings4Fill className="navbarMore" />
            <span> Settings </span>
          </div>
          <div className="navbarIconFlex">
            <LuActivitySquare className="navbarMore" />
            <span> Your Activity </span>
          </div>
          <div className="navbarIconFlex">
            <FaRegBookmark className="navbarMore" />
            <span> Saved </span>
          </div>
          <div className="navbarIconFlex">
            <LuMoon className="navbarMore -rotate-90" />
            <span> Switch appearance </span>
          </div>
          <div className="navbarIconFlex">
            <BiMessageAltError className="navbarMore" />
            <span> Report a plroblem </span>
          </div>
        </div>

        <hr className="border-transparent h-[7px] w-full bg-zinc-600/20" />

        <div className="mx-14 py-[24px]">
          <div>Switch accounts</div>
        </div>
        <hr className="border-transparent h-[2px] w-full bg-zinc-700/40" />

        <div className="py-[18px] cursor-pointer">
          <div
            className="text-red-600 hover:text-red-500 mx-[78px]"
            onClick={handdleLogout}
          >
            <b> Log out</b>
          </div>
        </div>
        <div className=" py-[18px] border-t border-zinc-700 cursor-pointer">
          <div
            className="text-slate-400 hover:text-slate-300 mx-[81px]"
            onClick={() => setOnMore(false)}
          >
            Cancel
          </div>
        </div>
      </div>
    </>
  );
}
