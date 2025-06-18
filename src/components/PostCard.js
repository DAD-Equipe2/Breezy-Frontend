import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  likePost,
  unlikePost,
  getPostLikes,
} from "../services/likeService";
import {
  getComments,
  addComment,
  replyToComment,
} from "../services/commentService";
import { modifyPost } from "../services/postService";
import CommentSection from "./CommentSection";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PostCard = ({ post, isOwn }) => {
  const { user: currentUser } = useContext(AuthContext);

  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyToId, setReplyToId] = useState(null);

  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editContentPost, setEditContentPost] = useState(post.content);
  const [contentPost, setContentPost] = useState(post.content);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const res = await getPostLikes(post._id);
        const userIds = res.data.map((l) => l.user._id);
        setIsLiked(userIds.includes(currentUser._id));
        setLikesCount(res.data.length);
      } catch (err) {
        console.error("Erreur getPostLikes :", err);
      }
    })();
  }, [currentUser, post._id]);

  const handleLikeToggle = async () => {
    if (!currentUser) return;
    try {
      if (isLiked) {
        await unlikePost(post._id);
        setIsLiked(false);
        setLikesCount((c) => c - 1);
      } else {
        await likePost(post._id);
        setIsLiked(true);
        setLikesCount((c) => c + 1);
      }
    } catch (err) {
      console.error("Erreur like/unlike :", err);
    }
  };

  const toggleComments = async () => {
    setShowComments((s) => !s);
    if (!showComments) {
      try {
        const res = await getComments(post._id);
        setComments(res.data);
      } catch (err) {
        console.error("Erreur getComments :", err);
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim()) return;
    try {
      if (replyToId) {
        await replyToComment(post._id, replyToId, newComment);
      } else {
        await addComment(post._id, newComment);
      }
      const res = await getComments(post._id);
      setComments(res.data);
      setNewComment("");
      setReplyToId(null);
    } catch (err) {
      console.error("Erreur add/reply commentaire :", err);
    }
  };

  const handleEditSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await modifyPost(post._id, { content: editContentPost });
    setContentPost(res.data.content);
    setIsEditingPost(false);
  } catch (err) {
    alert("Erreur lors de la modification du post");
    console.error(err);
  }
};

  return (
    <div className="bg-white shadow rounded p-4 mb-6">
      <div className="flex items-center space-x-3 mb-2">
        <img
          src={
            post.author.avatarURL
              ? `${API_URL}${post.author.avatarURL}`
              : "/default-avatar.png"
          }
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{post.author.username}</p>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {post.tags?.length > 0 && (
        <div className="flex space-x-2 mb-3">
          {post.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      {post.mediaURL && (
        <img
          src={post.mediaURL}
          alt="Media"
          className="max-h-64 w-full object-cover rounded mb-3"
        />
      )}

        {isEditingPost ? (
        <form onSubmit={handleEditSubmit} className="mb-3">
          <textarea
            className="w-full border rounded p-2"
            value={editContentPost}
            onChange={e => setEditContentPost(e.target.value)}
          />
          <div className="flex space-x-2 mt-2">
            <button
              type="submit"
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Sauvegarder
            </button>
            <button
              type="button"
              className="px-3 py-1 bg-gray-300 rounded"
              onClick={() => {
                setIsEditingPost(false);
                setEditContentPost(contentPost);
              }}
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <p className="mb-3 whitespace-pre-line break-words ">{contentPost}</p>
      )}

      <div className="flex items-center space-x-4 mb-3">
        <button
          onClick={handleLikeToggle}
          className={`flex items-center space-x-1 ${
            isLiked ? "text-red-500" : "text-gray-500"
          } hover:opacity-80`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill={isLiked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
          <span>{likesCount}</span>
        </button>
        <button
          onClick={toggleComments}
          className="flex items-center space-x-1 text-gray-500 hover:opacity-80"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M21 15a2 2 0 002-2V7a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2h3l3 3 3-3h9z"
            />
          </svg>
          <span>{comments.length}</span>
        </button>
        {isOwn && !isEditingPost && (
          <button
            onClick={() => setIsEditingPost(true)}
            className="px-2 py-1 bg-blue-500 text-white rounded ml-2"
          >
            Modifier
          </button>
        )}
      </div>

      {showComments && (
        <CommentSection
          comments={comments}
          onReply={(cid) => setReplyToId(cid)}
          replyToId={replyToId}
          newComment={newComment}
          setNewComment={setNewComment}
          onSubmit={handleCommentSubmit}
        />
      )}
    </div>
  );
};

export default PostCard;
