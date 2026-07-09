import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function CreatePoll() {
    const [question, setQuestion] = useState("");
    const navigate = useNavigate();

    const createPoll = async () => {
        if (!question.trim()) {
            alert("Poll question is required");
            return;
        }
        try {
            const res = await API.post("polls/create/", { question });
            const pollId = res.data.poll_id;
            alert("Poll created. Now add options.");
            navigate(`/add-options/${pollId}`);
        } catch {
            alert("Error creating poll");
        }
    };

    return (
        <div className="main-page">
            <div className="content-card">
                <button
                    className="btn btn-link ps-0 mb-3"
                    onClick={() => navigate("/polls")}
                >
                    ← Back to Polls
                </button>

                <h4 className="mb-4">Create New Poll</h4>

                <label className="form-label">Poll Question</label>
                <input
                    type="text"
                    className="form-control mb-4"
                    placeholder="Enter your poll question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />

                <button className="btn btn-primary" onClick={createPoll}>
                    Create Poll
                </button>
            </div>
        </div>
    );
}

export default CreatePoll;
