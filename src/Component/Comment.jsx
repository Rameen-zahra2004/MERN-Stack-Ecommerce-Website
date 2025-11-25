import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, addReply } from "../Slices/commentSlice";
import Picker from "emoji-picker-react";

// Hook for emoji input
function useEmojiInput(initial = "") {
  const [value, setValue] = useState(initial);
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  const onEmojiClick = (emoji) => {
    setValue((prev) => prev + emoji.emoji);
    close();
  };

  return { value, setValue, open, toggle, onEmojiClick };
}

// MAIN COMPONENT
export default function CommentSection({ postId }) {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comments?.comments || []);
  const user = useSelector((state) => state.signinuser?.user);

  const commentInput = useEmojiInput("");

  // Filter comments by postId
  const filteredComments = comments.filter((c) => c.postId === postId);

  const handleAddComment = () => {
    if (!commentInput.value.trim()) return;

    dispatch(
      addComment({
        postId,
        userId: user?.id ?? null,
        text: commentInput.value.trim(),
      })
    );

    commentInput.setValue("");
  };

  const handleAddReply = (commentId, text) => {
    dispatch(
      addReply({
        commentId,
        userId: user?.id ?? null,
        text,
      })
    );
  };

  return (
    <div className="mt-6 w-full">
      <h2 className="text-xl font-semibold mb-3">Comments</h2>

      {/* Input for new comment */}
      <CommentInput
        emoji={commentInput}
        onSubmit={handleAddComment}
        submitLabel="Post"
      />

      {/* Comments List */}
      <CommentList comments={filteredComments} onAddReply={handleAddReply} />
    </div>
  );
}

// COMMENTS LIST
function CommentList({ comments, onAddReply }) {
  if (!comments.length)
    return <p className="text-gray-500 mt-2">No comments yet. Be the first!</p>;

  return (
    <div className="space-y-4 mt-2">
      {comments.map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          onAddReply={onAddReply}
          replies={c.replies ?? []}
        />
      ))}
    </div>
  );
}

// COMMENT ITEM
function CommentItem({ comment, replies, onAddReply }) {
  return (
    <div className="border border-gray-300 rounded p-3">
      <p>
        <strong>{comment.user?.username ?? "User"}</strong>: {comment.text}
      </p>

      {/* Replies */}
      <ReplyList replies={replies} />

      {/* Reply input */}
      <ReplyInput parentId={comment.id} onAddReply={onAddReply} />
    </div>
  );
}

// SIMPLE REPLY LIST
function ReplyList({ replies }) {
  if (!replies.length) return null;

  return (
    <div className="ml-6 mt-3 space-y-2">
      {replies.map((r) => (
        <div key={r.id} className="text-gray-700 text-sm">
          <strong>{r.user?.username ?? "User"}</strong>: {r.text}
        </div>
      ))}
    </div>
  );
}

// REPLY INPUT
function ReplyInput({ parentId, onAddReply }) {
  const emoji = useEmojiInput("");

  const handleReply = () => {
    if (!emoji.value.trim()) return;
    onAddReply(parentId, emoji.value.trim());
    emoji.setValue("");
  };

  return (
    <div className="flex items-center mt-2 ml-6">
      <CommentInput emoji={emoji} onSubmit={handleReply} submitLabel="Reply" />
    </div>
  );
}

// REUSABLE INPUT
function CommentInput({ emoji, onSubmit, submitLabel }) {
  return (
    <div className="flex items-center border rounded-md px-2 py-1 w-full relative">
      <button type="button" className="text-xl mr-2" onClick={emoji.toggle}>
        😀
      </button>

      <input
        type="text"
        className="flex-1 outline-none px-2 py-1"
        placeholder={submitLabel === "Post" ? "Add a comment..." : "Reply..."}
        value={emoji.value}
        onChange={(e) => emoji.setValue(e.target.value)}
      />

      <button
        type="button"
        onClick={onSubmit}
        className="ml-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
      >
        {submitLabel}
      </button>

      {emoji.open && (
        <div className="absolute left-0 mt-10 z-50">
          <Picker onEmojiClick={emoji.onEmojiClick} />
        </div>
      )}
    </div>
  );
}
