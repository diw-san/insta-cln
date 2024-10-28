import React, { useEffect, useRef, useState } from "react";
import { BiSmile } from "react-icons/bi";
import { FaArrowLeft, FaPhotoFilm } from "react-icons/fa6";
import { GoLocation } from "react-icons/go";
import { MdVerified } from "react-icons/md";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../components/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

export default function Create({ setOnCreate }) {
  const [toggleAccessibility, setToggleAccessibility] = useState(false);
  const [caption, setCaption] = useState("");
  const [imageAlt, setimageAlt] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shareOn, setShareOn] = useState(false);
  const fileInputRef = useRef();

  const maxLength = 2200;
  const currentuser = auth.currentUser;

  function fileHandleClick(e) {
    e.preventDefault();
    fileInputRef.current.click();
  }
  function leftArrow() {
    setShareOn(false);
    setSelectedFile(null);
  }

  useEffect(() => {
    setUser(currentuser);
  }, []);

  async function uploadPost() {
    try {
      setLoading(true);
      const docref = await addDoc(collection(db, "posts"), {
        username: user.displayName,
        caption: caption.trim() !== "" && caption,
        profileImg: user.photoURL,
        imageAlt: imageAlt.trim() !== "" && imageAlt,
        timestamp: serverTimestamp(),
        uid: user.uid,
      });
      console.log(docref.id);
      const imageref = ref(storage, `posts/${docref.id}/image`);

      await uploadString(imageref, selectedFile, "data_url").then(
        async (snapshot) => {
          const downloadUrl = await getDownloadURL(imageref);

          await updateDoc(doc(db, "posts", docref.id), {
            image: downloadUrl,
          });
        }
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    setShareOn(false);
    setOnCreate(false);
    setSelectedFile(null);
  }

  function captionCount(e) {
    const capinput = e.target.value;

    if (capinput.length <= maxLength) {
      setCaption(capinput);
    }
  }

  function handdleImageAlt(e) {
    const imgAlt = e.target.value;
    setimageAlt(imgAlt);
  }

  function addImageToPost(e) {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      const file = readerEvent.target.result;
      setSelectedFile(file);
      !file &&
        (document.getElementById("imgLoadErr").innerHTML = "Uploading Error!");
    };
  }
  useEffect(() => {
    if (selectedFile) {
      setShareOn(true);
    }
  }, [selectedFile]);

  // console.log("Selected Pic" + selectedFile);

  return (
    <>
      <div className="text-white px-3 w-full  mx-auto">
        {!shareOn && (
          <div className=" mx-auto min-w-[350px] max-w-[444px] h-[480px] bg-zinc-800 rounded-xl ">
            <span className="flex justify-center py-[10px] font-medium text-sm">
              Create new post
            </span>
            <hr className="h-[1.1px] bg-zinc-700 border-none" />
            <div className="relative flex flex-col gap-5 text-[17px] items-center inset-y-1/3">
              <FaPhotoFilm size="30" />
              <p>Drag photos and videos here</p>
              <button
                onClick={fileHandleClick}
                className="py-[6px] px-3 text-xs font-medium bg-sky-500 rounded-[7px]"
              >
                Select From Computer
              </button>
              <p className="text-yellow-500" id="imgLoadErr"></p>
              <input
                onChange={addImageToPost}
                type="file"
                ref={fileInputRef}
                //accept="image/*"
                hidden
              />
            </div>
          </div>
        )}
        {/*share */}

        {shareOn && (
          <div className="mx-auto bg-zinc-800 rounded-xl min-w-[430px] max-w-[860px] max-h-[480px]">
            <div className="relative flex justify-evenly items-center">
              <button onClick={leftArrow} className="absolute left-3">
                <FaArrowLeft size={20} />
              </button>
              <span className="flex justify-center py-[10px] font-medium text-sm">
                Create new post
              </span>
              <button
                onClick={uploadPost}
                className="absolute right-2 font-semibold text-[15px] text-blue-700"
              >
                {loading ? "Uploading..." : "Share"}
              </button>
            </div>
            <hr className="h-[1.1px] bg-zinc-700 border-none" /> {/*min w,h */}
            <div className="relative flex w-full h-[439px] ">
              {/*left*/}
              <div className=" flex-[3] my-auto bg-black">
                <img
                  className="object-cover max-h-[439px] mx-auto"
                  src={selectedFile}
                  alt="img"
                />
              </div>

              {/*right*/}
              <div className=" flex-[2.2] h-full overflow-y-scroll scrollColor  ">
                <div className="flex items-center gap-1 p-4">
                  <div className="h-8 w-8 ">
                    <img
                      src={user.photoURL}
                      alt="user"
                      className="object-cover rounded-full"
                    />
                  </div>
                  <span className="font-medium text-sm ml-2">
                    {user.displayName}
                  </span>
                  <MdVerified color="blue" size={12.5} />
                </div>
                <div className="px-4 py-1">
                  <textarea
                    className=" bg-transparent resize-none text-zinc-400 border-none focus:outline-none w-full min-h-[120px] hideCommentsScroll"
                    placeholder="Write a caption..."
                    maxLength={maxLength}
                    value={caption}
                    onChange={captionCount}
                  />
                  <div className="flex justify-between text-zinc-400 mt-[2px] ">
                    <BiSmile size={20} />
                    <span className="text-xs">
                      {caption.length}/{maxLength}
                    </span>
                  </div>
                  <div className="flex flex-col gap-4 mt-3 text-[16px] sm:font-[]">
                    <div className="flex justify-between">
                      <input
                        className="bg-transparent text-zinc-400 border-none focus:outline-none w-full"
                        type="text"
                        placeholder="Add Location"
                      />

                      <button>
                        <GoLocation />
                      </button>
                    </div>
                    <div className="flex justify-between">
                      <span>Accessibility</span>
                      <button>
                        {toggleAccessibility ? (
                          <SlArrowUp
                            size={14}
                            onClick={() => setToggleAccessibility(false)}
                          />
                        ) : (
                          <SlArrowDown
                            size={14}
                            onClick={() => setToggleAccessibility(true)}
                          />
                        )}
                      </button>
                    </div>

                    {/*Accessebility*/}
                    <div className={toggleAccessibility ? "block" : "hidden"}>
                      <p className="text-xs text-zinc-400">
                        Alt text describes your photos for people with visual
                        impairments. Alt text will be automatically created for
                        <br />
                        your photos or you can choose to write your own.
                      </p>
                      <div className="flex items-center gap-4 mt-[10px]">
                        <img
                          className="h-10 w-10"
                          src={selectedFile}
                          alt={imageAlt}
                        />
                        <input
                          className="bg-transparent text-zinc-400 border-none focus:outline-none w-full"
                          type="text"
                          placeholder="Write alt text..."
                          value={imageAlt}
                          onChange={handdleImageAlt}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between ">
                      <span>Advanced Settings</span>
                      <button>
                        <SlArrowDown size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
