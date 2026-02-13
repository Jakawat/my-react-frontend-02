import { useRef, useState } from "react";
import { useUser } from "../UserProvider";
import { Navigate } from "react-router-dom";

export default function Login() {
  const [controlState, setControlState] = useState({
    isLoggingIn: false,
    isLoginError: false,
    isLoginOk: false
  });
  const emailRef = useRef();
  const passRef = useRef();
  const { user, login } = useUser();

  async function onLogin() {
    setControlState((prev) => {
      return {
        ...prev,
        isLoggingIn: true
      };
    });

    const email = emailRef.current.value;
    const pass = passRef.current.value;

    console.log("Attempting login with:", email);
    
    const result = await login(email, pass);
    
    console.log("Login result:", result);
    console.log("User after login:", user);

    setControlState(() => {
      return {
        isLoggingIn: false,
        isLoginError: result === false,
        isLoginOk: result !== false
      };
    });
  }

  console.log("Current user state:", user);
  console.log("Is logged in:", user.isLoggedIn);

  if (user.isLoggedIn) {
    console.log("User is logged in, redirecting to profile");
    return <Navigate to="/profile" replace />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>
      <table>
        <tbody>
          <tr>
            <th>Email:</th>
            <td>
              <input 
                type="text" 
                name="email" 
                id="email" 
                ref={emailRef}
                defaultValue="test@example.com"
              />
            </td>
          </tr>
          <tr>
            <th>Password:</th>
            <td>
              <input 
                type="password" 
                name="password" 
                id="password" 
                ref={passRef}
                defaultValue="password123"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <button 
        onClick={onLogin} 
        disabled={controlState.isLoggingIn}
        style={{ marginTop: "10px", padding: "8px 16px" }}
      >
        {controlState.isLoggingIn ? "Logging in..." : "Login"}
      </button>
      {controlState.isLoginError && (
        <div style={{ color: "red", marginTop: "10px" }}>
          Login failed. Please check your credentials.
        </div>
      )}
      {controlState.isLoginOk && (
        <div style={{ color: "green", marginTop: "10px" }}>
          Login successful! Redirecting...
        </div>
      )}
    </div>
  );
}