import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const getProfile = async (id) => {
  const res = await axios.get(`${API_BASE}/users/profile/${id}`);
  return res.data.data;
};

export const updateProfile = async ({ bio, avatarURL }) => {
  const res = await axios.put(`${API_BASE}/users/profile`, { bio, avatarURL });
  return res.data.data;
};

export const searchUsers = async (query) => {
  if (!query) return [];
  const res = await axios.get(`${API_BASE}/users/search`, { params: { query } });
  return res.data
}

export async function deleteProfile() {
  const token = localStorage.getItem("breezyToken");
  const res = await axios.delete(`${API_BASE}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.data.success) throw new Error(res.data.message || "Erreur lors de la suppression du profil");
  return res.data;
}