import { useState, useEffect, useContext } from "react";
import Link from "next/link";

import { AuthContext } from "../context/AuthContext";
import { likePost, unlikePost, getPostLikes } from "../services/likeService";
import { getComments, addComment, replyToComment } from "../services/commentService";
import { modifyPost } from "../services/postService";
import CommentSection from "./CommentSection";
import EditButton from "./EditButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MAX_LEN = 280;

export default function PostCard({ post, isOwn }) {
  const { user: currentUser } = useContext(AuthContext);

  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyToId, setReplyToId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editTags, setEditTags] = useState(post.tags.join(", "));
  const [editMediaFile, setEditMediaFile] = useState(null);
  const [removeMedia, setRemoveMedia] = useState(false);
  const [errorEdit, setErrorEdit] = useState("");

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const res = await getPostLikes(post._id);
        const userIds = res.data.map((l) => l.user._id);
        setIsLiked(userIds.includes(currentUser._id));
        setLikesCount(res.data.length);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [currentUser, post._id]);

  // Ajout : charger le nombre de commentaires au montage
  useEffect(() => {
    (async () => {
      try {
        const res = await getComments(post._id);
        setCommentsCount(res.data.length);
      } catch (err) {
        // ignore
      }
    })();
  }, [post._id]);

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
      console.error(err);
    }
  };

  const toggleComments = async () => {
    setShowComments((s) => !s);
    if (!showComments) {
      try {
        const res = await getComments(post._id);
        setComments(res.data);
        setCommentsCount(res.data.length); // Met à jour le nombre lors de l'ouverture
      } catch (err) {
        console.error(err);
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
      console.error(err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setErrorEdit("");
    if (!editContent.trim()) {
      setErrorEdit("Le contenu est requis");
      return;
    }
    if (editContent.length > MAX_LEN) {
      setErrorEdit(`Max ${MAX_LEN} caractères`);
      return;
    }
    const form = new FormData();
    form.append("content", editContent.trim());
    form.append(
      "tags",
      JSON.stringify(
        editTags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t)
      )
    );
    if (editMediaFile) {
      form.append("media", editMediaFile);
    }
    form.append("removeMedia", removeMedia ? "true" : "false");
    try {
      const updated = await modifyPost(post._id, form);
      post.content = updated.content;
      post.tags = updated.tags;
      post.mediaURL = updated.mediaURL;
      setIsEditing(false);
      setEditMediaFile(null);
      setRemoveMedia(false);
    } catch (err) {
      console.error(err);
      setErrorEdit("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="bg-gray-100 shadow-2xl rounded-xl p-4 mb-6 border border-gray-200 transition-transform duration-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative">
      {/* modif */}
      {isOwn && !isEditing && (
        <div className="absolute top-3 right-3 z-10">
          <EditButton onClick={() => setIsEditing(true)} title="Modifier le post" />
        </div>
      )}
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
          <Link
            href={`/profile/${post.author._id}`}
            className="font-semibold hover:underline text-blue-700"
          >
            {post.author.username}
          </Link>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}{" "}
            {new Date(post.createdAt)
              .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="space-y-2 mb-3">
          {errorEdit && (
            <div className="text-red-500 text-sm">{errorEdit}</div>
          )}
          <textarea
            className="w-full border px-2 py-1 rounded"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            maxLength={MAX_LEN}
            placeholder="Modifier le contenu…"
          />
          <div className="text-right text-xs text-gray-600">
            {editContent.length}/{MAX_LEN}
          </div>
          <input
            type="text"
            className="w-full border px-2 py-1 rounded"
            placeholder="Tags (séparés par des virgules)"
            value={editTags}
            onChange={(e) => setEditTags(e.target.value)}
          />
          {post.mediaURL && (
            <div className="mb-2">
              {!removeMedia && (() => {
                const url = post.mediaURL.startsWith("http")
                  ? post.mediaURL
                  : `${API_URL}${post.mediaURL}`;
                const ext = post.mediaURL.split(".").pop().toLowerCase();
                const imageExt = ["png", "jpg", "jpeg", "gif"];
                if (imageExt.includes(ext)) {
                  return (
                    <img
                      src={url}
                      className="w-full max-h-48 object-contain rounded mb-1"
                    />
                  );
                } else {
                  return (
                    <video
                      src={url}
                      controls
                      className="w-full max-h-48 object-contain rounded mb-1"
                    />
                  );
                }
              })()}
              <label className="inline-flex items-center mt-1">
                <input
                  type="checkbox"
                  checked={removeMedia}
                  onChange={() => setRemoveMedia((r) => !r)}
                  className="form-checkbox mr-2"
                />
                Supprimer le média
              </label>
            </div>
          )}
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setEditMediaFile(e.target.files[0])}
            className="block"
          />
          <div className="flex space-x-2">
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
                setIsEditing(false);
                setEditContent(post.content);
                setEditTags(post.tags.join(", "));
                setEditMediaFile(null);
                setRemoveMedia(false);
                setErrorEdit("");
              }}
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="mb-3 whitespace-pre-line break-words">
            {post.content}
          </p>

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

          {post.mediaURL && (() => {
            const url = post.mediaURL.startsWith("http")
              ? post.mediaURL
              : `${API_URL}${post.mediaURL}`;
            const ext = post.mediaURL.split(".").pop().toLowerCase();
            const imageExt = ["png", "jpg", "jpeg", "gif"];
            if (imageExt.includes(ext)) {
              return (
                <img
                  src={url}
                  alt="Media"
                  className="w-full max-h-96 object-contain rounded mb-3"
                />
              );
            } else {
              return (
                <video
                  src={url}
                  controls
                  className="w-full max-h-96 object-contain rounded mb-3"
                />
              );
            }
          })()}
        </>
      )}

      <div className="flex items-center space-x-4 mb-3">
        <button
          onClick={handleLikeToggle}
          className={`flex items-center space-x-1 ${
            isLiked ? "text-red-500" : "text-gray-500"
          } hover:opacity-80`}
        >
          {/* like */}
          {isLiked ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
          <span>{likesCount}</span>
        </button>
        {/* commentaires*/}
        <button
          onClick={toggleComments}
          className="flex items-center text-gray-500 hover:opacity-80"
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
          {commentsCount > 0 && (
            <span className="ml-1 font-semibold">{commentsCount}</span>
          )}
        </button>
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
}
