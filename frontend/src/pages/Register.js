import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await API.post("register/", { username, email, password });
            alert("Registration successful. Please login.");
            navigate("/");
        } catch (err) {
            alert("Username already exists");
        }
    };

    return (
        <div className="page-center">
            <div className="auth-card">
                <h3>Register</h3>

                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="email"
                    className="form-control mb-3"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="btn btn-success w-100" onClick={handleRegister}>
                    Register
                </button>

                <p className="text-center mt-3 mb-0">
                    Already have an account?{" "}
                    <span className="link-text" onClick={() => navigate("/")}>
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Register;
