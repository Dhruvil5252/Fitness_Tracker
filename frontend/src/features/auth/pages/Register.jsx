import { Link, useNavigate } from "react-router";
import "../login.form.scss";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, setRegistrationData } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await setRegistrationData({ username, email, password });
    navigate("/profile");
  };

  if (loading) {
    return (
      <main>
        <h1>Loading.......</h1>
      </main>
    );
  }

  return (
    <main>
      <div className="login-card">
        {/* Left Sidebar */}
        <div className="login-sidebar">
          <div className="sidebar-top">
            <div className="logo">
              <img src="/logo.png" width="32px" height="32px" alt="FitTrack" />
              <h2 className="heading-text">FitTrack</h2>
            </div>

            <div className="sidebar-intro">
              <h2>Start your journey.</h2>
              <p>Track workouts, hit milestones, and elevate your fitness.</p>
            </div>

            <div className="streak-card">
              <div className="streak-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
              </div>
              <div className="streak-info">
                <h4>Build your streak</h4>
                <p>Every workout counts. Build consistency from day one.</p>
              </div>
            </div>
          </div>

          <div className="sidebar-footer">
            <span>SYSTEM VER. 2.4.1</span>
            <span>SECURE SESSION</span>
          </div>
        </div>

        {/* Right Form Area */}
        <div className="login-main">
          <div className="login-header">
            <h1>Create account</h1>
            <p>Enter your details to start tracking.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                value={username}
                type="text"
                name="username"
                id="username"
                placeholder="athlete123"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                type="email"
                name="email"
                id="email"
                placeholder="athlete@example.com"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="login-submit-btn">
              Continue
            </button>
          </form>

          <div className="login-footer">
            Already have an account?{" "}
            <Link className="create-account-link" to={"/login"}>
              Log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
