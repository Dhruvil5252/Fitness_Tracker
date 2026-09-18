import { Link } from "react-router";
import "../login.form.scss";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { loading, handleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({ email, password });
    navigate("/");
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
              <h2>Welcome back.</h2>
              <p>Your plan, your progress, right where you left it.</p>
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
                <h4>Streak intact</h4>
                <p>Pick up your training right where you paused.</p>
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
            <h1>Log in</h1>
            <p>Enter your details to continue.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
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
              Log in
            </button>
          </form>

          <div className="login-footer">
            No account?{" "}
            <Link className="create-account-link" to={"/register"}>
              Create one
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
