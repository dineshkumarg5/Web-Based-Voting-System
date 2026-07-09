import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function EditPoll() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [question, setQuestion] = useState("");
    const [choices, setChoices] = useState([]);
    const [newChoice, setNewChoice] = useState("");

    useEffect(() => {
        fetchPoll();
        fetchChoices();
    }, [id]);

    const fetchPoll = async () => {
        try {
            const res = await API.get(`polls/${id}/`);
            setQuestion(res.data.question);
        } catch {
            alert("Failed to load poll");
        }
    };

    const fetchChoices = async () => {
        try {
            const res = await API.get(`polls/${id}/choices/`);
            setChoices(res.data);
        } catch {
            alert("Failed to load choices");
        }
    };

    const updatePoll = async () => {
        try {
            await API.put(`polls/update/${id}/`, { question });
            alert("Poll updated successfully");
        } catch {
            alert("Update failed");
        }
    };

    const updateChoice = async (choiceId, text) => {
        try {
            await API.put(`choices/update/${choiceId}/`, { text });
            fetchChoices();
        } catch {
            alert("Failed to update choice");
        }
    };

    const deleteChoice = async (choiceId) => {
        if (!window.confirm("Delete this choice?")) return;
        try {
            await API.delete(`choices/delete/${choiceId}/`);
            fetchChoices();
        } catch {
            alert("Failed to delete choice");
        }
    };

    const addChoice = async () => {
        if (!newChoice.trim()) return;
        try {
            await API.post("polls/add-choice/", { poll_id: id, text: newChoice });
            setNewChoice("");
            fetchChoices();
        } catch {
            alert("Failed to add choice");
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

                <h4 className="mb-4">Edit Poll</h4>

                {/* Question Section */}
                <label className="form-label fw-semibold">Question</label>
                <div className="d-flex gap-2 mb-4">
                    <input
                        className="form-control"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                    <button className="btn btn-success" onClick={updatePoll}>
                        Save
                    </button>
                </div>

                {/* Choices Section */}
                <h6 className="fw-semibold mb-3">Choices</h6>

                {choices.map((choice) => (
                    <div className="d-flex gap-2 mb-2" key={choice.id}>
                        <input
                            className="form-control"
                            value={choice.text}
                            onChange={(e) =>
                                setChoices(
                                    choices.map((c) =>
                                        c.id === choice.id ? { ...c, text: e.target.value } : c
                                    )
                                )
                            }
                        />
                        <button
                            className="btn btn-warning btn-sm"
                            onClick={() => updateChoice(choice.id, choice.text)}
                        >
                            Update
                        </button>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteChoice(choice.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}

                {/* Add New Choice */}
                <div className="d-flex gap-2 mt-3">
                    <input
                        className="form-control"
                        placeholder="Add new choice..."
                        value={newChoice}
                        onChange={(e) => setNewChoice(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={addChoice}>
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditPoll;
