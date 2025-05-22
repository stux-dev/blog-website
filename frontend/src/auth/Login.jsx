import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser, setAuthToken } from "./authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authdata = await loginUser(email, password);

    if (authdata.token) {
      setAuthToken(authdata.token);
      login(authdata.token, authdata.user);
      navigate("/dashboard");
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 text-center mb-6">
          Sign in to <span className="font-unbounded">StuxDev</span>
        </h2>

       
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="block w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="********"
              className="block w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition"
            />
          </div>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-md bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-black dark:hover:bg-neutral-200 px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-neutral-500"
          >
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={goToRegister}
            className="font-medium underline hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            Register Here
          </button>
        </p>
      </div>
    </div>
  );
}
