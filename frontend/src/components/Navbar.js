import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    if (!token) return null; // Don't show on Login / Register

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <nav className="app-navbar">
            <span className="navbar-brand" onClick={() => navigate("/polls")}>
                🗳️ Poll App
            </span>
            <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
                Logout
            </button>
        </nav>
    );
}

export default Navbar;
