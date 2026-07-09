import { useNavigate } from "react-router-dom";

function UserDashboard() {
    const navigate = useNavigate();

    return (
        <div className="page-center">
            <div className="dashboard-card">
                <h2>User Dashboard</h2>

                <div className="btn-group-gap">
                    <button
                        className="btn btn-success"
                        onClick={() => navigate("/polls")}
                    >
                        View Polls
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
