// src/services/postService.js
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createPost = async ({ content, tags, media }) => {
  const form = new FormData();
  form.append("content", content);
  if (tags && tags.length) form.append("tags", JSON.stringify(tags));
  if (media) form.append("media", media);
  const res = await axios.post(`${API_URL}/posts`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const getUserPosts = async (userId) => {
  const res = await axios.get(`${API_URL}/posts/user/${userId}`);
  return res.data.data;
};

export const getFeed = async () => {
  const res = await axios.get(`${API_URL}/posts/feed`);
  return res.data.data;
};

export const modifyPost = async (postId, { content, tags, media }) => {
  const form = new FormData();
  if (content !== undefined) form.append("content", content);
  if (tags !== undefined) form.append("tags", JSON.stringify(tags));
  if (media) form.append("media", media);
  const res = await axios.patch(`${API_URL}/posts/${postId}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const deletePost = async (postId) => {
  const res = await axios.delete(`${API_URL}/posts/${postId}`);
  return res.data;
};