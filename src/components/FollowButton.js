import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { followUser, unfollowUser } from "../services/followService";

const FollowButton = ({ targetUserId, onFollowChange }) => {
  const { user: currentUser } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const checkFollow = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/follow/following/${currentUser._id}`,
          {
            credentials: "include"
          }
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const ids = data.data.map((u) => String(u._id || u.id));
          setIsFollowing(ids.includes(String(targetUserId)));
        } else {
          setIsFollowing(false);
        }
      } catch (err) {
        console.error("Erreur checkFollow :", err);
        setIsFollowing(false);
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
      if (onFollowChange) onFollowChange();
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
