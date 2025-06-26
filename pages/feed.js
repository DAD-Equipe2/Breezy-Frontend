'use client';

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

import Navbar from "../src/components/Navbar";
import PostCard from "../src/components/PostCard";
import { AuthContext } from "../src/context/AuthContext";
import { getFeed, createPost } from "../src/services/postService";
import ImageUploadButton from "../src/components/ImageUploadButton";

export default function FeedPage() {
  const router = useRouter();
  const { user: currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [error, setError] = useState("");
  const MAX_LEN = 280;

  useEffect(() => {
    if (!currentUser) {
      router.replace("/");
      return;
    }
    (async () => {
      try {
        const postsArray = await getFeed();
        setPosts(postsArray);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser, router]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const content = newPostContent.trim();
    if (!content) {
      setError("Le contenu est requis");
      return;
    }
    if (content.length > MAX_LEN) {
      setError(`Le contenu ne doit pas dépasser ${MAX_LEN} caractères`);
      return;
    }
    if (mediaFile) {
      const isImage = mediaFile.type.startsWith("image/");
      const max = isImage ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
      if (mediaFile.size > max) {
        setError(`Le fichier dépasse la limite de ${isImage ? "5" : "50"} Mo`);
        return;
      }
    }
    try {
      const tagsArray = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      await createPost({ content, tags: tagsArray, media: mediaFile });
      setNewPostContent("");
      setTagsInput("");
      setMediaFile(null);
      const postsArray = await getFeed();
      setPosts(postsArray);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de la création");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-0 animate-bg-pan bg-[linear-gradient(var(--grad-angle),var(--grad-from),var(--grad-to))] bg-[length:300%_300%]"></div>
      <Navbar />
      <div className="relative flex justify-center md:justify-between max-w-full">
        <main className="w-full md:w-1/2 max-w-2xl mx-auto mt-8 p-4 min-h-screen pt-28 md:pt-20 z-10 text-foreground">
          {/* Encadrement */}
          <div className="bg-white/80 dark:bg-blue-950/80 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-200/60 dark:border-blue-900/60 p-6 mb-8 transition-all duration-200 hover:shadow-[0_8px_40px_rgba(59,130,246,0.15)]">
            <form onSubmit={handlePostSubmit} className="mb-0">
              {error && (
                <div className="text-red-500 dark:text-red-400 text-sm mb-2">{error}</div>
              )}
              <textarea
                placeholder="Quoi de neuf ?"
                value={newPostContent}
                onChange={(e) => {
                  setNewPostContent(e.target.value);
                  if (error) setError("");
                }}
                rows={3}
                maxLength={MAX_LEN}
                className="bg-gray-100 dark:bg-blue-900 shadow-inner rounded-xl p-4 w-full border border-gray-200 dark:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition-transform duration-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-gray-900 dark:text-white"
              />
              <div className="text-right text-xs text-gray-600 dark:text-gray-300 mb-2">
                {newPostContent.length}/{MAX_LEN}
              </div>
              <input
                type="text"
                placeholder="Tags (séparés par des virgules)"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="bg-blue-200 dark:bg-blue-900 text-blue-600 dark:text-blue-300 placeholder-white dark:placeholder-blue-200 shadow-xl rounded-xl p-4 w-full border border-white/40 dark:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700"
                style={{ height: "56px" }}
              />
              <div className="h-4" />
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="flex flex-col items-center">
                  <ImageUploadButton onChange={(e) => setMediaFile(e.target.files[0])} />
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 mt-2">Ajouter un média</span>
                </div>
                {mediaFile && (
                  <span className="text-xs text-gray-600 dark:text-gray-300">{mediaFile.name}</span>
                )}
                <button
                  type="submit"
                  disabled={
                    !newPostContent.trim() ||
                    newPostContent.length > MAX_LEN
                  }
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded disabled:opacity-50 ml-2"
                >
                  Publier
                </button>
              </div>
            </form>
          </div>

          <hr className="my-6 border-blue-200/60 dark:border-blue-900/60" />
          {/* posts */}
          {loading ? (
            <div className="text-foreground">Chargement du feed…</div>
          ) : posts.length === 0 ? (
            <p className="text-foreground">Aucun post trouvé. Créez-en un !</p>
          ) : (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          )}
        </main>
      </div>
    </>
  );
}
