import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, addReply } from "../Slices/commentSlice";
import Picker from "emoji-picker-react";
import { FiSmile, FiSend, FiCornerDownRight } from "react-icons/fi";

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

// Avatar initials helper
function getInitials(name = "User") {
  return name.trim().charAt(0).toUpperCase();
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
      }),
    );

    commentInput.setValue("");
  };

  const handleAddReply = (commentId, text) => {
    dispatch(
      addReply({
        commentId,
        userId: user?.id ?? null,
        text,
      }),
    );
  };

  return (
    <div className="mt-8 w-full max-w-2xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        Comments
        <span className="text-sm font-medium text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full">
          {filteredComments.length}
        </span>
      </h2>

      {/* Input for new comment */}
      <div className="bg-white border border-pink-100 rounded-xl shadow-sm shadow-pink-100 p-3 mb-6">
        <CommentInput
          emoji={commentInput}
          onSubmit={handleAddComment}
          submitLabel="Post"
          username={user?.username}
        />
      </div>

      {/* Comments List */}
      <CommentList comments={filteredComments} onAddReply={handleAddReply} />
    </div>
  );
}

// COMMENTS LIST
function CommentList({ comments, onAddReply }) {
  if (!comments.length)
    return (
      <div className="text-center py-10 border border-dashed border-pink-200 rounded-xl bg-pink-50/40">
        <p className="text-pink-400 font-medium">No comments yet</p>
        <p className="text-sm text-pink-300 mt-1">
          Be the first to share your thoughts 🌸
        </p>
      </div>
    );

  return (
    <div className="space-y-4">
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
  const username = comment.user?.username ?? "User";

  return (
    <div className="bg-white border border-pink-100 rounded-xl shadow-sm shadow-pink-50 p-4 hover:shadow-md hover:shadow-pink-100 transition">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-semibold text-sm shrink-0">
          {getInitials(username)}
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-gray-800 text-sm">
              {username}
            </span>
            {comment.createdAt && (
              <span className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <p className="text-gray-700 text-sm mt-1 leading-relaxed">
            {comment.text}
          </p>
        </div>
      </div>

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
    <div className="ml-12 mt-3 space-y-3 border-l-2 border-pink-100 pl-4">
      {replies.map((r) => {
        const username = r.user?.username ?? "User";
        return (
          <div key={r.id} className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center font-semibold text-xs shrink-0">
              {getInitials(username)}
            </div>
            <div>
              <span className="font-semibold text-gray-700 text-xs">
                {username}
              </span>
              <p className="text-gray-600 text-sm">{r.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// REPLY INPUT
function ReplyInput({ parentId, onAddReply }) {
  const emoji = useEmojiInput("");
  const [showInput, setShowInput] = useState(false);

  const handleReply = () => {
    if (!emoji.value.trim()) return;
    onAddReply(parentId, emoji.value.trim());
    emoji.setValue("");
    setShowInput(false);
  };

  if (!showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        className="ml-12 mt-2 flex items-center gap-1 text-xs font-medium text-pink-500 hover:text-pink-600 transition"
      >
        <FiCornerDownRight size={13} />
        Reply
      </button>
    );
  }

  return (
    <div className="ml-12 mt-2">
      <CommentInput
        emoji={emoji}
        onSubmit={handleReply}
        submitLabel="Reply"
        compact
      />
    </div>
  );
}

// REUSABLE INPUT
function CommentInput({ emoji, onSubmit, submitLabel, username, compact }) {
  return (
    <div className="flex items-center gap-2">
      {!compact && (
        <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-semibold text-xs shrink-0">
          {getInitials(username)}
        </div>
      )}

      <div className="flex items-center flex-1 border border-pink-200 rounded-full px-3 py-1.5 relative bg-pink-50/30 focus-within:ring-2 focus-within:ring-pink-300 focus-within:border-pink-400 transition">
        <button
          type="button"
          className="text-pink-400 hover:text-pink-600 transition mr-2"
          onClick={emoji.toggle}
          aria-label="Add emoji"
        >
          <FiSmile size={18} />
        </button>

        <input
          type="text"
          className="flex-1 outline-none bg-transparent px-1 py-1 text-sm text-gray-700 placeholder:text-pink-300"
          placeholder={
            submitLabel === "Post" ? "Add a comment..." : "Write a reply..."
          }
          value={emoji.value}
          onChange={(e) => emoji.setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        />

        <button
          type="button"
          onClick={onSubmit}
          disabled={!emoji.value.trim()}
          aria-label={submitLabel}
          className="ml-2 flex items-center justify-center w-8 h-8 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <FiSend size={14} />
        </button>

        {emoji.open && (
          <div className="absolute left-0 top-full mt-2 z-50">
            <Picker onEmojiClick={emoji.onEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
}
