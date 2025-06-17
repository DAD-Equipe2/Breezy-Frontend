import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createPost = async (postData) => {
  const res = await axios.post(`${API_URL}/posts`, postData);
  return res.data;
};

export const getUserPosts = async (userId) => {
  const res = await axios.get(`${API_URL}/posts/user/${userId}`);
  return res.data;
};

export const getFeed = async () => {
  const res = await axios.get(`${API_URL}/posts/feed`);
  return res.data;
};
