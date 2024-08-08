import React, { useEffect, useRef, useState } from "react";
import { BsBookmarkFill } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { TbMessageCircle } from "react-icons/tb";
import CommentRow, { getCommentedTime } from "./CommentRow";
import { BiDotsHorizontalRounded, BiSmile } from "react-icons/bi";
import { MdVerified } from "react-icons/md";
import CommentDelete from "./commentDelete";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Comments({
  id,
  likers,
  image,
  profileImg,
  username,
  addLike,
  time,
  imageAlt,
  setViewComment,
  comments,
  setComments,
  like,
  save,
  setSave,
  handleCommentSubmit,
  newComment,
  setNewComment,
}) {
  const [commentMenu, setCommentMenu] = useState(false);
  const [onReply, setOnReply] = useState(false);
  const [newReplyComment, setNewReplyComment] = useState("");

  const componentRef = useRef();

  const loggedUser = auth.currentUser;

  async function handleDeleteComment(commentId, replyId, fromReply) {
    fromReply
      ? await deleteDoc(
          doc(db, "posts", id, "comments", commentId, "replys", replyId)
        )
      : await deleteDoc(doc(db, "posts", id, "comments", commentId));
  }

  function handleCommentInput(e) {
    //reply comment
    onReply.isReply
      ? setNewReplyComment(e.target.value)
      : setNewComment(e.target.value);
  }

  async function handleReplySubmit(e) {
    e.preventDefault();
    await addDoc(
      collection(db, "posts", id, "comments", onReply.id, "replys"),
      {
        username: loggedUser.displayName,
        profileImg: loggedUser.photoURL,
        reply: newReplyComment.trim() !== "" && newReplyComment,
        timestamp: serverTimestamp(),
      }
    );
    setNewReplyComment("");
    setOnReply(false);
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setComments(snapshot.docs);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [db, id]);
  //console.log(replys);

  return (
    <>
      {/*comment menu*/}

      {commentMenu.isTrue && (
        <div className="absolute content-center w-full h-full bg-black/30 z-[80]">
          <CommentDelete
            deleteComment={handleDeleteComment}
            setCommentMenu={setCommentMenu}
            commentMenu={commentMenu}
          />
        </div>
      )}

      <div className=" w-full h-full bg-black/70">
        <CgClose
          className="absolute right-1 top-1 cursor-pointer text-gray-500"
          size={24}
          onClick={() => setViewComment(false)}
        />

        <div className="flex justify-center ">
          <div className="flex absolute inset-y-[18%] md:my-auto lg:my-auto p-1 text-zinc-200 w-[430px] h-[400px] sm:w-[85%] sm:h-[450px] md:4/5 md:h-[550px] lg:w-[1000px] lg:h-[670px] xl:w-[1000px] xl:h-[670px]">
            <div className="flex-[1.1] min-w-[160px] bg-zinc-500 hidden sm:block md:block lg:block rounded-s-lg">
              <div className="relative flex items-center justify-center w-full h-full my-auto">
                <img
                  className="object-cover w-full sm:max-h-[450px] md:max-h-[550px] lg:max-h-[660px]"
                  src={image}
                  alt={imageAlt}
                />
              </div>
            </div>
            <div className="relative min-w-[400px] h-full flex-[1] bg-zinc-700 rounded-lg sm:rounded-bl-none md:rounded-bl-none lg:rounded-bl-none xl:rounded-bl-none ">
              {/*top*/}
              <div className="sticky border-b border-zinc-600 bg-zinc-700 w-full p-3 top-0 z-50 rounded-ss-lg rounded-se-lg sm:rounded-ss-none sm:rounded-se-lg md:rounded-ss-none md:rounded-se-lg lg:rounded-ss-none lg:rounded-se-lg xl:rounded-ss-none xl:rounded-se-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <div className="h-8 w-8 ">
                      <img
                        className="object-cover w-full h-full rounded-full"
                        src={profileImg}
                        alt="user"
                      />
                    </div>
                    <span className="font-medium text-sm ml-2">{username}</span>
                    <MdVerified color="blue" size={12.5} />
                  </div>
                  <BiDotsHorizontalRounded size={25} />
                </div>
              </div>

              <div className="absolute w-full px-3 top-14 bottom-[10rem] overflow-y-auto scroll-smooth hideCommentsScroll">
                {comments.map((comment) => (
                  <div key={comment.id}>
                    <CommentRow
                      comment={comment.data().comment}
                      username={comment.data().comusername}
                      profileImg={comment.data().comprofileImg}
                      time={comment.data().timestamp?.toMillis()}
                      id={id}
                      commentId={comment.id}
                      setCommentMenu={setCommentMenu}
                      setOnReply={setOnReply}
                      onReply={onReply}
                      componentRef={componentRef}
                      reply={true}
                    />
                  </div>
                ))}
              </div>

              {/*Bottom */}
              <div className="absolute border-t border-zinc-600 bg-zinc-700 bottom-0 mb-1 w-full z-50 rounded-b-xl ">
                <div className="flex items-center justify-between p-3">
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
                    <BsBookmarkFill
                      onClick={() => setSave(false)}
                      size={22.5}
                    />
                  ) : (
                    <FaRegBookmark onClick={() => setSave(true)} size={22.5} />
                  )}
                </div>
                <div className="px-3 mb-3">
                  <p className="text-[15px]">
                    {likers.length > 0 && (
                      <b>
                        {likers?.length}{" "}
                        {likers.length === 1 ? "like" : "likes"}
                      </b>
                    )}
                  </p>
                  <p className="text-[13px] text-gray-500">
                    {getCommentedTime(time)}{" "}
                    {getCommentedTime(time) !== "now" && "ago"}
                  </p>
                </div>

                <div className="flex border-t border-zinc-600 justify-between items-center px-3">
                  <div className="flex my-3 items-center gap-2">
                    <BiSmile className="mt-auto" size={23} />
                    <form
                      onSubmit={
                        onReply.isReply
                          ? handleReplySubmit
                          : handleCommentSubmit
                      }
                    >
                      <input
                        className="my-0 bg-transparent text-gray-600 w-full text-sm focus:outline-none "
                        type="text"
                        placeholder={`${
                          onReply.isReply
                            ? "Add a reply..."
                            : "Add a comment..."
                        }`}
                        value={onReply.isReply ? newReplyComment : newComment}
                        onChange={handleCommentInput}
                      />
                    </form>
                  </div>

                  <span
                    onClick={
                      onReply.isReply ? handleReplySubmit : handleCommentSubmit
                    }
                    className="text-sm cursor-pointer hover:text-blue-800"
                  >
                    <b>Post</b>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*bg close */}
    </>
  );
}
