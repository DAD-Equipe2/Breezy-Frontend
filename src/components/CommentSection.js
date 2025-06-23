import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { deleteComment, getComments } from "../services/commentService"

const API_URL = process.env.NEXT_PUBLIC_API_URL;



function CommentItem({ comment, onReply, replyToId, currentUser, onDelete }) {
  return (
    <div className="mb-4 border-l pl-4">
      <div className="flex items-center space-x-2">
        <img
          src={
            comment.author && comment.author.avatarURL
              ? `${API_URL}${comment.author.avatarURL}`
              : "/default-avatar.png"
          }
          alt="Avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
        <p className="font-medium text-sm">
          {comment.author ? comment.author.username : "Utilisateur inconnu"}
        </p>          
        <p className="text-xs text-gray-500">
          {new Date(comment.createdAt).toLocaleDateString()}{" "}
          {new Date(comment.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
        {currentUser && comment.author && currentUser._id === comment.author._id && (
          <button
            className="text-xs text-red-500 hover:underline ml-2"
            onClick={() => onDelete(comment._id)}
          >
            Supprimer
          </button>
        )}
      </div>
      {comment.children && comment.children.length > 0 && (
        <div>
          {comment.children.map((sub) => (
            <CommentItem
              key={sub._id}
              comment={sub}
              onReply={onReply}
              replyToId={replyToId}
              currentUser={currentUser}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const CommentSection = ({
  comments,
  onReply,
  replyToId,
  newComment,
  setNewComment,
  onSubmit,
  postId,
  setComments,
}) => {
  const { user: currentUser } = useContext(AuthContext);

  const handleDelete = async (commentId) => {
    await deleteComment(commentId);
    const res = await getComments(postId);
    setComments(res.data);
  };

  return (
    <div className="mt-4 border-t pt-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          onReply={onReply}
          replyToId={replyToId}
          currentUser={currentUser}
          onDelete={handleDelete}
        />
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
            maxLength={280}
          ></textarea>
          <div className="text-right text-xs text-gray-600 mb-2">
              {newComment.length}/280
            </div>
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