import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("breezyToken")}`,
  },
});

export const followUser = async (targetUserId) => {
  const res = await axios.post(`${API_URL}/follow/follow/${targetUserId}`, {}, { withCredentials: true });
  return res.data;
};

export const unfollowUser = async (targetUserId) => {
  const res = await axios.post(`${API_URL}/follow/unfollow/${targetUserId}`, {}, { withCredentials: true });
  return res.data;
};

export const getFollowers = async (userId) => {
  const res = await axios.get(`${API_URL}/follow/followers/${userId}`, { withCredentials: true });
  return res.data;
};

export const getFollowing = async (userId) => {
  const res = await axios.get(`${API_URL}/follow/following/${userId}`, { withCredentials: true });
  return res.data;
};