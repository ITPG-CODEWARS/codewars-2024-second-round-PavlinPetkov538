import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext"; // Import the Auth context
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const { register } = useAuth(); // Access the register function from context
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      // Call register from AuthContext
      await register(email, password, fullName);
      navigate("/"); // Navigate to login on successful registration
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="container" style={{ maxWidth: "500px", marginTop: "40px" }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp} style={{ marginTop: "20px" }}>
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
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
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit" className="btn btn-primary w-100">
          Sign Up
        </button>
      </form>
      <p className="text-center mt-4">
        Already have an account? <a onClick={navigateToLogin}>Sign In</a>
      </p>
    </div>
  );
};

export default Register;
