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
  const [error, setError] = useState("");
  const MAX_LEN = 280;

  useEffect(() => {
    if (!currentUser) router.push("/login");
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchFeed = async () => {
      try {
        const postsArray = await getFeed();
        setPosts(postsArray);
      } catch (err) {
        console.error("Erreur getFeed :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
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
    try {
      const tagsArray = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      await createPost({ content, tags: tagsArray });
      setNewPostContent("");
      setTagsInput("");
      const postsArray = await getFeed();
      setPosts(postsArray);
    } catch (err) {
      console.error("Erreur createPost :", err);
      setError(err.response?.data?.message || "Erreur lors de la création");
    }
  };

  if (!currentUser) return null;

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-8 p-4">
        <form onSubmit={handlePostSubmit} className="mb-6">
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <textarea
            className="w-full border px-3 py-2 rounded mb-1"
            placeholder="Quoi de neuf ?"
            value={newPostContent}
            onChange={(e) => {
              setNewPostContent(e.target.value);
              if (error) setError("");
            }}
            rows={3}
            maxLength={MAX_LEN}
          />
          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
            <span>
              {newPostContent.length}/{MAX_LEN}
            </span>
            <input
              type="text"
              placeholder="Tags (séparés par des virgules)"
              className="border px-3 py-2 rounded flex-1 mx-4"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={!newPostContent.trim() || newPostContent.length > MAX_LEN}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Publier
            </button>
          </div>
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
