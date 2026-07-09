import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function Vote() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [selected, setSelected] = useState(null);
    const [alreadyVoted, setAlreadyVoted] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check if user already voted
                const votedRes = await API.get(`polls/${id}/has-voted/`);
                setAlreadyVoted(votedRes.data.voted);

                // Load poll + choices
                const pollRes = await API.get(`polls/results/${id}/`);
                setData(pollRes.data);
            } catch {
                navigate("/polls");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const submitVote = async () => {
        try {
            await API.post("polls/vote/", {
                poll_id: id,
                choice_id: selected,
            });
            alert("Vote submitted!");
            navigate(`/results/${id}`);
        } catch {
            alert("Something went wrong. Please try again.");
        }
    };

    if (loading) return <div className="page-center"><p>Loading...</p></div>;
    if (!data) return null;

    // ── Case 1: No choices added yet ──
    if (data.results.length === 0) {
        return (
            <div className="main-page">
                <div className="content-card text-center">
                    <button className="btn btn-link ps-0 mb-3" onClick={() => navigate("/polls")}>
                        ← Back to Polls
                    </button>
                    <h4 className="mb-3">{data.poll}</h4>
                    <p className="text-muted">⚠️ This poll has no options yet. Check back later.</p>
                </div>
            </div>
        );
    }

    // ── Case 2: Already voted ──
    if (alreadyVoted) {
        return (
            <div className="main-page">
                <div className="content-card text-center">
                    <button className="btn btn-link ps-0 mb-3" onClick={() => navigate("/polls")}>
                        ← Back to Polls
                    </button>
                    <h4 className="mb-3">{data.poll}</h4>
                    <p className="text-muted mb-4">✅ You have already voted on this poll.</p>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate(`/results/${id}`)}
                    >
                        View Results
                    </button>
                </div>
            </div>
        );
    }

    // ── Case 3: Normal vote form ──
    return (
        <div className="main-page">
            <div className="content-card">
                <button
                    className="btn btn-link ps-0 mb-3"
                    onClick={() => navigate("/polls")}
                >
                    ← Back to Polls
                </button>

                <h4 className="mb-4">{data.poll}</h4>

                {data.results.map((c) => (
                    <div
                        key={c.id}
                        className={`radio-option ${selected === c.id ? "selected" : ""}`}
                        onClick={() => setSelected(c.id)}
                    >
                        <input
                            type="radio"
                            name="choice"
                            id={`choice-${c.id}`}
                            checked={selected === c.id}
                            onChange={() => setSelected(c.id)}
                        />
                        <label htmlFor={`choice-${c.id}`}>{c.choice}</label>
                    </div>
                ))}

                <button
                    className="btn btn-primary mt-3"
                    onClick={submitVote}
                    disabled={!selected}
                >
                    Submit Vote
                </button>
            </div>
        </div>
    );
}

export default Vote;
