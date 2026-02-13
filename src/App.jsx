import { Route, Routes } from "react-router-dom";
import "./App.css";

// Ensure these paths match your actual folder names in VS Code
import Login from "./contexts/pages/Login"; 
import Profile from "./contexts/pages/Profile"; 
import Logout from "./contexts/pages/Logout";

function App() {
  return (
    <Routes>
      {/* Home defaults to Login */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      
      {/* User Profile Page */}
      <Route path="/profile" element={<Profile />} />
      
      {/* Logout Action Page */}
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
}

export default App;