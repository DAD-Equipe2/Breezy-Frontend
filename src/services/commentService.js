import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const addComment = async (postId, content) => {
  const res = await axios.post(`${API_URL}/comments`, { postId, content });
  return res.data;
};

export const replyToComment = async (postId, parentCommentId, content) => {
  const res = await axios.post(`${API_URL}/comments/reply`, {
    postId,
    parentCommentId,
    content,
  });
  return res.data;
};

export const getComments = async (postId) => {
  const res = await axios.get(`${API_URL}/comments/post/${postId}`);
  return res.data;
};
