import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const register = async (userData) => {
  const {
    data: { data },
  } = await axios.post(`${API_URL}/auth/register`, userData, {withCredentials: true});
  return data;
};

export const login = async (credentials) => {
  const {
    data: { data },
  } = await axios.post(`${API_URL}/auth/login`, credentials, {withCredentials: true});
  return data;
};
