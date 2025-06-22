import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("breezyToken");
    if (!storedToken){
      setLoading(false);
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    setToken(storedToken);

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`)
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.data);
        } else {
          localStorage.removeItem("breezyToken");
          setToken(null);
        }
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("breezyToken");
        setToken(null);
        setLoading(false);
      });
  }, []);

  const login = (tokenJWT) => {
    localStorage.setItem("breezyToken", tokenJWT);
    axios.defaults.headers.common["Authorization"] = `Bearer ${tokenJWT}`;
    setToken(tokenJWT);

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`)
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.data);
        }
      })
      .catch(() => {});
  };

  const logout = () => {
    localStorage.removeItem("breezyToken");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setToken(null);
    window.location.href = "/";
  };

  if (loading) {
    return null
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const refreshAccessToken = async () => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {}, { withCredentials: true });
    const data = res.data;
    if (data.success) {
      localStorage.setItem("breezyToken", data.accessToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
      setToken(data.accessToken)
      return data.accessToken;
    } else {
      logout();
      return null;
    }  
  } catch (error) {
    logout();
    return null;
  }
};

axios.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        return axios(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);
