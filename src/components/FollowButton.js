import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { followUser, unfollowUser } from "../services/followService";

const FollowButton = ({ targetUserId }) => {
  const { user: currentUser } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const checkFollow = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/follow/following/${currentUser.id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("breezyToken")}` },
          }
        );
        const data = await res.json();
        if (data.success) {
          const ids = data.data.map((u) => u._id);
          setIsFollowing(ids.includes(targetUserId));
        }
      } catch (err) {
        console.error("Erreur checkFollow :", err);
      }
    };
    checkFollow();
  }, [currentUser, targetUserId]);

  const handleFollowToggle = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(targetUserId);
        setIsFollowing(false);
      } else {
        await followUser(targetUserId);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("Erreur follow/unfollow :", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={`px-4 py-1 rounded ${
        isFollowing ? "bg-red-500 text-white" : "bg-blue-500 text-white"
      } hover:opacity-80 disabled:opacity-50`}
    >
      {loading
        ? "..."
        : isFollowing
        ? "Se désabonner"
        : "Suivre"}
    </button>
  );
};

export default FollowButton;
