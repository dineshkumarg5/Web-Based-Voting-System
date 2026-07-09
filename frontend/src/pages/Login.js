import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("is_admin");

        try {
            const res = await API.post("login/", { username, password });
            localStorage.setItem("token", res.data.access);

            if (res.data.is_admin === true) {
                localStorage.setItem("is_admin", "true");
                navigate("/admin-dashboard");
            } else {
                localStorage.setItem("is_admin", "false");
                navigate("/user-dashboard");
            }
        } catch {
            alert("Invalid credentials");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <div className="login-page">

            {/* ── Left: Branding & Info ── */}
            <div className="login-info">
                <div className="login-info-inner">
                    <div className="login-logo">🗳️</div>
                    <h1 className="login-title">Poll App</h1>
                    <p className="login-tagline">
                        A simple platform to create polls, collect votes, and view results — all in one place.
                    </p>

                    <ul className="login-features">
                        <li>
                            <span className="feature-icon">📋</span>
                            <div>
                                <strong>Create Polls</strong>
                                <p>Admins can create polls and add multiple options.</p>
                            </div>
                        </li>
                        <li>
                            <span className="feature-icon">✅</span>
                            <div>
                                <strong>Cast Your Vote</strong>
                                <p>Users can vote on any active poll — once per poll.</p>
                            </div>
                        </li>
                        <li>
                            <span className="feature-icon">📊</span>
                            <div>
                                <strong>See Results</strong>
                                <p>View live vote counts for every poll instantly.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* ── Right: Login Form ── */}
            <div className="login-form-side">
                <div className="auth-card">
                    <h3>Login</h3>

                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Username or Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <button className="btn btn-primary w-100" onClick={handleLogin}>
                        Login
                    </button>

                    <p className="text-center mt-3 mb-0">
                        New user?{" "}
                        <span className="link-text" onClick={() => navigate("/register")}>
                            Register here
                        </span>
                    </p>
                </div>
            </div>

        </div>
    );
}

export default Login;
