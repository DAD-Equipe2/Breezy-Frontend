import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const CommentSection = ({
  comments,
  onReply,
  replyToId,
  newComment,
  setNewComment,
  onSubmit,
}) => {
  const { user: currentUser } = useContext(AuthContext);

  return (
    <div className="mt-4 border-t pt-4">
      {comments.map((comment) => (
        <div key={comment._id} className="mb-3">
          <div className="flex items-center space-x-2">
            <img
              src={
                comment.author.avatarURL
                  ? `${API_URL}${comment.author.avatarURL}`
                  : "/default-avatar.png"
              }
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-sm">{comment.author.username}</p>
              <p className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}{" "}
                {new Date(comment.createdAt)
                  .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            {replyToId === comment._id && (
              <span className="text-xs text-blue-600 ml-2">Réponse en cours...</span>
            )}
          </div>
          <p className="ml-10">{comment.content}</p>
          <div className="ml-10 mt-1">
            {currentUser && (
              <button
                className="text-xs text-blue-500 hover:underline"
                onClick={() => onReply(comment._id)}
              >
                Répondre
              </button>
            )}
          </div>

          {comment.replies.map((sub) => (
            <div key={sub._id} className="ml-10 mt-2">
              <div className="flex items-center space-x-2">
                <img
                  src={
                    sub.author.avatarURL
                      ? `${API_URL}${sub.author.avatarURL}`
                      : "/default-avatar.png"
                  }
                  alt="Avatar"
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-sm">{sub.author.username}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(sub.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="ml-9">{sub.content}</p>
            </div>
          ))}
        </div>
      ))}

      {currentUser && (
        <form onSubmit={onSubmit} className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={
              replyToId ? "Votre réponse..." : "Ajouter un commentaire..."
            }
            className="w-full border px-2 py-1 rounded"
            rows={2}
          ></textarea>
          <button
            type="submit"
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {replyToId ? "Répondre" : "Commenter"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;
