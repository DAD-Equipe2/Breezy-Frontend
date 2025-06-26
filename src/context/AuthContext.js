import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { withCredentials: true })
    .then((res) => {
      if (res.data.success) {
        setUser(res.data.data);
      }
      setLoading(false);
    })
    .catch(() => {
      setUser(null);
      setLoading(false);
    });
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try{
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, credentials, { withCredentials: true });
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { withCredentials: true })
      if (res.data.success) {
        setUser(res.data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  }

  const logout = async () => {
    if (!user) {
      router.replace("/");
      return;
    }
      
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (error) { }
    setUser(null);
    router.replace("/")
  };

  const refreshAccessToken = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {}, { withCredentials: true });
      const data = res.data;
      if (data.success) {
        return;
      } else {
        if (user) logout();
        return null;
      }  
    } catch (error) {
      if (user) logout();
      return null;
    }
  };

  axios.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      if (error.response && error.response.status === 401 && !originalRequest._retry && !originalRequest.url.endsWith("/auth/refresh-token")) {
        originalRequest._retry = true;
        await refreshAccessToken();
        return axios(originalRequest);
      }
      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
