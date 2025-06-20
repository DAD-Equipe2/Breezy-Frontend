import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Navbar from "../src/components/Navbar";
import PostCard from "../src/components/PostCard";
import { AuthContext } from "../src/context/AuthContext";
import { getFeed, createPost } from "../src/services/postService";

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
    if (!currentUser) router.push("/login");
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
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
  }, [currentUser]);

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
        setError(
          `Le fichier dépasse la limite de ${isImage ? "5" : "50"} Mo`
        );
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

  if (!currentUser) return null;

  return (
    <>
      <div className="fixed inset-0 z-0 animate-bg-pan bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300 bg-[length:300%_300%]"></div>
      <Navbar />
      <div className="relative max-w-2xl mx-auto mt-8 p-4 min-h-screen pt-20 z-10">
        <form onSubmit={handlePostSubmit} className="mb-6">
          {error && (
            <div className="text-red-500 text-sm mb-2">{error}</div>
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
            className="bg-gray-100 shadow-2xl rounded-xl p-4 w-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform duration-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          />
          <div className="text-right text-xs text-gray-600 mb-2">
            {newPostContent.length}/{MAX_LEN}
          </div>
          <input
            type="text"
            placeholder="Tags (séparés par des virgules)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="bg-white/30 backdrop-blur-md text-blue-600 placeholder-white/80 shadow-xl rounded-xl p-4 w-full border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 ..."
            style={{ height: "56px" }}
          />
          <div className="h-4" />
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setMediaFile(e.target.files[0])}
            className="mb-2"
          />
          <button
            type="submit"
            disabled={
              !newPostContent.trim() ||
              newPostContent.length > MAX_LEN
            }
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Publier
          </button>
        </form>
        {loading ? (
          <div>Chargement du feed…</div>
        ) : posts.length === 0 ? (
          <p>Aucun post trouvé. Créez-en un !</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </>
  );
}
