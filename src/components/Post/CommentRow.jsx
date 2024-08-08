import React, { useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export function getCommentedTime(commentTime) {
  const timeNow = Date.now();

  const timeDef = timeNow - commentTime;

  const seconds = Math.floor(timeDef / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) {
    return "now";
  } else if (minutes < 60) {
    return `${minutes}m`;
  } else if (hours < 24) {
    return `${hours}h`;
  } else if (days < 7) {
    return `${days}d`;
  } else if (days > 7) {
    return `${weeks}w`;
  }
}

export default function CommentRow({
  id,
  commentId,
  comment,
  username,
  time,
  profileImg,
  setCommentMenu,
  setOnReply,
  onReply,
  reply,
}) {
  const [like, setLike] = useState(false);
  const [likers, setLikers] = useState([]);
  const [replys, setReplys] = useState([]);

  const loggedUser = auth.currentUser;

  async function addCommentLike() {
    if (like) {
      await deleteDoc(
        doc(db, "posts", id, "comments", commentId, "likes", loggedUser.uid)
      );
    } else {
      await setDoc(
        doc(db, "posts", id, "comments", commentId, "likes", loggedUser.uid),
        {
          likedUsername: loggedUser.displayName,
        }
      );
    }
  }

  useEffect(
    () =>
      setLike(likers.findIndex((liker) => liker.id === loggedUser.uid) !== -1),
    [likers]
  );

  useEffect(
    () =>
      onSnapshot(
        collection(db, "posts", id, "comments", commentId, "likes"),
        (snapshot) => {
          setLikers(snapshot.docs);
        }
      ),
    [db, id]
  );

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments", commentId, "replys"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => {
          setReplys(snapshot.docs);
        }
      ),
    [db, id, commentId]
  );

  return (
    <>
      <div className="mb-4">
        <div className="flex items-center justify-between group">
          <div className="flex gap-1">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8">
                <img
                  src={profileImg}
                  alt="userImg"
                  className="w-full h-full object-cover rounded-full my-1"
                />
              </div>

              <div className="flex-col">
                <div className="flex gap-1 items-center">
                  <span className="flex font-medium gap-1 items-center">
                    {username}
                    <MdVerified color="blue" size={12.5} />
                  </span>
                  <p className="text-[15px]">{comment}</p>
                </div>

                <div className="flex gap-3 text-[13px] items-center font-[500] text-gray">
                  <span className="cursor-pointer">
                    {getCommentedTime(time)}
                  </span>
                  {reply && (
                    <div>
                      {likers.length > 0 && (
                        <span className="cursor-pointer">
                          {likers.length}{" "}
                          {likers.length === 1 ? "like" : "likes"}
                        </span>
                      )}
                    </div>
                  )}

                  <div>
                    {reply && (
                      <span
                        onClick={() =>
                          setOnReply({
                            isReply: !onReply.isReply,
                            id: commentId,
                          })
                        }
                        className={
                          onReply.id === commentId && onReply.isReply
                            ? "text-blue-800 cursor-pointer"
                            : "cursor-pointer"
                        }
                      >
                        Reply
                      </span>
                    )}
                  </div>
                  <span className="w-8 cursor-pointer hover:block">
                    <BiDotsHorizontalRounded
                      onClick={() => {
                        setCommentMenu({
                          isTrue: true,
                          commentId: commentId,
                        });
                      }}
                      className="hidden group-hover:block"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
          {reply && (
            <div>
              {like ? (
                <FaHeart
                  className="size-3 w-3 "
                  onClick={addCommentLike}
                  color="red"
                />
              ) : (
                <FaRegHeart
                  className="size-3 w-3 hover:text-gray-600"
                  onClick={addCommentLike}
                />
              )}
            </div>
          )}
        </div>
      </div>
      {replys?.map((reply) => (
        <div key={reply.id} className="ml-6">
          <div className="mb-4">
            <div className="flex items-center justify-between group">
              <div className="flex gap-1">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8">
                    <img
                      src={reply.data().profileImg}
                      alt="userImg"
                      className="w-full h-full object-cover rounded-full my-1"
                    />
                  </div>

                  <div className="flex-col">
                    <div className="flex gap-1 items-center">
                      <span className="flex font-medium gap-1 items-center">
                        {reply.data().username}
                        <MdVerified color="blue" size={12.5} />
                      </span>
                      <p className="text-[15px]">{reply.data().reply}</p>
                    </div>

                    <div className="flex gap-3 text-[13px] items-center font-[500] text-gray">
                      <span className="cursor-pointer">
                        {getCommentedTime(reply.data().timestamp?.toMillis())}
                      </span>

                      <span className="w-8 cursor-pointer hover:block">
                        <BiDotsHorizontalRounded
                          onClick={() => {
                            setCommentMenu({
                              isTrue: true,
                              replyId: reply.id,
                              commentId: commentId,
                              fromReply: true,
                            });
                          }}
                          className="hidden group-hover:block"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
