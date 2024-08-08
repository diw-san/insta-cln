import React from "react";

export default function CommentDelete({
  setCommentMenu,
  deleteComment,
  commentMenu,
}) {
  function handleDelete() {
    deleteComment(
      commentMenu.commentId,
      commentMenu.replyId,
      commentMenu.fromReply
    );
    setCommentMenu({ isTrue: false });
  }

  return (
    <div>
      <div className=" flex mx-auto gap-y-1 w-[350px] bg-zinc-700 flex-col text-zinc-700 py-2 rounded-lg">
        <span
          onClick={handleDelete}
          className="w-fit mx-auto text-red-500 font-medium py-1 cursor-pointer"
        >
          Delete
        </span>
        <hr className="h-px bg-zinc-600 border-none" />
        <span
          onClick={() => setCommentMenu({ isTrue: false })}
          className="w-fit mx-auto text-slate-100 font-medium py-1 cursor-pointer"
        >
          Cancel
        </span>
      </div>
    </div>
  );
}
