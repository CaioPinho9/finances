import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth.js";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    login(decoded);
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <p>Use your Google account to continue</p>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => alert("Login failed")}
        />
      </div>
    </div>
  );
}
