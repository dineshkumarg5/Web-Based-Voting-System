import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();

    return (
        <div className="page-center">
            <div className="dashboard-card">
                <h2>Admin Dashboard</h2>

                <div className="btn-group-gap">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/create-poll")}
                    >
                        Create Poll
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/polls")}
                    >
                        View Polls
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
