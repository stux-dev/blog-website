import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser, setAuthToken } from "./authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser(email, password); 
    if (token) {
        setAuthToken(token);
        login(token); 
        navigate("/dashboard");
    }
  };

  return (
    <div className="bg-white">

        <form onSubmit={handleSubmit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
        <button type="submit">Login</button>
        </form>
    </div>
  );
}
