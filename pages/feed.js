import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Navbar from "../src/components/Navbar";
import PostCard from "../src/components/PostCard";
import { AuthContext } from "../src/context/AuthContext";
import { getFeed, createPost } from "../src/services/postService";

const FeedPage = () => {
  const router = useRouter();
  const { user: currentUser } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchFeed = async () => {
      try {
        const res = await getFeed();
        setPosts(res.data);
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
    if (!newPostContent.trim()) return;
    try {
      const tagsArray = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      await createPost({ content: newPostContent, tags: tagsArray });
      setNewPostContent("");
      setTagsInput("");
      const res = await getFeed();
      setPosts(res.data);
    } catch (err) {
      console.error("Erreur createPost :", err);
    }
  };

  if (!currentUser) return null;

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-8 p-4">
        <form onSubmit={handlePostSubmit} className="mb-6">
          <textarea
            className="w-full border px-3 py-2 rounded mb-2"
            placeholder="Quoi de neuf ?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows={3}
          ></textarea>
          <input
            type="text"
            placeholder="Tags (séparés par des virgules)"
            className="w-full border px-3 py-2 rounded mb-2"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
};

export default FeedPage;
