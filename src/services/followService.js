import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const followUser = async (targetUserId) => {
  const res = await axios.post(`${API_URL}/follow/follow/${targetUserId}`);
  return res.data;
};

export const unfollowUser = async (targetUserId) => {
  const res = await axios.post(`${API_URL}/follow/unfollow/${targetUserId}`);
  return res.data;
};

export const getFollowers = async (userId) => {
  const res = await axios.get(`${API_URL}/follow/followers/${userId}`);
  return res.data;
};

export const getFollowing = async (userId) => {
  const res = await axios.get(`${API_URL}/follow/following/${userId}`);
  return res.data;
};
