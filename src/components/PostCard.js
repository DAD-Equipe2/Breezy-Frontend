import { useState, useEffect, useContext } from "react";
import Link from "next/link";

import { AuthContext } from "../context/AuthContext";
import { likePost, unlikePost, getPostLikes } from "../services/likeService";
import { getComments, addComment, replyToComment } from "../services/commentService";
import { modifyPost } from "../services/postService";
import CommentSection from "./CommentSection";
import ImageUploadButton from "./ImageUploadButton";
import PostMenuBurger from "./PostMenuBurger";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MAX_LEN = 280;

export default function PostCard({ post, isOwn, onDelete }) {
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const res = await getPostLikes(post._id);
        const userIds = res.data.map((l) => l.user._id);
        setIsLiked(userIds.includes(currentUser._id));
        setLikesCount(res.data.length);
      } catch {}
    })();
  }, [currentUser, post._id]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getComments(post._id);
        setCommentsCount(res.data.length);
      } catch {}
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
    } catch {}
  };

  const toggleComments = async () => {
    setShowComments((s) => !s);
    if (!showComments) {
      try {
        const res = await getComments(post._id);
        setComments(res.data);
        setCommentsCount(res.data.length);
      } catch {}
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
    } catch {}
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
      JSON.stringify(editTags.split(",").map((t) => t.trim()).filter((t) => t))
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
    } catch {
      setErrorEdit("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="bg-white/80 dark:bg-black/30 text-foreground shadow-2xl rounded-xl p-4 mb-6 border border-gray-300 dark:border-white/20 transition-transform duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] relative">
      {isOwn && !isEditing && (
        <div className="absolute top-3 right-3 z-10">
          <PostMenuBurger
            onEdit={() => setIsEditing(true)}
            onDelete={() => setShowDeleteModal(true)}
          />
        </div>
      )}
      <div className="flex items-center space-x-3 mb-2">
        <img
          src={post.author.avatarURL ? `${API_URL}${post.author.avatarURL}` : "/default-avatar.png"}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <Link href={`/profile/${post.author._id}`} className="font-semibold hover:underline text-blue-700 dark:text-blue-400">
            {post.author.username}
          </Link>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {new Date(post.createdAt).toLocaleDateString()}{" "}
            {new Date(post.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="space-y-3 mb-3 bg-white/90 dark:bg-blue-950/80 rounded-xl p-4 border border-blue-200/40 dark:border-blue-900/40 shadow-lg">
          {errorEdit && <div className="text-red-500 text-sm mb-2">{errorEdit}</div>}
          <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">Contenu du post :</label>
          <div className="relative">
            <textarea
              className="w-full border border-blue-200 dark:border-blue-900 px-3 py-2 rounded-lg bg-white/80 dark:bg-blue-900 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 resize-none"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              maxLength={MAX_LEN}
              placeholder="Modifier le contenu…"
            />
            <span className="absolute bottom-2 right-3 text-xs text-gray-500 dark:text-gray-300">
              {editContent.length}/{MAX_LEN}
            </span>
          </div>
          <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">Tags :</label>
          <input
            type="text"
            className="w-full border border-blue-200 dark:border-blue-900 px-3 py-2 rounded-lg bg-white/80 dark:bg-blue-900 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700"
            placeholder="Tags (séparés par des virgules)"
            value={editTags}
            onChange={(e) => setEditTags(e.target.value)}
          />
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2">
            <label className="block font-medium text-gray-700 dark:text-gray-200">Média :</label>
            <div className="flex items-center gap-2">
              <ImageUploadButton
                onChange={file => setEditMediaFile(file)}
                value={editMediaFile}
                accept="image/*,video/*"
              />
              {editMediaFile && (
                <span className="text-xs text-blue-700 dark:text-blue-300 font-semibold">{editMediaFile.name}</span>
              )}
            </div>
          </div>
          {post.mediaURL && !removeMedia && (
            <div className="mb-2 mt-2">
              {/\.(jpg|jpeg|png|gif)$/i.test(post.mediaURL) ? (
                <img src={`${API_URL}${post.mediaURL}`} className="w-full max-h-48 object-contain rounded" />
              ) : (
                <video src={`${API_URL}${post.mediaURL}`} controls className="w-full max-h-48 object-contain rounded" />
              )}
              <label className="inline-flex items-center mt-1">
                <input
                  type="checkbox"
                  checked={removeMedia}
                  onChange={() => setRemoveMedia(!removeMedia)}
                  className="form-checkbox mr-2"
                />
                Supprimer le média
              </label>
            </div>
          )}
          <div className="flex space-x-2 justify-end mt-4">
            <button type="submit" className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded shadow">Sauvegarder</button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded shadow"
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
          <p className="mb-3 whitespace-pre-line break-words">{post.content}</p>
          {post.tags.length > 0 && (
            <div className="flex space-x-2 mb-3">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs text-blue-600 dark:text-white bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {post.mediaURL && (
            /\.(jpg|jpeg|png|gif)$/i.test(post.mediaURL) ? (
              <img src={`${API_URL}${post.mediaURL}`} className="w-full max-h-96 object-contain rounded mb-3" />
            ) : (
              <video src={`${API_URL}${post.mediaURL}`} controls className="w-full max-h-96 object-contain rounded mb-3" />
            )
          )}
        </>
      )}

      <div className="flex items-center space-x-4 mb-3">
        <button
          onClick={handleLikeToggle}
          className={`flex items-center space-x-1 ${isLiked ? "text-red-500" : "text-gray-600 dark:text-gray-300"} hover:opacity-80`}
        >
          <span>{isLiked ? "❤️" : "🤍"}</span>
          <span>{likesCount}</span>
        </button>
        <button
          onClick={toggleComments}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:opacity-80"
        >
          💬
          {commentsCount > 0 && <span className="ml-1 font-semibold">{commentsCount}</span>}
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
          postId={post._id}
          setComments={setComments}
        />
      )}

    {showDeleteModal && (
    <div className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-blue-950 text-foreground dark:text-white rounded shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-lg font-bold mb-2">Supprimer le post</h2>
        <p className="mb-4">
          Êtes-vous sûr de vouloir supprimer ce post ? Cette action est <span className="font-semibold text-red-600">irréversible</span>.
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 dark:text-white rounded"
            onClick={() => setShowDeleteModal(false)}
          >
            Annuler
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            onClick={async () => {
              try {
                await fetch(`${API_URL}/posts/${post._id}`, {
                  method: "DELETE",
                  credentials: "include",
                });
                setShowDeleteModal(false);
                onDelete(post._id);
              } catch {
                alert("Erreur lors de la suppression du post.");
              }
            }}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
    )}
    </div>    
  );
}
