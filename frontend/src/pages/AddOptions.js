import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function AddOptions() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [optionText, setOptionText] = useState("");
    const [options, setOptions] = useState([]);

    const addOption = async () => {
        if (!optionText.trim()) {
            alert("Option text required");
            return;
        }
        try {
            await API.post("polls/add-choice/", {
                poll_id: id,
                text: optionText,
            });
            setOptions([...options, optionText]);
            setOptionText("");
        } catch {
            alert("Error adding option");
        }
    };

    return (
        <div className="main-page">
            <div className="content-card">
                <h4 className="mb-4">Add Options to Poll</h4>

                <label className="form-label">Option Text</label>
                <div className="d-flex gap-2 mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter an option..."
                        value={optionText}
                        onChange={(e) => setOptionText(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={addOption}>
                        Add
                    </button>
                </div>

                {options.length > 0 && (
                    <>
                        <h6 className="mb-2">Added Options:</h6>
                        <ul className="list-group mb-4">
                            {options.map((opt, index) => (
                                <li key={index} className="list-group-item">
                                    {opt}
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                <button
                    className="btn btn-success"
                    onClick={() => navigate("/polls")}
                >
                    Done — Go to Polls
                </button>
            </div>
        </div>
    );
}

export default AddOptions;
