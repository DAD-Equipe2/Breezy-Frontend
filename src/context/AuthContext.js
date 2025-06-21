import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("breezyToken");
    if (!storedToken) return;

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
      })
      .catch(() => {
        localStorage.removeItem("breezyToken");
        setToken(null);
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

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
