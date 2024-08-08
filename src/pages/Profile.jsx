import React, { useEffect, useState } from "react";
import { LiaIdCardAltSolid, LiaTableSolid } from "react-icons/lia";
import { MdVerified } from "react-icons/md";
import { PiVideo } from "react-icons/pi";
import { RiSettings4Fill } from "react-icons/ri";
import { auth, db } from "../components/firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { BiTrashAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";

export default function Profile() {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [posts, setPosts] = useState([]);
  const [ondelete, setOndelete] = useState(false);
  const [onViewImage, setOnViewImage] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState([]);

  function handleGalleryIndex(id) {
    setGalleryIndex(id);
  }

  useEffect(() => {
    const currentuser = auth.currentUser;
    setUser(currentuser);

    if (user) {
      onSnapshot(
        query(collection(db, "posts"), where("uid", "==", user.uid)),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      );
    }
  }, [user, db]);

  useEffect(
    () =>
      onSnapshot(
        collection(db, "loggedUsers", auth.currentUser.uid, "profile"),
        (snapshot) => {
          setProfile(snapshot.docs);
        }
      ),
    []
  );

  async function deletePost(id) {
    await deleteDoc(doc(db, "posts", id));
    setOndelete(false);
    setOnViewImage(false);
  }

  //console.log("posts ", posts);

  const galleryTabs = [
    {
      icon: <LiaTableSolid size={18} />,
      label: "POSTS",
      galleryLabel: "posts",
      clr: "border-green-600",
    },
    {
      icon: <PiVideo size={18} />,
      label: "REELS",
      galleryLabel: "reels",
      clr: "border-pink-500",
    },
    {
      icon: <LiaIdCardAltSolid size={19} />,
      label: "TAGGED",
      galleryLabel: "tagged",
      clr: "border-blue-300",
    },
  ];

  return (
    <>
      {ondelete && (
        <div className="absolute content-center w-full h-full bg-black/30 z-[80] ">
          <div className=" flex mx-auto gap-y-1 w-[350px] bg-zinc-700 flex-col text-zinc-700 py-2 rounded-lg">
            <span
              onClick={() => deletePost(onViewImage.post.id)}
              className="w-fit mx-auto text-red-500 font-medium py-1 cursor-pointer"
            >
              Delete
            </span>
            <hr className="h-px bg-zinc-600 border-none" />
            <span
              onClick={() => setOndelete(false)}
              className="w-fit mx-auto text-slate-100 font-medium py-1 cursor-pointer"
            >
              Cancel
            </span>
          </div>
        </div>
      )}

      {/*view image */}
      {onViewImage.isOn && (
        <div className="fixed content-center w-full h-full bg-black/70 z-[70] ">
          <CgClose
            onClick={() => setOnViewImage(false)}
            className="absolute right-1 top-1 size-7 text-white cursor-pointer"
          />
          <div className="flex items-center px-2 mx-auto pb-6 h-[700px]">
            <img
              src={onViewImage.post.data().image}
              alt=""
              className=" mx-auto max-h-[630px]"
            />
            <BiTrashAlt
              onClick={() => setOndelete(true)}
              className="absolute right-1 bottom-20 hover:bg-slate-500 text-red-500 border cursor-pointer bg-slate-600 rounded-full p-[2px] size-[30px]"
            />
          </div>
        </div>
      )}

      <div className="relative">
        <div className="flex max-w-[780px] min-w-[450px] min-h-[650px] mx-2 md:ml-[10%] lg:ml-[28%] md:w-[690px] lg:max-w-[760px] xl:w-[780px] ">
          <div className=" mt-3 w-full">
            {/*top*/}
            <div className="sticky shadow-md bg-white pb-10 pr-1 md:pr-4 top-16 md:top-3 flex items-center justify-between z-50">
              <div className="h-[125px] w-[125px] md:h-[135px] md:w-[135px] ml-4 md:ml-8 shadow-xl rounded-full">
                <img
                  src={auth.currentUser.photoURL}
                  alt="user"
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
              {/*top left */}
              <div className="flex flex-col gap-[15px] text-base">
                <div className="sm:flex md:flex lg:flex xl:flex items-center gap-4 ">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">
                      {auth.currentUser.displayName}
                    </span>
                    <MdVerified color="blue" size={13.5} />
                  </div>

                  <div className="flex items-center gap-2 mt-2 ">
                    <a href="/profile/edit">
                      <button className="bg-zinc-300 rounded-md px-[14px] py-1 hover:bg-zinc-400">
                        Edit Profile
                      </button>
                    </a>

                    <button className="bg-zinc-300 rounded-md px-[14px] py-1 hover:bg-zinc-400">
                      View archive
                    </button>
                    <RiSettings4Fill size={25} />
                  </div>
                </div>
                <div className="flex gap-5 pr-2">
                  <span>832 posts</span>
                  <span>16.1M followers</span>
                  <span>2 following</span>
                </div>

                {profile.map((doc) => (
                  <div className="leading-[18px]">
                    <p className="text">{doc.data().bio}</p>
                    <a
                      className="text-blue-700 hover:text-blue-500"
                      href={doc.data().website}
                    >
                      {doc.data().website}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/*bottom */}
            <div className="relative border-t">
              <div className="flex gap-10 justify-center">
                {galleryTabs.map((tab, index) => (
                  <div>
                    <div
                      onClick={() => handleGalleryIndex(index)}
                      className={`profilePostIcons ${
                        galleryIndex === index && "active"
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </div>
                    {/*gallery box*/}
                    {galleryIndex === index && (
                      <div className="absolute left-0 w-full grid grid-cols-3 mt-4 gap-[0.5px] z-0">
                        {tab.galleryLabel === "posts" &&
                          posts.map((post) => (
                            <div className="relative min-h-[8rem] max-h-[10rem] md:max-h-[12rem] lg:max-h-[14rem] border-2 border-gray-400">
                              <img
                                onClick={() =>
                                  setOnViewImage({ isOn: true, post: post })
                                }
                                src={post.data().image}
                                className="object-cover w-full h-full "
                                alt={post.data().imageAlt}
                              />
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
