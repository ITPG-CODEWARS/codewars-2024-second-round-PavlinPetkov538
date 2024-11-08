import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext"; // Import the Auth context
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { login } = useAuth(); // Access the login function from context
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Call login from AuthContext
      await login(email, password);
      navigate("/"); // Redirect to a home or dashboard page on successful login
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  const navigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="container" style={{ maxWidth: "500px", marginTop: "40px" }}>
      <h1 className="text-center">Sign In</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <div className="mb-4">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>
        )}
        <button type="submit" className="btn btn-primary w-100">
          Sign In
        </button>
      </form>
      <p className="text-center mt-4">
        Don&apos;t have an account? <a onClick={navigateToRegister}>Sign Up</a>
      </p>
    </div>
  );
};

export default Login;
