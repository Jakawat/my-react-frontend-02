import { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserProvider";
import { Navigate } from "react-router-dom";

export default function Logout() {
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useUser();

  async function onLogout() {
    await logout();
    setIsLoading(false);
  }

  useEffect(() => {
    onLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  if (isLoading) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>Logging out...</h3>
      </div>
    );
  } else {
    // Redirect to the home/login page
    return <Navigate to="/" replace />;
  }
}