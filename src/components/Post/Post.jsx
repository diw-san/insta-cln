import React from "react";
import { useState } from "react";
import { BiDotsHorizontalRounded, BiSmile } from "react-icons/bi";
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { TbMessageCircle } from "react-icons/tb";
import { BsBookmarkFill } from "react-icons/bs";
import { getCommentedTime } from "./CommentRow";
import Comments from "./Comments";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useEffect } from "react";

export default function Post({
  image,
  id,
  caption,
  profileImg,
  username,
  time,
  imageAlt,
}) {
  const [viewComment, setViewComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentLength, setcommentLength] = useState(null);

  const [like, setLike] = useState(false);
  const [likers, setLikers] = useState([]);
  const [save, setSave] = useState(false);

  const [comments, setComments] = useState([]);

  const loggedUser = auth.currentUser;

  async function handleCommentSubmit(e) {
    const commentValue = e.target.value;
    setNewComment(commentValue);

    e.preventDefault();

    await addDoc(collection(db, "posts", id, "comments"), {
      comusername: loggedUser.displayName,
      comprofileImg: loggedUser.photoURL,
      timestamp: serverTimestamp(),
      comment: newComment.trim() !== "" && newComment,
    });

    setNewComment("");
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "likes"),
      (snapshot) => {
        setLikers(snapshot.docs);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [db, id]);

  useEffect(
    () =>
      setLike(likers.findIndex((liker) => liker.id === loggedUser.uid) !== -1),
    [likers]
  );

  async function addLike() {
    if (like) {
      await deleteDoc(doc(db, "posts", id, "likes", loggedUser.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", loggedUser.uid), {
        likeUsername: loggedUser.displayName,
      });
    }
  }

  useEffect(
    //get comment length
    () =>
      onSnapshot(collection(db, "posts", id, "comments"), (snapshot) => {
        setcommentLength(snapshot.docs?.length);
      }),
    [db, id]
  );

  return (
    <>
      {viewComment && (
        <div className="absolute z-[100]">
          <div className="fixed left-0 top-0 w-full h-screen">
            <Comments
              addLike={addLike}
              likers={likers}
              id={id}
              image={image}
              profileImg={profileImg}
              username={username}
              time={time}
              imageAlt={imageAlt}
              like={like}
              setLike={setLike}
              save={save}
              setSave={setSave}
              comments={comments}
              setComments={setComments}
              setViewComment={setViewComment}
              newComment={newComment}
              setNewComment={setNewComment}
              handleCommentSubmit={handleCommentSubmit}
            />
          </div>
        </div>
      )}

      <div className=" mx-auto mt-1 max-w-[470px] h-[750px] border-b border-gray-300">
        <div className=" w-full min-w-[370px] max-w-[450px] mx-auto h-[3rem]">
          {/*post top */}
          <div className=" flex justify-between items-center">
            <div className="flex items-center gap-1">
              <div className="h-10 w-10">
                <img
                  src={profileImg}
                  alt="userImg"
                  className="w-full h-full object-cover rounded-full my-1"
                />
              </div>
              <span className="font-medium text-sm ml-2">{username}</span>
              <MdVerified color="blue" size={12.5} />
              <span className="ml-px text-sm text-gray-500">
                <b> .</b> {getCommentedTime(time)}
              </span>
            </div>
            <BiDotsHorizontalRounded size={25} />
          </div>
        </div>

        {/*post image */}
        <div className="flex items-center min-w-[370px] max-w-[450px] mx-auto">
          <img
            src={image}
            alt={imageAlt}
            className="object-cover mx-auto w-full max-h-[530px]"
          />
        </div>

        {/*post bottom */}
        <div className="min-w-[370px] max-w-[450px] mx-auto">
          <div className="flex items-center justify-between pt-[6px]">
            <div className="flex items-center gap-3">
              {like ? (
                <FaHeart
                  className="size-6 w-6 heartBounce"
                  onClick={addLike}
                  color="red"
                />
              ) : (
                <FaRegHeart
                  className="size-6 w-6 hover:text-gray-600"
                  onClick={addLike}
                />
              )}

              <TbMessageCircle size={24} />
              <PiPaperPlaneTiltBold size={23} />
            </div>
            {save ? (
              <BsBookmarkFill onClick={() => setSave(false)} size={22.5} />
            ) : (
              <FaRegBookmark onClick={() => setSave(true)} size={22.5} />
            )}
          </div>
          <div className="mt-2 text-sm ">
            <p>
              {likers.length > 0 && (
                <b>
                  {likers?.length} {likers.length === 1 ? "like" : "likes"}
                </b>
              )}
            </p>

            <div className="mt-2 flex gap-1">
              <span className="flex gap-1 items-center">
                <b>{username}</b>
                <MdVerified color="blue" size={12.5} />
              </span>
              <span> {caption} </span>
            </div>
            <p
              onClick={() => setViewComment(true)}
              className="mt-2 text-gray-500 cursor-pointer hover:text-gray-400"
            >
              View {commentLength > 0 && commentLength}{" "}
              {commentLength === 1 ? "comment" : "comments"}
            </p>
            <div className="flex justify-between items-center mt-1">
              <form onSubmit={handleCommentSubmit}>
                <input
                  className="mt-2 bg-transparent text-gray-600 w-full focus:outline-none "
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </form>
              <BiSmile size={19} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
