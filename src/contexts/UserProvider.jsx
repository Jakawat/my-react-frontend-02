import { useContext, useState } from "react";
import { UserContext } from "./UserContext";

export function UserProvider({ children }) {
  const initialUser = JSON.parse(localStorage.getItem("session")) ?? {
    isLoggedIn: false,
    name: '',
    email: ''
  };
//test
  const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState(initialUser);

  const login = async (email, password) => {
    try {
      console.log("Sending login request to:", `${API_URL}/api/user/login`);
      
      const result = await fetch(`${API_URL}/api/user/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
        credentials: "include"
      });

      console.log("Login response status:", result.status);


      if (result.status !== 200) {
        console.log("Login failed with status:", result.status);
        return false;
      }

      const data = await result.json();
      console.log("Login response data:", data);

      const newUser = { isLoggedIn: true, name: '', email: email };
      setUser(newUser);
      localStorage.setItem("session", JSON.stringify(newUser));
      
      console.log("User state updated:", newUser);
      return true;
    } catch (error) {
      console.log("Login Exception:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const result = await fetch(`${API_URL}/api/user/logout`, {
        method: "POST",
        credentials: "include"
      });
      console.log("Logout response:", result.status);
    } catch (error) {
      console.log("Logout error:", error);
    }

    const newUser = { isLoggedIn: false, name: '', email: '' };
    setUser(newUser);
    localStorage.setItem("session", JSON.stringify(newUser));
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  return useContext(UserContext);
}