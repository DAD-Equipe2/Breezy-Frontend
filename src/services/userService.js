import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const getProfile = async (id) => {
  const res = await axios.get(`${API_BASE}/users/profile/${id}`, {withCredentials: true});
  return res.data.data;
};

export const updateProfile = async ({ username, bio, avatarURL }) => {
  const res = await axios.put(`${API_BASE}/users/profile`, { username, bio, avatarURL }, {withCredentials: true});
  return res.data.data;
};

export const searchUsers = async (query) => {
  if (!query) return [];
  const res = await axios.get(`${API_BASE}/users/search`, { params: { query }, withCredentials: true },);
  return res.data
}

export async function deleteProfile() {
  const res = await axios.delete(`${API_BASE}/users/profile`, { withCredentials: true });
  if (!res.data.success) throw new Error(res.data.message || "Erreur lors de la suppression du profil");
  return res.data;
}