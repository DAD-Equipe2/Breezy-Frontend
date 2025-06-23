import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const addComment = async (postId, content) => {
  const res = await axios.post(`${API_URL}/comments`, { postId, content });
  return res.data;
};

export const replyToComment = async (postId, parentId, content) => {
  const res = await axios.post(`${API_URL}/comments/reply`, {
    postId,
    parentId,
    content,
  });
  return res.data;
};

export const getComments = async (postId) => {
  const res = await axios.get(`${API_URL}/comments/post/${postId}`);
  return res.data;
};

export const deleteComment = async (commentId) => {
  const res = await axios.delete(`${API_URL}/comments/${commentId}`);
  return res.data;
}