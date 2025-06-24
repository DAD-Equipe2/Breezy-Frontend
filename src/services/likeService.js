import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const likePost = async (postId) => {
  const res = await axios.post(`${API_URL}/likes/post/${postId}`, { withCredentials: true });
  return res.data;
};

export const unlikePost = async (postId) => {
  const res = await axios.delete(`${API_URL}/likes/post/${postId}`, { withCredentials: true });
  return res.data;
};

export const getPostLikes = async (postId) => {
  const res = await axios.get(`${API_URL}/likes/post/${postId}`, { withCredentials: true });
  return res.data;
};
