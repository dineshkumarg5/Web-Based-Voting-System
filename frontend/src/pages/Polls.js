import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Polls() {
    const [polls, setPolls] = useState([]);
    const navigate = useNavigate();
    const isAdmin = localStorage.getItem("is_admin") === "true";

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const res = await API.get("polls/");
                setPolls(res.data);
            } catch {
                navigate("/");
            }
        };
        fetchPolls();
    }, [navigate]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this poll?")) return;
        try {
            await API.delete(`polls/delete/${id}/`);
            setPolls(polls.filter((poll) => poll.id !== id));
        } catch {
            alert("Error deleting poll");
        }
    };

    return (
        <div className="main-page">
            <div className="page-header">
                <h3>Available Polls</h3>
                {isAdmin && (
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/create-poll")}
                    >
                        + Create Poll
                    </button>
                )}
            </div>

            {polls.length === 0 && (
                <div className="content-card text-center text-muted">
                    No polls available yet.
                </div>
            )}

            {polls.map((poll) => (
                <div className="poll-card" key={poll.id}>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <h5 className="mb-0">{poll.question}</h5>
                        {poll.choices_count === 0 && (
                            <span className="badge bg-warning text-dark" title="No options added yet">
                                No options
                            </span>
                        )}
                    </div>
                    <div className="btn-group-gap">
                        <button
                            className="btn btn-success btn-sm"
                            onClick={() => navigate(`/vote/${poll.id}`)}
                            disabled={poll.choices_count === 0}
                            title={poll.choices_count === 0 ? "No options added yet" : ""}
                        >
                            Vote
                        </button>

                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => navigate(`/results/${poll.id}`)}
                        >
                            Results
                        </button>

                        {isAdmin && (
                            <>
                                <button
                                    className="btn btn-warning btn-sm"
                                    onClick={() => navigate(`/edit-poll/${poll.id}`)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(poll.id)}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Polls;
